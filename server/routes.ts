import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";
import nodemailer from "nodemailer";

export async function registerRoutes(app: Express): Promise<Server> {
  // Enhanced rate limiting to prevent spam
  const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
  const emailRateLimitMap = new Map<string, { count: number; lastReset: number }>();
  const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
  const MAX_SUBMISSIONS_PER_IP = 3; // Max 3 submissions per 15 minutes per IP
  const MAX_SUBMISSIONS_PER_EMAIL = 2; // Max 2 submissions per 15 minutes per email

  const checkRateLimit = (ip: string, email: string): { allowed: boolean; reason?: string } => {
    const now = Date.now();
    
    // Check IP rate limit
    const ipLimit = rateLimitMap.get(ip);
    if (!ipLimit || now - ipLimit.lastReset > RATE_LIMIT_WINDOW) {
      rateLimitMap.set(ip, { count: 1, lastReset: now });
    } else {
      if (ipLimit.count >= MAX_SUBMISSIONS_PER_IP) {
        return { allowed: false, reason: "Too many submissions from this location. Please wait 15 minutes." };
      }
      ipLimit.count++;
    }
    
    // Check email rate limit
    const emailLimit = emailRateLimitMap.get(email.toLowerCase());
    if (!emailLimit || now - emailLimit.lastReset > RATE_LIMIT_WINDOW) {
      emailRateLimitMap.set(email.toLowerCase(), { count: 1, lastReset: now });
    } else {
      if (emailLimit.count >= MAX_SUBMISSIONS_PER_EMAIL) {
        return { allowed: false, reason: "Too many submissions from this email address. Please wait 15 minutes." };
      }
      emailLimit.count++;
    }
    
    return { allowed: true };
  };

  // Email configuration
  const createTransporter = () => {
    // Using Gmail SMTP (you'll need to provide app password)
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'mathbymoves@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'sflt zwjd mimg gcxr' // Gmail app password
      }
    });
  };

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
      const requestData = req.body;
      
      // Validate email confirmation matches
      if (requestData.email !== requestData.confirmEmail) {
        return res.status(400).json({
          success: false,
          message: "Email addresses do not match. Please check and try again."
        });
      }
      
      // Remove confirmEmail from data before validation
      const { confirmEmail, ...dataToValidate } = requestData;
      const validatedData = insertContactMessageSchema.parse(dataToValidate);
      
      // Enhanced rate limiting check
      const rateLimitResult = checkRateLimit(clientIP, validatedData.email);
      if (!rateLimitResult.allowed) {
        return res.status(429).json({
          success: false,
          message: rateLimitResult.reason
        });
      }
      
      // Enhanced email validation and spam protection
      const emailDomain = validatedData.email.split('@')[1]?.toLowerCase();
      const suspiciousDomains = ['tempmail', 'guerrillamail', '10minutemail', 'mailinator', 'throwaway', 'trashmail', 'yopmail', 'sharklasers'];
      const isDisposableEmail = suspiciousDomains.some(domain => emailDomain?.includes(domain));
      
      // Enhanced spam keyword detection
      const spamKeywords = ['crypto', 'bitcoin', 'loan', 'casino', 'viagra', 'pharmacy', 'seo service', 'make money', 'get rich', 'investment opportunity'];
      const hasSpamContent = spamKeywords.some(keyword => 
        validatedData.message.toLowerCase().includes(keyword) || 
        validatedData.subject.toLowerCase().includes(keyword) ||
        validatedData.firstName.toLowerCase().includes(keyword) ||
        validatedData.lastName.toLowerCase().includes(keyword)
      );
      
      // Check for suspicious patterns
      const hasRepeatedChars = /(.)\1{4,}/.test(validatedData.message); // 5+ repeated characters
      const hasExcessiveLinks = (validatedData.message.match(/http/gi) || []).length > 2;
      const hasExcessiveCaps = validatedData.message.split('').filter(c => c === c.toUpperCase() && /[A-Z]/.test(c)).length > validatedData.message.length * 0.5;
      
      // Block suspicious submissions
      if (isDisposableEmail) {
        return res.status(400).json({
          success: false,
          message: "Please use a permanent email address. Temporary email services are not allowed."
        });
      }
      
      if (hasSpamContent) {
        return res.status(400).json({
          success: false,
          message: "Your message contains prohibited content. Please revise and try again."
        });
      }
      
      if (hasRepeatedChars || hasExcessiveLinks || hasExcessiveCaps) {
        return res.status(400).json({
          success: false,
          message: "Your message appears to be spam. Please write a genuine inquiry."
        });
      }
      
      // Check message length and quality
      if (validatedData.message.length < 20) {
        return res.status(400).json({
          success: false,
          message: "Please provide a more detailed message (minimum 20 characters)."
        });
      }
      
      if (validatedData.message.length > 2000) {
        return res.status(400).json({
          success: false,
          message: "Message is too long. Please keep it under 2000 characters."
        });
      }
      
      // Generate verification token and store message as unverified
      const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const messageWithToken = { ...validatedData, verificationToken };
      const message = await storage.createContactMessage(messageWithToken);
      
      // Update the stored message with the verification token
      message.verificationToken = verificationToken;
      
      // Send verification email to user
      const emailPassword = process.env.EMAIL_PASSWORD || 'sflt zwjd mimg gcxr';
      if (emailPassword) {
        try {
          const transporter = createTransporter();
          const verificationUrl = `${req.protocol}://${req.get('host')}/api/verify-email?token=${verificationToken}`;
          
          const verificationMailOptions = {
            from: process.env.EMAIL_USER || 'mathbymoves@gmail.com',
            to: validatedData.email,
            subject: 'Verify Your Email - Contact Form Submission',
            html: `
              <h3>Email Verification Required</h3>
              <p>Hello ${validatedData.firstName},</p>
              <p>Thank you for your interest in chess coaching and AMC 8 preparation!</p>
              <p>To complete your message submission, please verify your email address by clicking the link below:</p>
              <p><a href="${verificationUrl}" style="background-color: #D4AF37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email Address</a></p>
              <p>Or copy and paste this link into your browser: ${verificationUrl}</p>
              <p>Once verified, your message will be forwarded to Vedant.</p>
              <p><strong>Your Message Preview:</strong></p>
              <p><em>Subject:</em> ${validatedData.subject}</p>
              <p><em>Message:</em> ${validatedData.message}</p>
              <hr>
              <p><small>This verification link will expire in 24 hours. If you did not submit this form, you can safely ignore this email.</small></p>
            `
          };
          
          await transporter.sendMail(verificationMailOptions);
          console.log(`Verification email sent to: ${validatedData.email}`);
        } catch (emailError) {
          console.error('Failed to send verification email:', emailError);
          return res.status(500).json({
            success: false,
            message: "Failed to send verification email. Please try again."
          });
        }
      }
      
      res.json({
        success: true,
        message: "Please check your email and click the verification link to complete your message submission."
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to send message" 
        });
      }
    }
  });

  // Get contact messages (for admin purposes)
  app.get("/api/contact-messages", async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch messages" 
      });
    }
  });

  // Email verification endpoint
  app.get("/api/verify-email", async (req, res) => {
    try {
      const token = req.query.token as string;
      
      if (!token) {
        return res.status(400).send(`
          <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
              <h2 style="color: #cc0000;">Invalid Verification Link</h2>
              <p>This verification link is invalid or incomplete.</p>
              <p>Please check your email for the correct verification link.</p>
            </body>
          </html>
        `);
      }

      // Find message by verification token
      const message = await storage.getContactMessageByToken(token);
      
      if (!message) {
        return res.status(404).send(`
          <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
              <h2 style="color: #cc0000;">Verification Link Not Found</h2>
              <p>This verification link is invalid, expired, or has already been used.</p>
              <p>If you need to submit a new message, please visit the contact form again.</p>
            </body>
          </html>
        `);
      }

      if (message.isVerified === "true") {
        return res.status(200).send(`
          <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
              <h2 style="color: #28a745;">Already Verified</h2>
              <p>Your email address has already been verified and your message has been sent to Vedant.</p>
              <p>Thank you for your interest in chess coaching and AMC 8 preparation!</p>
            </body>
          </html>
        `);
      }

      // Mark message as verified
      await storage.updateContactMessageVerification(message.id, "true");

      // Now send the verified message to mathbymoves@gmail.com
      const emailPassword = process.env.EMAIL_PASSWORD || 'sflt zwjd mimg gcxr';
      if (emailPassword) {
        try {
          const transporter = createTransporter();
          
          const mailOptions = {
            from: process.env.EMAIL_USER || 'mathbymoves@gmail.com',
            to: 'mathbymoves@gmail.com',
            subject: `VERIFIED Contact Form Message: ${message.subject}`,
            html: `
              <h3>✅ Verified Contact Form Submission</h3>
              <p><strong>Name:</strong> ${message.firstName} ${message.lastName}</p>
              <p><strong>Email:</strong> ${message.email} (✅ VERIFIED)</p>
              <p><strong>Subject:</strong> ${message.subject}</p>
              <p><strong>Message:</strong></p>
              <p>${message.message}</p>
              <hr>
              <p><em>This email was verified by the sender clicking a verification link.</em></p>
              <p><small>Submitted: ${message.createdAt}</small></p>
            `
          };
          
          await transporter.sendMail(mailOptions);
          console.log(`Verified message forwarded to mathbymoves@gmail.com from: ${message.email}`);
        } catch (emailError) {
          console.error('Failed to forward verified message:', emailError);
        }
      }

      // Return success page
      res.status(200).send(`
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
            <h2 style="color: #28a745;">Email Verified Successfully!</h2>
            <p>Thank you, ${message.firstName}! Your email address has been verified.</p>
            <p>Your message has been forwarded to Vedant and he will respond as soon as possible.</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4>Your Message:</h4>
              <p><strong>Subject:</strong> ${message.subject}</p>
              <p><strong>Message:</strong> ${message.message}</p>
            </div>
            <p>Expect a response within 24-48 hours for chess coaching and AMC 8 preparation inquiries.</p>
          </body>
        </html>
      `);

    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).send(`
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
            <h2 style="color: #cc0000;">Verification Error</h2>
            <p>An error occurred while verifying your email. Please try again or contact support.</p>
          </body>
        </html>
      `);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
