import { useState } from "react";
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

const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  confirmEmail: z.string().email("Please enter a valid email address"),
  subject: z.enum(["chess-coaching", "amc8-prep", "general"], {
    required_error: "Please select a subject"
  }),
  message: z.string()
    .min(20, "Message must be at least 20 characters")
    .max(2000, "Message must be less than 2000 characters")
}).refine((data) => data.email === data.confirmEmail, {
  message: "Emails don't match",
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
      subject: undefined,
      message: ""
    }
  });

  const onSubmit = (data: ContactFormData) => {
    // Create mailto link for direct email
    const subject = encodeURIComponent(`${data.subject === 'chess-coaching' ? 'Chess Coaching Inquiry' : 
                                        data.subject === 'amc8-prep' ? 'AMC 8 Preparation Inquiry' : 
                                        'General Inquiry'} - ${data.firstName} ${data.lastName}`);
    
    const body = encodeURIComponent(`Hello Vedant,

${data.message}

Best regards,
${data.firstName} ${data.lastName}
Email: ${data.email}`);

    const mailtoLink = `mailto:mathbymoves@gmail.com?subject=${subject}&body=${body}`;
    
    // Open default email client
    window.location.href = mailtoLink;
    
    setIsSubmitted(true);
    toast({
      title: "Email client opened",
      description: "Your default email application should now be open with your message ready to send.",
    });
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="py-20 bg-chess-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-8 mb-8">
            <Check className="text-green-400 text-4xl mx-auto mb-4" size={48} />
            <h3 className="text-2xl font-semibold mb-4 text-green-400">Email Ready to Send!</h3>
            <p className="text-gray-300 mb-4">
              Your email application should now be open with your message pre-filled. 
              Simply click send to reach out to Vedant directly at mathbymoves@gmail.com
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
    <section id="contact" className="py-20 bg-chess-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-4xl md:text-5xl mb-4">Get in Touch</h2>
          <div className="w-24 h-1 bg-tournament-gold mx-auto mb-6"></div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Ready to elevate your chess or mathematics skills? Reach out for personalized coaching from a National Master and competitive math champion.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-tournament-gold">Contact Information</h3>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-center">
                <Mail className="text-tournament-gold mr-4" size={24} />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-gray-300">mathbymoves@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <MapPin className="text-tournament-gold mr-4" size={24} />
                <div>
                  <p className="font-semibold">Location</p>
                  <p className="text-gray-300">San Diego, California</p>
                </div>
              </div>
            </div>

            <div className="bg-chess-gray/10 rounded-lg p-6">
              <h4 className="font-semibold text-lg mb-3 text-tournament-gold">Coaching Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Chess instruction (Beginner to Expert level)</li>
                <li>• AMC 8 mathematics preparation</li>
                <li>• Tournament preparation and competitive psychology</li>
                <li>• Personalized study plans and progress tracking</li>
              </ul>
            </div>
          </div>

          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">First Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-white/10 border-gray-600 text-white placeholder:text-gray-400"
                            placeholder="Enter your first name"
                          />
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
                          <Input 
                            {...field} 
                            className="bg-white/10 border-gray-600 text-white placeholder:text-gray-400"
                            placeholder="Enter your last name"
                          />
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
                        <Input 
                          {...field} 
                          type="email"
                          className="bg-white/10 border-gray-600 text-white placeholder:text-gray-400"
                          placeholder="Enter your email address"
                        />
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
                        <Input 
                          {...field} 
                          type="email"
                          className="bg-white/10 border-gray-600 text-white placeholder:text-gray-400"
                          placeholder="Confirm your email address"
                        />
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
                          <SelectTrigger className="bg-white/10 border-gray-600 text-white">
                            <SelectValue placeholder="Select a subject" />
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
                          {...field}
                          className="bg-white/10 border-gray-600 text-white placeholder:text-gray-400 min-h-[120px]"
                          placeholder="Tell me about your goals, current level, and what you'd like to achieve..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-tournament-gold hover:bg-tournament-gold/90 text-chess-black font-semibold py-3"
                >
                  Open Email to Send Message
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}