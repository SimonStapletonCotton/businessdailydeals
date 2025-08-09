import Navbar from "@/components/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create mailto link with form data
    const mailtoLink = `mailto:info@businessdailydeals.com.za?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    window.location.href = mailtoLink;
    
    toast({
      title: "Opening Email Client",
      description: "Your default email client will open with your message ready to send.",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen page-contact">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Get in touch with Business Daily Deals - we're here to help suppliers and buyers connect successfully
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-800 dark:text-slate-100 mb-4">
                  Get in Touch
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 text-lg">
                  We're here to support your B2B trading journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-slate-500 to-slate-600 p-3 rounded-xl">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100">Email</h4>
                    <div className="space-y-1">
                      <p className="text-slate-600 dark:text-slate-300">simon@businessdailydeals.co.za</p>
                      <p className="text-slate-600 dark:text-slate-300">admin@businessdailydeals.co.za</p>
                      <p className="text-slate-600 dark:text-slate-300">info@businessdailydeals.com.za</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-slate-500 to-slate-600 p-3 rounded-xl">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100">Phone</h4>
                    <p className="text-slate-600 dark:text-slate-300">082 495 7997</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-slate-500 to-slate-600 p-3 rounded-xl">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100">Address</h4>
                    <p className="text-slate-600 dark:text-slate-300">
                      123 Business District<br />
                      Johannesburg, Gauteng 2000<br />
                      South Africa
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-slate-500 to-slate-600 p-3 rounded-xl">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100">Business Hours</h4>
                    <p className="text-slate-600 dark:text-slate-300">
                      Monday - Friday: 8:00 AM - 5:00 PM SAST<br />
                      Saturday: 9:00 AM - 1:00 PM SAST<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Help & Help Center */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800 dark:text-slate-100">
                  Help Center
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-700">
                  <div className="flex items-center space-x-3 mb-2">
                    <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <h5 className="font-semibold text-emerald-800 dark:text-emerald-200">Help Center Support</h5>
                  </div>
                  <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                    admin@businessdailydeals.co.za
                  </p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                    For all support inquiries, technical help, and account assistance
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-slate-700 dark:text-slate-200">For Suppliers:</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Questions about posting deals, managing your account, or advertising rates
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-slate-700 dark:text-slate-200">For Buyers:</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Help with finding deals, setting up notifications, or using search features
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-slate-700 dark:text-slate-200">Technical Support:</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Website issues, account problems, or payment questions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-800 dark:text-slate-100">
                Send us a Message
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300">
                Fill out the form below and we'll get back to you within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 dark:text-slate-200">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="border-slate-200 dark:border-slate-600"
                      data-testid="input-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 dark:text-slate-200">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@company.co.za"
                      className="border-slate-200 dark:border-slate-600"
                      data-testid="input-email"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-slate-700 dark:text-slate-200">
                    Subject *
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is your inquiry about?"
                    className="border-slate-200 dark:border-slate-600"
                    data-testid="input-subject"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-slate-700 dark:text-slate-200">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please describe your question or concern in detail..."
                    className="border-slate-200 dark:border-slate-600 min-h-[120px] resize-none"
                    data-testid="textarea-message"
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white py-6 text-lg font-semibold transition-all duration-300"
                  data-testid="button-submit"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}