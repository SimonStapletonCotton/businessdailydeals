import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Eye, Lock, Database, AlertCircle } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-slate-500 to-slate-600 p-4 rounded-xl">
              <Eye className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Last updated: August 2025 • Effective: August 15, 2025
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-800 dark:text-slate-100 flex items-center gap-3">
              <Shield className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              Data Protection & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6 text-slate-700 dark:text-slate-300">
                
                <section>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    1. Information We Collect
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">Personal Information:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Name, email address, phone number</li>
                        <li>Company name and business details</li>
                        <li>Address and contact information</li>
                        <li>VAT number and business registration details (for verification)</li>
                        <li>Banking details (for payment processing)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">Usage Information:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>IP address and device information</li>
                        <li>Browser type and version</li>
                        <li>Pages visited and time spent</li>
                        <li>Search queries and preferences</li>
                        <li>Click patterns and user behavior</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">Business Information:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Product and service listings</li>
                        <li>Deal descriptions and pricing</li>
                        <li>Business categories and keywords</li>
                        <li>Transaction history and communications</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-600" />
                    2. How We Use Your Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">Service Provision:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Create and manage user accounts</li>
                        <li>Process deal postings and inquiries</li>
                        <li>Facilitate communication between users</li>
                        <li>Send relevant notifications and alerts</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">Communication:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Send keyword-based deal notifications via email, SMS, and WhatsApp</li>
                        <li>Provide customer support and assistance</li>
                        <li>Send important platform updates and announcements</li>
                        <li>Process contact form submissions</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">Platform Improvement:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Analyze usage patterns to improve our services</li>
                        <li>Develop new features and functionalities</li>
                        <li>Enhance user experience and platform performance</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-green-600" />
                    3. Information Sharing and Disclosure
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                      <p className="text-green-800 dark:text-green-200 font-medium mb-2">
                        We do NOT sell, trade, or rent your personal information to third parties.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">We may share information only in these cases:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li><strong>With Consent:</strong> When you explicitly authorize sharing</li>
                        <li><strong>Business Transactions:</strong> Facilitating legitimate buyer-supplier communications</li>
                        <li><strong>Legal Requirements:</strong> When required by law or legal processes</li>
                        <li><strong>Safety:</strong> To protect user safety and platform integrity</li>
                        <li><strong>Service Providers:</strong> With trusted partners who help us operate the platform (under strict confidentiality agreements)</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-purple-600" />
                    4. Data Security Measures
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                      <p className="text-purple-800 dark:text-purple-200 font-medium mb-2">
                        We implement multiple layers of security to protect your data:
                      </p>
                    </div>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li><strong>Encryption:</strong> All data transmission is encrypted using SSL/TLS</li>
                      <li><strong>Secure Storage:</strong> Data is stored in secure, encrypted databases</li>
                      <li><strong>Access Controls:</strong> Strict access controls and authentication mechanisms</li>
                      <li><strong>Regular Updates:</strong> Security patches and system updates</li>
                      <li><strong>Monitoring:</strong> 24/7 security monitoring and threat detection</li>
                      <li><strong>Backup Systems:</strong> Regular encrypted backups and disaster recovery</li>
                      <li><strong>Staff Training:</strong> Regular security training for all team members</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-600" />
                    5. Your Rights and Choices
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">You have the right to:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li><strong>Access:</strong> Request a copy of your personal data</li>
                        <li><strong>Update:</strong> Correct inaccurate or incomplete information</li>
                        <li><strong>Delete:</strong> Request deletion of your personal data</li>
                        <li><strong>Restrict:</strong> Limit how we process your information</li>
                        <li><strong>Portability:</strong> Request your data in a portable format</li>
                        <li><strong>Object:</strong> Object to certain processing activities</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">Notification Preferences:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Manage your email notification settings</li>
                        <li>Opt-out of SMS notifications</li>
                        <li>Control WhatsApp message preferences</li>
                        <li>Update keyword notification settings</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <Database className="h-5 w-5 text-indigo-600" />
                    6. Data Retention
                  </h3>
                  <div className="space-y-3">
                    <p>We retain your information for different periods based on the type of data:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li><strong>Account Data:</strong> While your account is active, plus 2 years after closure</li>
                      <li><strong>Transaction Records:</strong> 7 years for tax and legal compliance</li>
                      <li><strong>Marketing Data:</strong> Until you opt-out or request deletion</li>
                      <li><strong>Usage Logs:</strong> 12 months for security and analytics purposes</li>
                      <li><strong>Support Communications:</strong> 3 years for service improvement</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    7. Cookies and Tracking
                  </h3>
                  <div className="space-y-3">
                    <p>We use cookies and similar technologies to:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Remember your login status and preferences</li>
                      <li>Analyze site usage and improve performance</li>
                      <li>Provide personalized content and recommendations</li>
                      <li>Prevent fraud and enhance security</li>
                    </ul>
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
                      <p className="text-amber-800 dark:text-amber-200">
                        You can control cookie settings through your browser, but some features may not work properly if cookies are disabled.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    8. Third-Party Services
                  </h3>
                  <div className="space-y-3">
                    <p>We work with trusted third-party services for:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li><strong>Payment Processing:</strong> Secure payment gateways for transactions</li>
                      <li><strong>Email Services:</strong> SendGrid for transactional emails</li>
                      <li><strong>SMS Services:</strong> SMS providers for notifications</li>
                      <li><strong>Cloud Hosting:</strong> Secure cloud infrastructure providers</li>
                      <li><strong>Analytics:</strong> Web analytics for platform improvement</li>
                    </ul>
                    <p className="mt-2">All third-party services are bound by strict confidentiality agreements and data protection standards.</p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-blue-600" />
                    9. International Data Transfers
                  </h3>
                  <div className="space-y-3">
                    <p>
                      Your data is primarily stored and processed in South Africa. If data needs to be transferred internationally, we ensure appropriate safeguards are in place, including:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Adequacy decisions by data protection authorities</li>
                      <li>Standard contractual clauses</li>
                      <li>Binding corporate rules</li>
                      <li>Other legally approved transfer mechanisms</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    10. Children's Privacy
                  </h3>
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
                    <p className="text-amber-800 dark:text-amber-200">
                      Business Daily Deals is a B2B platform intended for business use only. We do not knowingly collect personal information from individuals under 18 years of age. If we discover that we have collected information from a minor, we will delete it immediately.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-purple-600" />
                    11. Changes to This Privacy Policy
                  </h3>
                  <div className="space-y-3">
                    <p>
                      We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Notify users of significant changes via email</li>
                      <li>Post updates on our website</li>
                      <li>Update the "Last updated" date at the top</li>
                      <li>Provide a grace period for review before changes take effect</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    12. Contact Us About Privacy
                  </h3>
                  <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                    <p className="mb-2">For any privacy-related questions, concerns, or requests, please contact:</p>
                    <div className="space-y-1">
                      <p><strong>Privacy Officer:</strong> Business Daily Deals</p>
                      <p><strong>Email:</strong> admin@businessdailydeals.co.za</p>
                      <p><strong>Subject Line:</strong> "Privacy Policy Inquiry"</p>
                      <p><strong>Website:</strong> www.businessdailydeals.co.za</p>
                      <p><strong>Phone:</strong> 082 495 7997</p>
                    </div>
                    <p className="mt-3 text-sm">
                      We aim to respond to all privacy inquiries within 48 hours.
                    </p>
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