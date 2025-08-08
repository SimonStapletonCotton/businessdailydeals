import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus, Trash2, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Rates data based on your Excel sheet
const ratesData = {
  regular: [
    { duration: 1, rate3Items: 40, rate10Items: 15, rate20Items: 10 },
    { duration: 3, rate3Items: 25, rate10Items: 10, rate20Items: 6 },
    { duration: 7, rate3Items: 12, rate10Items: 6, rate20Items: 4 },
    { duration: 14, rate3Items: 8, rate10Items: 4, rate20Items: 3 },
    { duration: 21, rate3Items: 7, rate10Items: 3.5, rate20Items: 2 },
    { duration: 30, rate3Items: 6, rate10Items: 3, rate20Items: 2 }
  ],
  hot: [
    { duration: 1, rate3Items: 90, rate10Items: 55, rate20Items: 0 }, // No 20+ for 1 day hot
    { duration: 3, rate3Items: 40, rate10Items: 25, rate20Items: 0 },
    { duration: 7, rate3Items: 25, rate10Items: 15, rate20Items: 0 }
  ]
};

interface BasketItem {
  id: string;
  rateType: 'regular' | 'hot';
  duration: number;
  quantity: number;
  ratePerDay: number;
  totalCost: number;
  creditsRequired: number;
}

export default function Rates() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<BasketItem[]>([]);

  const { data: basketItems } = useQuery({
    queryKey: ["/api/basket"],
    enabled: isAuthenticated,
  });

  const { data: userCredits } = useQuery({
    queryKey: ["/api/credits"],
    enabled: isAuthenticated,
  });

  const addToBasketMutation = useMutation({
    mutationFn: async (item: Omit<BasketItem, 'id'>) => {
      const response = await apiRequest("POST", "/api/basket", item);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/basket"] });
      toast({
        title: "Added to Basket",
        description: "Item added to your advertising basket successfully",
      });
    },
  });

  const removeFromBasketMutation = useMutation({
    mutationFn: async (itemId: string) => {
      await apiRequest("DELETE", `/api/basket/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/basket"] });
      toast({
        title: "Removed from Basket",
        description: "Item removed from your basket",
      });
    },
  });

  const purchaseCreditsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/purchase-basket-credits", {
        totalAmount: totalBasketValue,
        currency: 'ZAR'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/basket"] });
      queryClient.invalidateQueries({ queryKey: ["/api/credits"] });
      toast({
        title: "Credits Purchased Successfully",
        description: `${totalBasketValue.toFixed(0)} credits added to your account`,
      });
    },
    onError: () => {
      toast({
        title: "Purchase Failed",
        description: "Unable to process credit purchase. Please try again.",
        variant: "destructive",
      });
    },
  });

  const calculateTotal = (duration: number, quantity: number, ratePerDay: number) => {
    return duration * quantity * ratePerDay;
  };

  const handleAddToBasket = (rateType: 'regular' | 'hot', duration: number, quantity: number, ratePerDay: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Please Login",
        description: "You need to login to add items to your basket",
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

    const totalCost = calculateTotal(duration, quantity, ratePerDay);
    const creditsRequired = totalCost; // 1:1 ratio for now

    addToBasketMutation.mutate({
      rateType,
      duration,
      quantity,
      ratePerDay,
      totalCost,
      creditsRequired,
    });
  };

  const getQuantityLabel = (rate3Items: number, rate10Items: number, rate20Items: number) => {
    if (rate20Items > 0) return "3-5 items, 6-10 items, 11-20 items";
    return "3-5 items, 6-10 items";
  };

  const RateRow = ({ 
    rateType, 
    duration, 
    rate3Items, 
    rate10Items, 
    rate20Items 
  }: { 
    rateType: 'regular' | 'hot';
    duration: number;
    rate3Items: number;
    rate10Items: number;
    rate20Items: number;
  }) => (
    <TableRow>
      <TableCell className="font-medium">{duration} day{duration > 1 ? 's' : ''}</TableCell>
      <TableCell>R{rate3Items}/day</TableCell>
      <TableCell>R{rate10Items}/day</TableCell>
      {rate20Items > 0 && <TableCell>R{rate20Items}/day</TableCell>}
      <TableCell>R{calculateTotal(duration, 3, rate3Items)}</TableCell>
      <TableCell>R{calculateTotal(duration, 6, rate10Items)}</TableCell>
      {rate20Items > 0 && <TableCell>R{calculateTotal(duration, 11, rate20Items)}</TableCell>}
      <TableCell className="space-x-2">
        <Button 
          size="sm" 
          onClick={() => handleAddToBasket(rateType, duration, 3, rate3Items)}
          disabled={addToBasketMutation.isPending}
        >
          <Plus className="w-4 h-4 mr-1" />
          3-5
        </Button>
        <Button 
          size="sm" 
          onClick={() => handleAddToBasket(rateType, duration, 6, rate10Items)}
          disabled={addToBasketMutation.isPending}
        >
          <Plus className="w-4 h-4 mr-1" />
          6-10
        </Button>
        {rate20Items > 0 && (
          <Button 
            size="sm" 
            onClick={() => handleAddToBasket(rateType, duration, 11, rate20Items)}
            disabled={addToBasketMutation.isPending}
          >
            <Plus className="w-4 h-4 mr-1" />
            11-20
          </Button>
        )}
      </TableCell>
    </TableRow>
  );

  const totalBasketValue = Array.isArray(basketItems) ? basketItems.reduce((total: number, item: any) => total + parseFloat(item.totalCost), 0) : 0;

  const handlePurchaseCredits = () => {
    if (!isAuthenticated) {
      toast({
        title: "Please Login",
        description: "You need to login to purchase credits",
        variant: "destructive",
      });
      return;
    }

    if (user?.userType !== 'supplier') {
      toast({
        title: "Suppliers Only",
        description: "Only suppliers can purchase advertising credits",
        variant: "destructive",
      });
      return;
    }

    if (totalBasketValue === 0) {
      toast({
        title: "Empty Basket",
        description: "Please add items to your basket before purchasing",
        variant: "destructive",
      });
      return;
    }

    purchaseCreditsMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-stone-50 to-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-6 bg-accent/10 text-accent border-accent/20">
            Advertising Rates - South African Market
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-6">
            Rates per Advert per Day
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Choose your advertising duration and quantity. Add items to your basket and convert to credits for payment.
          </p>
          {isAuthenticated && user?.userType === 'supplier' && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg max-w-md mx-auto">
              <div className="text-center">
                <p className="text-sm text-green-700">Your Current Balance</p>
                <p className="text-2xl font-bold text-green-800">
                  {Array.isArray(userCredits) ? userCredits.reduce((total: number, credit: any) => total + parseFloat(credit.amount), 0).toFixed(0) : '0'} credits
                </p>
                <p className="text-xs text-green-600 mt-1">≈ R{Array.isArray(userCredits) ? userCredits.reduce((total: number, credit: any) => total + parseFloat(credit.amount), 0).toFixed(2) : '0.00'}</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Regular Deals Rates */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary">REGULAR DEALS</Badge>
                  Standard Marketplace Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Duration</TableHead>
                      <TableHead>3-5 Items</TableHead>
                      <TableHead>6-10 Items</TableHead>
                      <TableHead>11-20 Items</TableHead>
                      <TableHead>Total (3-5)</TableHead>
                      <TableHead>Total (6-10)</TableHead>
                      <TableHead>Total (11-20)</TableHead>
                      <TableHead>Add to Basket</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ratesData.regular.map((rate) => (
                      <RateRow
                        key={`regular-${rate.duration}`}
                        rateType="regular"
                        duration={rate.duration}
                        rate3Items={rate.rate3Items}
                        rate10Items={rate.rate10Items}
                        rate20Items={rate.rate20Items}
                      />
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Hot Deals Rates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="destructive">HOT DEALS</Badge>
                  Premium Home Page Placement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Duration</TableHead>
                      <TableHead>3-5 Items</TableHead>
                      <TableHead>6-10 Items</TableHead>
                      <TableHead>Total (3-5)</TableHead>
                      <TableHead>Total (6-10)</TableHead>
                      <TableHead>Add to Basket</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ratesData.hot.map((rate) => (
                      <RateRow
                        key={`hot-${rate.duration}`}
                        rateType="hot"
                        duration={rate.duration}
                        rate3Items={rate.rate3Items}
                        rate10Items={rate.rate10Items}
                        rate20Items={rate.rate20Items}
                      />
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Basket Sidebar */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Your Basket
                  {Array.isArray(basketItems) && basketItems.length > 0 && (
                    <Badge>{basketItems.length}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Array.isArray(basketItems) && basketItems.length > 0 ? (
                  <div className="space-y-4">
                    {basketItems.map((item: any) => (
                      <div key={item.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant={item.rateType === 'hot' ? 'destructive' : 'secondary'}>
                            {item.rateType.toUpperCase()}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => removeFromBasketMutation.mutate(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="text-sm text-slate-600">
                          <p>{item.duration} days × {item.quantity} items</p>
                          <p>R{item.ratePerDay}/day</p>
                        </div>
                        <div className="font-semibold text-right">
                          R{item.totalCost}
                        </div>
                      </div>
                    ))}
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>R{totalBasketValue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Credits Required:</span>
                        <span>{totalBasketValue.toFixed(0)} credits</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => handlePurchaseCredits()}
                      disabled={totalBasketValue === 0 || purchaseCreditsMutation.isPending}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      {purchaseCreditsMutation.isPending ? "Processing..." : `Purchase Credits (R${totalBasketValue.toFixed(2)})`}
                    </Button>
                    
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-700 text-center">
                        <strong>Local Payment Processing:</strong> Credits purchased directly without international payment gateways. 
                        Perfect for South African businesses. 1 credit = R1.00
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Your basket is empty</p>
                    <p className="text-sm">Add advertising rates to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}