import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, MapPin, Check } from "lucide-react";
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
  message: z.string().min(20, "Message must be at least 20 characters long").max(2000, "Message must be under 2000 characters"),
}).refine(data => data.email === data.confirmEmail, {
  message: "Email addresses must match",
  path: ["confirmEmail"],
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send message");
      }
      
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Verification Email Sent!",
        description: "Please check your email and click the verification link to complete your message submission.",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="py-20 bg-chess-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-8 mb-8">
            <Check className="text-green-400 text-4xl mx-auto mb-4" size={48} />
            <h3 className="text-2xl font-semibold mb-4 text-green-400">Verification Email Sent!</h3>
            <p className="text-chess-white mb-4">
              Please check your email inbox and click the verification link to confirm your email address. 
              Once verified, your message will be forwarded to mathbymoves@gmail.com.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
            >
              Send Another Message
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-chess-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-4xl md:text-5xl text-white mb-4">Get In Touch</h2>
          <div className="w-24 h-1 bg-tournament-gold mx-auto mb-6"></div>
          <p className="text-chess-white text-lg max-w-2xl mx-auto">
            Ready to elevate your chess or mathematics skills? Send me a message and I'll get back to you soon.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-tournament-gold text-lg font-semibold mb-4">Contact Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="text-tournament-gold mr-3 flex-shrink-0" size={18} />
                  <div>
                    <div className="text-white font-medium text-sm">Email (best contact method)</div>
                    <div className="text-chess-white text-sm">mathbymoves@gmail.com</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="text-tournament-gold mr-3 flex-shrink-0" size={18} />
                  <div>
                    <div className="text-white font-medium text-sm">Location</div>
                    <div className="text-chess-white text-sm">San Diego, California</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-tournament-gold text-lg font-semibold mb-4">Coaching Services</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-tournament-gold mr-2 text-sm">•</span>
                  <span className="text-chess-white text-sm">Chess instruction (Beginner to Expert level)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tournament-gold mr-2 text-sm">•</span>
                  <span className="text-chess-white text-sm">AMC 8 mathematics preparation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tournament-gold mr-2 text-sm">•</span>
                  <span className="text-chess-white text-sm">Tournament preparation and competitive psychology</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tournament-gold mr-2 text-sm">•</span>
                  <span className="text-chess-white text-sm">Personalized study plans and progress tracking</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-chess-dark p-8 rounded-lg">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your first name" {...field} />
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
                        <FormLabel className="text-white">Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your last name" {...field} />
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
                      <FormLabel className="text-white">Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email address" {...field} />
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
                      <FormLabel className="text-white">Confirm Email Address</FormLabel>
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
                      <FormLabel className="text-white">Subject</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select inquiry type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="chess-coaching">Chess Coaching</SelectItem>
                          <SelectItem value="amc8-prep">AMC 8 Preparation</SelectItem>
                          <SelectItem value="general">General Inquiry</SelectItem>
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
                      <FormLabel className="text-white">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please describe your goals, current level, and what you're looking for in coaching..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <Mail className="text-blue-600 mr-3 mt-0.5" size={20} />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Email Verification Required</p>
                      <p>You'll receive a verification email to confirm your address before your message is sent to mathbymoves@gmail.com</p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-tournament-gold text-chess-black py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-200"
                  disabled={contactMutation.isPending}
                >
                  {contactMutation.isPending ? (
                    <>Sending Verification Email...</>
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