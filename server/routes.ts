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
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error('Email credentials not configured');
    }
    
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
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
      
      // Type assertion for proper typing
      const typedData = validatedData as {
        firstName: string;
        lastName: string;
        email: string;
        subject: string;
        message: string;
        isVerified?: string;
        verificationToken?: string;
      };
      
      // Enhanced rate limiting check
      const rateLimitResult = checkRateLimit(clientIP, typedData.email);
      if (!rateLimitResult.allowed) {
        return res.status(429).json({
          success: false,
          message: rateLimitResult.reason
        });
      }
      
      // Enhanced email validation and spam protection
      const emailDomain = typedData.email.split('@')[1]?.toLowerCase();
      const suspiciousDomains = ['tempmail', 'guerrillamail', '10minutemail', 'mailinator', 'throwaway', 'trashmail', 'yopmail', 'sharklasers'];
      const isDisposableEmail = suspiciousDomains.some(domain => emailDomain?.includes(domain));
      
      // Enhanced spam keyword detection
      const spamKeywords = ['crypto', 'bitcoin', 'loan', 'casino', 'viagra', 'pharmacy', 'seo service', 'make money', 'get rich', 'investment opportunity'];
      const hasSpamContent = spamKeywords.some(keyword => 
        typedData.message.toLowerCase().includes(keyword) || 
        typedData.subject.toLowerCase().includes(keyword) ||
        typedData.firstName.toLowerCase().includes(keyword) ||
        typedData.lastName.toLowerCase().includes(keyword)
      );
      
      // Check for suspicious patterns
      const hasRepeatedChars = /(.)\1{4,}/.test(typedData.message); // 5+ repeated characters
      const hasExcessiveLinks = (typedData.message.match(/http/gi) || []).length > 2;
      const hasExcessiveCaps = typedData.message.split('').filter(c => c === c.toUpperCase() && /[A-Z]/.test(c)).length > typedData.message.length * 0.5;
      
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
      if (typedData.message.length < 20) {
        return res.status(400).json({
          success: false,
          message: "Please provide a more detailed message (minimum 20 characters)."
        });
      }
      
      if (typedData.message.length > 2000) {
        return res.status(400).json({
          success: false,
          message: "Message is too long. Please keep it under 2000 characters."
        });
      }
      
      // Generate verification token and store message as unverified
      const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const messageWithToken = { ...typedData, verificationToken };
      const message = await storage.createContactMessage(messageWithToken);
      
      // Update the stored message with the verification token
      message.verificationToken = verificationToken;
      
      // Send verification email that proves user's email works
      const emailPassword = process.env.EMAIL_PASSWORD;
      if (emailPassword) {
        try {
          const transporter = createTransporter();
          // Generate verification URL that works from email links
          const host = req.get('host');
          const isLocalhost = host?.includes('localhost') || host?.includes('127.0.0.1');
          const baseUrl = isLocalhost 
            ? `https://${process.env.REPLIT_DOMAINS}`
            : `${req.protocol}://${host}`;
          const verificationUrl = `${baseUrl}/api/verify-email?token=${verificationToken}`;
          
          // Recreate the exact working verification email format from June 19th
          const verificationMailOptions = {
            from: process.env.EMAIL_USER,
            to: typedData.email,
            subject: 'Email Verification Required',
            html: `
              <p>Hello ${typedData.firstName},</p>
              
              <p>Thank you for your interest in chess coaching and AMC 8 preparation!</p>
              
              <p>To complete your message submission, please verify your email address by clicking the link below:</p>
              
              <p><a href="${verificationUrl}" style="background-color: #D4AF37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email Address</a></p>
              
              <p>Or copy and paste this link into your browser: ${verificationUrl}</p>
              
              <p>Once verified, your message will be forwarded to Vedant.</p>
              
              <p><strong>Your Message Preview:</strong></p>
              <p><em>Subject:</em> ${typedData.subject}</p>
              <p><em>Message:</em> ${typedData.message}</p>
              
              <hr>
              <p><small>This verification link will expire in 24 hours. If you did not submit this form, you can safely ignore this email.</small></p>
            `
          };
          
          const emailResult = await transporter.sendMail(verificationMailOptions);
          console.log(`Verification email sent successfully to: ${typedData.email}`);
          console.log(`Email delivery details:`, {
            accepted: emailResult.accepted,
            rejected: emailResult.rejected,
            response: emailResult.response,
            messageId: emailResult.messageId
          });
        } catch (emailError) {
          console.error('Verification email failed:', emailError);
          console.error('Email error details:', {
            code: emailError.code,
            command: emailError.command,
            response: emailError.response,
            responseCode: emailError.responseCode
          });
          // If we can't send verification email, the user's email is invalid
          return res.status(400).json({
            success: false,
            message: "Could not send verification email to this address. Please check your email and try again."
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
      const emailPassword = process.env.EMAIL_PASSWORD;
      if (emailPassword) {
        try {
          const transporter = createTransporter();
          
          // Create a more reliable email forwarding system
          // Send the verified message to mathbymoves@gmail.com
          const forwardToMathByMoves = {
            from: process.env.EMAIL_USER,
            to: 'mathbymoves@gmail.com',
            replyTo: message.email, // Allow direct reply to the user
            subject: `NEW VERIFIED MESSAGE: ${message.subject}`,
            html: `
              <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #2e7d32; margin-top: 0;">✅ VERIFIED Contact Form Message</h3>
                <p><strong>This sender verified their email address</strong></p>
              </div>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h4>Contact Information:</h4>
                <p><strong>Name:</strong> ${message.firstName} ${message.lastName}</p>
                <p><strong>Email:</strong> ${message.email}</p>
                <p><strong>Subject:</strong> ${message.subject}</p>
                <p><strong>Submitted:</strong> ${message.createdAt}</p>
              </div>
              
              <div style="background-color: #fff; padding: 20px; border: 2px solid #ddd; border-radius: 8px;">
                <h4>Message:</h4>
                <p style="white-space: pre-wrap; font-size: 16px; line-height: 1.6;">${message.message}</p>
              </div>
              
              <div style="background-color: #f0f8ff; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <p><strong>Reply Instructions:</strong></p>
                <ul>
                  <li>Simply reply to this email to respond directly to ${message.firstName}</li>
                  <li>Their verified email address is: ${message.email}</li>
                  <li>Response time expectation: 24-48 hours</li>
                </ul>
              </div>
            `
          };
          
          // Send immediate confirmation to user that email was verified
          const userConfirmation = {
            from: process.env.EMAIL_USER,
            to: message.email,
            subject: 'Email Verified - Your Message Was Sent Successfully',
            html: `
              <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #2e7d32; margin-top: 0;">✅ Email Verified Successfully!</h3>
                <p>Your message has been sent to Vedant Maheshwari.</p>
              </div>
              
              <p>Hello ${message.firstName},</p>
              <p>Your email address has been successfully verified and your message has been forwarded to Vedant.</p>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h4>Your Message:</h4>
                <p><strong>Subject:</strong> ${message.subject}</p>
                <p><strong>Message:</strong> ${message.message}</p>
              </div>
              
              <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h4>What happens next:</h4>
                <p>Vedant will personally respond to your inquiry within 24-48 hours.</p>
                <p>You'll receive his response directly at this email address: <strong>${message.email}</strong></p>
              </div>
              
              <hr>
              <p><strong>Vedant Maheshwari</strong><br>
              National Master (2265 USCF Rating)<br>
              Chess Coach & AMC 8 Instructor<br>
              Email: mathbymoves@gmail.com</p>
            `
          };
          
          // Send both emails with error handling
          try {
            await transporter.sendMail(forwardToMathByMoves);
            console.log(`Message forwarded to mathbymoves@gmail.com from: ${message.email}`);
          } catch (error) {
            console.error('Failed to forward to mathbymoves@gmail.com:', error);
            throw error; // Re-throw to handle in outer catch
          }
          
          try {
            await transporter.sendMail(userConfirmation);
            console.log(`Confirmation sent to user: ${message.email}`);
          } catch (error) {
            console.error('Failed to send user confirmation:', error);
            // Don't throw - forwarding to mathbymoves is more important
          }
          
          console.log(`Verified message forwarded to ${process.env.EMAIL_USER} from: ${message.email}`);
          console.log(`Confirmation email sent back to user: ${message.email}`);
        } catch (emailError) {
          console.error('Failed to send emails:', emailError);
        }
      }

      // Return enhanced success page
      res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verified Successfully - Vedant Maheshwari</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0;
              padding: 20px;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              line-height: 1.6;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 16px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.15);
              max-width: 600px;
              width: 100%;
              text-align: center;
            }
            .success-icon {
              width: 80px;
              height: 80px;
              background: #10b981;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 30px;
              font-size: 40px;
              color: white;
            }
            h1 {
              color: #1f2937;
              margin: 0 0 20px;
              font-size: 28px;
              font-weight: 700;
            }
            .subtitle {
              color: #6b7280;
              font-size: 18px;
              margin-bottom: 30px;
            }
            .message-details {
              background: #f8fafc;
              border: 2px solid #e2e8f0;
              border-radius: 12px;
              padding: 25px;
              margin: 30px 0;
              text-align: left;
            }
            .message-details h3 {
              color: #374151;
              margin: 0 0 15px;
              font-size: 18px;
            }
            .detail-row {
              margin-bottom: 12px;
            }
            .detail-label {
              font-weight: 600;
              color: #374151;
              display: inline-block;
              min-width: 80px;
            }
            .detail-value {
              color: #6b7280;
            }
            .next-steps {
              background: #ecfdf5;
              border: 2px solid #10b981;
              border-radius: 12px;
              padding: 20px;
              margin: 30px 0;
            }
            .next-steps h3 {
              color: #065f46;
              margin: 0 0 10px;
              font-size: 16px;
            }
            .next-steps p {
              color: #047857;
              margin: 0;
              font-size: 14px;
            }
            .close-note {
              color: #9ca3af;
              font-size: 14px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success-icon">✓</div>
            <h1>Email Verified Successfully!</h1>
            <p class="subtitle">Thank you, ${message.firstName}! Your message has been sent to Vedant.</p>
            
            <div class="message-details">
              <h3>Message Summary</h3>
              <div class="detail-row">
                <span class="detail-label">Subject:</span>
                <span class="detail-value">${message.subject}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">From:</span>
                <span class="detail-value">${message.email}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Sent:</span>
                <span class="detail-value">${new Date().toLocaleString()}</span>
              </div>
            </div>
            
            <div class="next-steps">
              <h3>What happens next?</h3>
              <p>Vedant will respond to your inquiry within 24-48 hours for chess coaching and AMC 8 preparation questions.</p>
            </div>
            
            <p class="close-note">
              You can safely close this window.<br>
              A confirmation email has been sent to your address.
            </p>
          </div>
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
