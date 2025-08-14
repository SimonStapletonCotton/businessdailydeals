import Navbar from "@/components/navbar";
import RatesCard from "@/components/rates-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Phone, Mail, MessageCircle, HelpCircle, Users, Zap } from "lucide-react";

const pricingPlans = [
  {
    name: "Basic Supplier",
    price: "299",
    period: "month",
    description: "Perfect for small suppliers starting their B2B journey",
    features: [
      "Up to 10 regular deals per month",
      "Basic marketplace listing",
      "Standard search visibility",
      "Email support",
      "Basic analytics dashboard",
      "Mobile-responsive listings"
    ],
    buttonText: "Start Basic Plan",
    buttonVariant: "outline" as const
  },
  {
    name: "Professional Supplier",
    price: "599",
    period: "month",
    description: "Ideal for growing businesses seeking enhanced visibility",
    features: [
      "Up to 25 regular deals per month",
      "5 hot deals per month (premium placement)",
      "Enhanced search visibility",
      "Priority customer support",
      "Advanced analytics & insights",
      "Custom supplier profile",
      "Keyword notification alerts",
      "Bulk deal upload tools"
    ],
    popular: true,
    buttonText: "Choose Professional",
    buttonVariant: "default" as const
  },
  {
    name: "Enterprise Supplier",
    price: "1299",
    period: "month",
    description: "Maximum exposure and features for large-scale operations",
    features: [
      "Unlimited regular deals",
      "15 hot deals per month (premium placement)",
      "Top-tier search ranking",
      "Dedicated account manager",
      "Real-time analytics & reporting",
      "Custom branding options",
      "API access for integrations",
      "Priority deal approval",
      "Featured supplier badge",
      "Custom marketplace promotions"
    ],
    buttonText: "Go Enterprise",
    buttonVariant: "default" as const
  }
];

const buyerFeatures = [
  {
    icon: <span className="w-6 h-6 text-green-600 text-xl font-bold">R</span>,
    title: "Always Free for Buyers",
    description: "Browse deals, download coupons, and connect with suppliers at no cost"
  },
  {
    icon: <Users className="w-6 h-6 text-blue-600" />,
    title: "Unlimited Access",
    description: "Access to all deals, both hot and regular, from verified South African suppliers"
  },
  {
    icon: <Zap className="w-6 h-6 text-purple-600" />,
    title: "Smart Notifications",
    description: "Get notified when deals matching your keywords become available"
  }
];

export default function Pricing() {
  const { isAuthenticated } = useAuth();

  const handleSelectPlan = (planName: string) => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    
    // Handle plan selection - could redirect to payment or contact
    console.log(`Selected plan: ${planName}`);
    // For now, redirect to contact or show a modal
    alert(`You selected ${planName}. Please contact our sales team to get started.`);
  };

  return (
    <div className="min-h-screen page-pricing">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6 bg-accent/10 text-accent border-accent/20">
            Transparent Pricing
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Join South Africa's premier B2B marketplace with pricing designed for businesses of all sizes
          </p>
        </div>

        {/* Buyer Benefits Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">For Buyers - Always Free</h2>
            <p className="text-lg text-slate-600">
              Access premium deals and connect with suppliers without any subscription fees
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {buyerFeatures.map((feature, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-3 rounded-full">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3"
              onClick={() => window.location.href = isAuthenticated ? "/" : "/api/login"}
            >
              {isAuthenticated ? "Browse Deals Now" : "Sign Up Free"}
            </Button>
          </div>
        </div>

        {/* Supplier Pricing Plans */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Supplier Plans</h2>
            <p className="text-lg text-slate-600">
              Grow your business with our comprehensive supplier packages
            </p>
          </div>
          
          <RatesCard
            title=""
            subtitle=""
            plans={pricingPlans}
            onSelectPlan={handleSelectPlan}
          />
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600">Everything you need to know about our pricing</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start mb-4">
                  <HelpCircle className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">What's the difference between hot and regular deals?</h3>
                    <p className="text-slate-600">Hot deals receive premium placement on our homepage and priority visibility, while regular deals appear in our standard marketplace sections with competitive pricing.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start mb-4">
                  <HelpCircle className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Can I upgrade or downgrade my plan?</h3>
                    <p className="text-slate-600">Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades apply at your next billing cycle.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start mb-4">
                  <HelpCircle className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Do you offer annual discounts?</h3>
                    <p className="text-slate-600">Yes! Pay annually and save 15% on all supplier plans. Contact our sales team for annual pricing details.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start mb-4">
                  <HelpCircle className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Is there a setup fee?</h3>
                    <p className="text-slate-600">No setup fees ever. You only pay your monthly subscription fee, and you can cancel anytime with 30 days notice.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Need a Custom Solution?</h2>
              <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
                Large enterprise? Special requirements? Our team can create a custom package that fits your specific needs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white px-8 py-3"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Sales
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Email Us
                </Button>
              </div>
              
              <div className="mt-6 text-sm text-slate-500">
                <p>Call us: +27 11 123 4567 | Email: sales@businessdailydeals.co.za</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}