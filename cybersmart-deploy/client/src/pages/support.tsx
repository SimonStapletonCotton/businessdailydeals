import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Clock, HelpCircle, MessageSquare, Shield, Zap } from "lucide-react";
import { Link } from "wouter";

export default function Support() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-slate-500 to-slate-600 p-4 rounded-xl">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-4">
            Support Center
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Get help with your Business Daily Deals experience - we're here to assist suppliers and buyers
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          
          {/* Help Center - Primary Support */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-800 dark:text-slate-100 flex items-center gap-3">
                <Mail className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                Help Center
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Primary Support Contact */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 rounded-lg border border-emerald-200 dark:border-emerald-700">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-emerald-800 dark:text-emerald-200">Primary Support</h3>
                    <p className="text-emerald-600 dark:text-emerald-400">Get help with all your questions</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                    admin@businessdailydeals.co.za
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400">
                    For all support inquiries, technical help, account assistance, and general questions
                  </p>
                </div>
              </div>

              {/* What We Help With */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    For Suppliers
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <li>• Account registration and setup</li>
                    <li>• Posting HOT and REGULAR deals</li>
                    <li>• Managing your supplier dashboard</li>
                    <li>• Understanding advertising rates</li>
                    <li>• Payment and billing questions</li>
                    <li>• Verification process support</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                    For Buyers
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <li>• Account creation and management</li>
                    <li>• Finding and browsing deals</li>
                    <li>• Setting up keyword notifications</li>
                    <li>• Using search and filters</li>
                    <li>• Contacting suppliers</li>
                    <li>• "Find Me a Deal" requests</li>
                  </ul>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <div>
                    <h5 className="font-medium text-slate-800 dark:text-slate-200">Response Time</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      We aim to respond to all inquiries within 24 hours during business days
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-6">
            
            {/* Contact Form */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  Quick Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/contact">
                  <Button className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white" data-testid="button-contact-form">
                    Send Message
                  </Button>
                </Link>
                <p className="text-sm text-slate-600 dark:text-slate-300 text-center">
                  Use our contact form for detailed inquiries
                </p>
              </CardContent>
            </Card>

            {/* Phone Support */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  Phone Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">082 495 7997</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                    Monday - Friday: 8:00 AM - 5:00 PM SAST<br />
                    Saturday: 9:00 AM - 1:00 PM SAST
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Monday - Friday:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">8:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Saturday:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">9:00 AM - 1:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Sunday:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">Closed</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    All times in South African Standard Time (SAST)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-800 dark:text-slate-100 flex items-center gap-3">
              <HelpCircle className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                    How do I register as a supplier?
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Click "Register as SUPPLIER" from the main menu and complete the registration form. All registrations are currently FREE until January 1st, 2026.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                    What's the difference between HOT and REGULAR deals?
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    HOT deals get premium placement on the home page and higher visibility, while REGULAR deals appear in category sections. Both are currently FREE to post.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                    How do keyword notifications work?
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Set up keywords related to products you're interested in, and we'll send you notifications via email, SMS, or WhatsApp when matching deals are posted.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                    Is posting deals really free?
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Yes! During our promotional period until January 1st, 2026, all supplier registrations and deal postings are completely FREE - no setup fees or hidden charges.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                    How do I contact a supplier about a deal?
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Click on any deal to view details and use the inquiry form to contact the supplier directly. They'll receive your message via email and can respond directly.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                    Can I get help finding specific products?
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Yes! Use our "Find Me a Deal" feature to submit specific product requirements. We'll notify relevant suppliers who can then contact you with offers.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}