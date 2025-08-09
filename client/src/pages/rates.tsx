import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Flame, Star, Clock, CreditCard, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const advertisingRates = {
  hotDeals: {
    title: "Hot Deals",
    subtitle: "Premium placement on home page",
    description: "Featured prominently for maximum visibility",
    price: 125,
    credits: 50,
    duration: "30 days",
    features: ["Home page placement", "Priority listing", "Enhanced visibility", "Mobile optimized"]
  },
  regularDeals: {
    title: "Regular Deals", 
    subtitle: "Standard deal listing",
    description: "Listed in category sections",
    price: 50,
    credits: 20,
    duration: "30 days", 
    features: ["Category placement", "Search visibility", "Standard listing", "Mobile friendly"]
  }
};

export default function Rates() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [cart, setCart] = useState<Array<{type: string, quantity: number}>>([]);

  const handleAddToCart = (dealType: 'hot' | 'regular') => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to purchase advertising rates",
        variant: "destructive",
      });
      return;
    }

    if (user?.userType !== 'supplier') {
      toast({
        title: "Suppliers Only", 
        description: "Only suppliers can purchase advertising rates",
        variant: "destructive",
      });
      return;
    }

    // Add to cart logic
    const existingItem = cart.find(item => item.type === dealType);
    if (existingItem) {
      setCart(cart.map(item => 
        item.type === dealType 
          ? {...item, quantity: item.quantity + 1}
          : item
      ));
    } else {
      setCart([...cart, {type: dealType, quantity: 1}]);
    }

    toast({
      title: "Added to Cart",
      description: `${dealType === 'hot' ? 'Hot Deal' : 'Regular Deal'} added to your cart`,
    });
  };

  const getTotalCost = () => {
    return cart.reduce((total, item) => {
      const rate = item.type === 'hot' ? advertisingRates.hotDeals.price : advertisingRates.regularDeals.price;
      return total + (rate * item.quantity);
    }, 0);
  };

  const getTotalCredits = () => {
    return cart.reduce((total, item) => {
      const credits = item.type === 'hot' ? advertisingRates.hotDeals.credits : advertisingRates.regularDeals.credits;
      return total + (credits * item.quantity);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-slate-600 border-slate-300">
            Advertising Rates
          </Badge>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Business Daily Deals <span className="text-primary">Advertising Rates</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto">
            Choose your advertising package to reach thousands of South African buyers
          </p>
        </div>

        {/* Rates Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Hot Deals Card */}
          <Card className="relative overflow-hidden border-2 border-orange-200 shadow-xl">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-red-500 text-white px-4 py-2 text-sm font-semibold">
              PREMIUM
            </div>
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Flame className="h-6 w-6" />
                {advertisingRates.hotDeals.title}
              </CardTitle>
              <p className="text-orange-100 text-base">{advertisingRates.hotDeals.subtitle}</p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-slate-800 mb-2">
                  R{advertisingRates.hotDeals.price}
                </div>
                <div className="text-lg text-slate-600">
                  {advertisingRates.hotDeals.credits} credits • {advertisingRates.hotDeals.duration}
                </div>
              </div>

              <p className="text-slate-600 mb-6 text-center">
                {advertisingRates.hotDeals.description}
              </p>

              <ul className="space-y-3 mb-8">
                {advertisingRates.hotDeals.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Star className="h-4 w-4 text-orange-500" />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                onClick={() => handleAddToCart('hot')}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3"
                data-testid="button-add-hot-deal"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Hot Deal
              </Button>
            </CardContent>
          </Card>

          {/* Regular Deals Card */}
          <Card className="relative overflow-hidden border-2 border-blue-200 shadow-xl">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-500 to-indigo-500 text-white px-4 py-2 text-sm font-semibold">
              STANDARD
            </div>
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Clock className="h-6 w-6" />
                {advertisingRates.regularDeals.title}
              </CardTitle>
              <p className="text-blue-100 text-base">{advertisingRates.regularDeals.subtitle}</p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-slate-800 mb-2">
                  R{advertisingRates.regularDeals.price}
                </div>
                <div className="text-lg text-slate-600">
                  {advertisingRates.regularDeals.credits} credits • {advertisingRates.regularDeals.duration}
                </div>
              </div>

              <p className="text-slate-600 mb-6 text-center">
                {advertisingRates.regularDeals.description}
              </p>

              <ul className="space-y-3 mb-8">
                {advertisingRates.regularDeals.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Star className="h-4 w-4 text-blue-500" />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                onClick={() => handleAddToCart('regular')}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-3"
                data-testid="button-add-regular-deal"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Regular Deal
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <Card className="bg-slate-800 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5" />
                Cart Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{item.type === 'hot' ? 'Hot Deal' : 'Regular Deal'} × {item.quantity}</span>
                    <span>R{(item.type === 'hot' ? advertisingRates.hotDeals.price : advertisingRates.regularDeals.price) * item.quantity}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-4 bg-slate-600" />
              <div className="flex justify-between items-center text-xl font-bold mb-4">
                <span>Total: R{getTotalCost()}</span>
                <span>{getTotalCredits()} credits</span>
              </div>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
                data-testid="button-checkout"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Additional Information */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-semibold text-slate-800 mb-4">Package Combinations</h3>
          <p className="text-slate-600 max-w-3xl mx-auto">
            You can purchase any combination of Hot and Regular deals. 
            Hot deals provide premium placement on the home page, while Regular deals 
            are featured in category sections. Both options give you 30 days of visibility.
          </p>
        </div>
      </div>
    </div>
  );
}