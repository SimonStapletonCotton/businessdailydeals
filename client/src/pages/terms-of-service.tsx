import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Scale, AlertTriangle, CheckCircle } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-slate-500 to-slate-600 p-4 rounded-xl">
              <Scale className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Please read these terms carefully before using Business Daily Deals
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Last updated: August 2025 • Effective: August 15, 2025
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-800 dark:text-slate-100 flex items-center gap-3">
              <Shield className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              Legal Agreement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6 text-slate-700 dark:text-slate-300">
                
                <section>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    1. Acceptance of Terms
                  </h3>
                  <p>
                    By accessing and using Business Daily Deals (www.businessdailydeals.co.za), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    2. Service Description
                  </h3>
                  <p className="mb-3">
                    Business Daily Deals is a B2B marketplace platform that connects suppliers with buyers in South Africa. Our services include:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Deal posting and management for suppliers</li>
                    <li>Deal discovery and search for buyers</li>
                    <li>Notification systems for relevant opportunities</li>
                    <li>Direct communication between parties</li>
                    <li>Supplier verification services</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    3. FREE Promotional Period
                  </h3>
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-700">
                    <p className="font-medium text-emerald-800 dark:text-emerald-200 mb-2">
                      Current Promotional Offer (Valid until February 20th, 2026):
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-emerald-700 dark:text-emerald-300">
                      <li>All supplier registrations are FREE</li>
                      <li>All deal postings (HOT and REGULAR) are FREE</li>
                      <li>No setup fees or hidden charges</li>
                      <li>Full access to all platform features</li>
                    </ul>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">
                      After February 20th, 2026, standard pricing will apply as per our rates structure.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    4. User Accounts and Registration
                  </h3>
                  <p className="mb-3">
                    To access certain features, you must register for an account. You agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Provide accurate and complete registration information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Update your information to keep it current</li>
                    <li>Be responsible for all activities under your account</li>
                    <li>Notify us immediately of any unauthorized use</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    5. Supplier Responsibilities
                  </h3>
                  <p className="mb-3">Suppliers using our platform agree to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Provide accurate product/service descriptions</li>
                    <li>Honor all deals posted on the platform</li>
                    <li>Respond to buyer inquiries in a timely manner</li>
                    <li>Comply with all applicable laws and regulations</li>
                    <li>Not post misleading or fraudulent content</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    6. Buyer Responsibilities
                  </h3>
                  <p className="mb-3">Buyers using our platform agree to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Use the platform for legitimate business purposes only</li>
                    <li>Respect supplier intellectual property</li>
                    <li>Communicate professionally with suppliers</li>
                    <li>Not misuse contact information provided</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    7. Prohibited Activities
                  </h3>
                  <p className="mb-3">The following activities are strictly prohibited:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Posting false or misleading information</li>
                    <li>Spamming or unsolicited communications</li>
                    <li>Attempting to hack or compromise the platform</li>
                    <li>Uploading malicious content or viruses</li>
                    <li>Violating any applicable laws or regulations</li>
                    <li>Interfering with other users' experience</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    8. Intellectual Property
                  </h3>
                  <p>
                    All content on Business Daily Deals, including but not limited to text, graphics, logos, and software, is protected by copyright and other intellectual property laws. Users retain ownership of content they post but grant us a license to display and distribute it through our platform.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    9. Disclaimers and Limitations
                  </h3>
                  <p className="mb-3">
                    Business Daily Deals serves as a platform to connect buyers and suppliers. We do not:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Guarantee the accuracy of supplier information</li>
                    <li>Take responsibility for transaction outcomes</li>
                    <li>Provide warranties on products or services</li>
                    <li>Act as a party to any transactions</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    10. Privacy and Data Protection
                  </h3>
                  <p>
                    Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information. By using our service, you consent to our data practices as outlined in our Privacy Policy.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    11. Termination
                  </h3>
                  <p>
                    We reserve the right to terminate or suspend accounts at our discretion for violations of these terms. Users may also terminate their accounts at any time by contacting our support team at admin@businessdailydeals.co.za.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    12. Governing Law
                  </h3>
                  <p>
                    These terms are governed by the laws of South Africa. Any disputes will be resolved in the courts of South Africa.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    13. Changes to Terms
                  </h3>
                  <p>
                    We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or platform notifications. Continued use after changes constitutes acceptance of the modified terms.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    14. Contact Information
                  </h3>
                  <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                    <p className="mb-2">For questions about these Terms of Service, please contact:</p>
                    <p className="font-medium">Business Daily Deals</p>
                    <p>Email: admin@businessdailydeals.co.za</p>
                    <p>Website: www.businessdailydeals.co.za</p>
                    <p>Phone: 082 495 7997</p>
                  </div>
                </section>

              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}