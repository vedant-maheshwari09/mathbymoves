import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  confirmEmail: z.string().email("Please confirm your email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
}).refine(data => data.email === data.confirmEmail, {
  message: "Email addresses must match",
  path: ["confirmEmail"],
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactSection() {
  const { toast } = useToast();
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      confirmEmail: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Verification email sent!",
        description: "Check your email inbox and click the verification link to complete your message submission.",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  const services = [
    "AMC 8 Preparation Classes",
    "Chess Coaching (Beginner to Expert)",
    "Private Tutoring Sessions",
    "Group Classes"
  ];

  return (
    <section id="contact" className="py-20 bg-chess-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-4xl md:text-5xl text-white mb-4">Get In Touch</h2>
          <div className="w-24 h-1 bg-tournament-gold mx-auto mb-6"></div>
          <p className="text-chess-white text-lg max-w-2xl mx-auto">
            Email is the best way to reach me for AMC 8 preparation, chess coaching, or private tutoring sessions
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="font-semibold text-2xl text-white mb-8">Contact Information</h3>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-center text-chess-white">
                <Mail className="text-tournament-gold text-xl mr-4 w-6" size={24} />
                <div>
                  <div className="font-medium">Email (Preferred Contact Method)</div>
                  <div className="text-chess-white">mathbymoves@gmail.com</div>
                </div>
              </div>
              
              <div className="flex items-center text-chess-white">
                <Phone className="text-tournament-gold text-xl mr-4 w-6" size={24} />
                <div>
                  <div className="font-medium">Phone</div>
                  <div className="text-chess-white">XXX-XXX-XXXX</div>
                </div>
              </div>
              
              <div className="flex items-center text-chess-white">
                <MapPin className="text-tournament-gold text-xl mr-4 w-6" size={24} />
                <div>
                  <div className="font-medium">Location</div>
                  <div className="text-chess-white">San Diego, California</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-lg text-white mb-4">Services Offered</h4>
              <ul className="space-y-2 text-chess-white">
                {services.map((service, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="text-tournament-gold mr-3" size={16} />
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white rounded-xl p-8 shadow-xl space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-chess-black font-medium">First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-chess-black font-medium">Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-chess-black font-medium">Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-chess-black font-medium">Confirm Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Confirm your email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-chess-black font-medium">Subject</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="chess-coaching">Chess Coaching Inquiry</SelectItem>
                          <SelectItem value="amc8-classes">AMC 8 Preparation Classes</SelectItem>
                          <SelectItem value="private-tutoring">Private Tutoring Session</SelectItem>
                          <SelectItem value="general">General Question</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-chess-black font-medium">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={5} 
                          placeholder="Tell me about your chess goals and how I can help..." 
                          className="resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <Mail className="text-blue-600 mr-3 mt-0.5" size={20} />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Email Verification Required</p>
                      <p>After submitting, check your email inbox and click the verification link to complete your message. Only verified emails reach Vedant.</p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={contactMutation.isPending}
                  className="w-full bg-tournament-gold text-chess-black py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-200"
                >
                  {contactMutation.isPending ? (
                    "Sending..."
                  ) : (
                    <>
                      <Mail className="mr-2" size={16} />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
