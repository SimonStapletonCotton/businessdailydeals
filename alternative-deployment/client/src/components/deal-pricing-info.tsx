import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Target, Clock } from "lucide-react";

interface DealPricing {
  hot: {
    credits: number;
    cost: number;
    description: string;
    features: string[];
  };
  regular: {
    credits: number;
    cost: number;
    description: string;
    features: string[];
  };
}

export function DealPricingInfo() {
  const { data: pricing, isLoading } = useQuery<DealPricing>({
    queryKey: ['/api/deals/pricing']
  });

  if (isLoading || !pricing) {
    return <div>Loading pricing...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Hot Deal Pricing */}
      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Star className="h-5 w-5 fill-current" />
              Hot Deals
            </CardTitle>
            <Badge variant="destructive" className="bg-orange-600">
              Premium
            </Badge>
          </div>
          <CardDescription className="text-orange-600">
            {pricing.hot.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-700 mb-4">
            R{pricing.hot.cost}
            <span className="text-sm font-normal text-orange-600 ml-2">
              ({pricing.hot.credits} credits)
            </span>
          </div>
          <ul className="space-y-2">
            {pricing.hot.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-orange-700">
                <Target className="h-4 w-4 mt-0.5 flex-shrink-0 text-orange-500" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Regular Deal Pricing */}
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-slate-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Clock className="h-5 w-5" />
              Regular Deals
            </CardTitle>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Standard
            </Badge>
          </div>
          <CardDescription className="text-blue-600">
            {pricing.regular.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-700 mb-4">
            R{pricing.regular.cost}
            <span className="text-sm font-normal text-blue-600 ml-2">
              ({pricing.regular.credits} credits)
            </span>
          </div>
          <ul className="space-y-2">
            {pricing.regular.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                <Target className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-500" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}