import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap, Package } from "lucide-react";

interface RatesPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonVariant?: "default" | "outline" | "secondary";
}

interface RatesCardProps {
  title?: string;
  subtitle?: string;
  plans: RatesPlan[];
  onSelectPlan?: (planName: string) => void;
}

export function RatesCard({ 
  title = "Pricing Plans", 
  subtitle = "Choose the perfect plan for your business needs",
  plans,
  onSelectPlan 
}: RatesCardProps) {
  const handleSelectPlan = (planName: string) => {
    if (onSelectPlan) {
      onSelectPlan(planName);
    } else {
      // Default action - redirect to login or contact
      window.location.href = "/api/login";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
          {title}
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <Card 
            key={plan.name}
            className={`relative bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
              plan.popular 
                ? 'ring-2 ring-accent ring-offset-4 transform scale-105' 
                : 'hover:transform hover:scale-105'
            }`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-accent to-primary text-white px-6 py-1 text-sm font-semibold">
                  <Star className="w-4 h-4 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <div className="mb-4">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-accent/20 to-primary/20' 
                    : 'bg-gradient-to-br from-slate-100 to-slate-200'
                }`}>
                  {index === 0 && <Package className={`w-8 h-8 ${plan.popular ? 'text-accent' : 'text-slate-600'}`} />}
                  {index === 1 && <Zap className={`w-8 h-8 ${plan.popular ? 'text-accent' : 'text-slate-600'}`} />}
                  {index === 2 && <Star className={`w-8 h-8 ${plan.popular ? 'text-accent' : 'text-slate-600'}`} />}
                </div>
              </div>
              
              <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                {plan.name}
              </CardTitle>
              
              <div className="mb-4">
                <span className="text-4xl font-bold text-slate-900">R{plan.price}</span>
                <span className="text-slate-600 text-lg">/{plan.period}</span>
              </div>
              
              <p className="text-slate-600 text-sm">
                {plan.description}
              </p>
            </CardHeader>

            <CardContent className="pt-4">
              {/* Features List */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <Button
                className={`w-full py-3 font-semibold ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white shadow-lg' 
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
                onClick={() => handleSelectPlan(plan.name)}
                data-testid={`button-select-${plan.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      <div className="text-center mt-12">
        <p className="text-slate-600 text-sm mb-4">
          All plans include 24/7 customer support and a 30-day money-back guarantee
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500">
          <span>• No setup fees</span>
          <span>• Cancel anytime</span>
          <span>• Secure payment processing</span>
          <span>• South African Rand (ZAR) pricing</span>
        </div>
      </div>
    </div>
  );
}

export default RatesCard;