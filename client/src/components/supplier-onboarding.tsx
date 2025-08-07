import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Rocket, Factory, Microchip, Briefcase } from "lucide-react";
import { Link } from "wouter";

const supplierTemplates = [
  {
    name: "Manufacturing",
    icon: Factory,
    description: "Perfect for industrial equipment and manufacturing supplies",
    features: ["Industrial equipment catalog", "Bulk order management", "Technical specifications"]
  },
  {
    name: "Technology",
    icon: Microchip,
    description: "Ideal for software, hardware, and tech services",
    features: ["Software license management", "Hardware specifications", "Tech support integration"]
  },
  {
    name: "Office Supplies",
    icon: Briefcase,
    description: "Optimized for office equipment and workplace solutions",
    features: ["Catalog management", "Bulk pricing tiers", "Delivery scheduling"]
  }
];

const supplierBenefits = [
  "Targeted buyer matching through keywords",
  "Premium placement with Hot Deals",
  "Professional supplier templates",
  "Direct buyer communication tools"
];

export default function SupplierOnboarding() {
  return (
    <section className="gradient-supplier rounded-xl text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-4" data-testid="text-supplier-title">
              Ready to Reach More Buyers?
            </h3>
            <p className="text-slate-300 mb-6" data-testid="text-supplier-description">
              Join our supplier network and showcase your products to qualified business buyers actively looking for deals.
            </p>
            
            <div className="space-y-4 mb-6">
              {supplierBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="text-success mr-3 h-5 w-5" />
                  <span data-testid={`text-benefit-${index}`}>{benefit}</span>
                </div>
              ))}
            </div>
            
            <Link href="/api/login">
              <Button
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                data-testid="button-start-selling"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Start Selling
              </Button>
            </Link>
          </div>
          
          <div className="bg-white/10 rounded-lg p-6">
            <h4 className="text-xl font-semibold mb-4" data-testid="text-templates-title">
              Supplier Templates
            </h4>
            <div className="space-y-3">
              {supplierTemplates.map((template, index) => {
                const IconComponent = template.icon;
                return (
                  <Card key={index} className="bg-white/5 border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white" data-testid={`text-template-name-${index}`}>
                          {template.name}
                        </span>
                        <IconComponent className="text-accent h-5 w-5" />
                      </div>
                      <p className="text-sm text-slate-300 mb-3" data-testid={`text-template-description-${index}`}>
                        {template.description}
                      </p>
                      <ul className="text-xs text-slate-400 space-y-1">
                        {template.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-2 text-success" />
                            <span data-testid={`text-template-feature-${index}-${featureIndex}`}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
