import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Plus, Minus, DollarSign, History, Zap, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { User, CreditTransaction } from "@shared/schema";

const creditPackages = [
  { id: 'starter', name: 'Starter Pack', credits: 100, price: 250, popular: false },
  { id: 'business', name: 'Business Pack', credits: 500, price: 1000, popular: true, bonus: 50 },
  { id: 'enterprise', name: 'Enterprise Pack', credits: 1000, price: 1800, popular: false, bonus: 200 },
  { id: 'premium', name: 'Premium Pack', credits: 2000, price: 3200, popular: false, bonus: 500 },
];

export default function CreditsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [customAmount, setCustomAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Get user credit balance
  const { data: creditBalance, isLoading: isLoadingBalance } = useQuery({
    queryKey: ['/api/credits/balance'],
    enabled: !!user,
  });

  // Get credit transactions
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['/api/credits/transactions'],
    enabled: !!user,
  });

  // Purchase credits mutation
  const purchaseCredits = useMutation({
    mutationFn: async (data: { packageId?: string; customAmount?: number }) => {
      const response = await apiRequest('POST', '/api/credits/purchase', data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        toast({
          title: "Success",
          description: "Credits purchased successfully!",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/credits/balance'] });
        queryClient.invalidateQueries({ queryKey: ['/api/credits/transactions'] });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to purchase credits. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePackagePurchase = (packageId: string) => {
    setIsProcessing(true);
    purchaseCredits.mutate({ packageId });
    setTimeout(() => setIsProcessing(false), 2000);
  };

  const handleCustomPurchase = () => {
    const amount = parseFloat(customAmount);
    if (!amount || amount < 50) {
      toast({
        title: "Invalid Amount",
        description: "Minimum purchase is R50 (20 credits)",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    purchaseCredits.mutate({ customAmount: amount });
    setTimeout(() => setIsProcessing(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900" data-testid="text-credits-title">
              Advertising Credits
            </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Purchase credits to boost your deals and reach more buyers. Credits are debited when you place ads and can be topped up anytime.
          </p>
        </div>

        {/* Supplier Credit Summary - Moved to top */}
        <Card className="mb-8 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="text-center pb-3">
            <div className="flex items-center justify-center mb-2">
              <CreditCard className="w-6 h-6 text-blue-600 mr-2" />
              <CardTitle className="text-blue-800 text-xl">Supplier Credit Account</CardTitle>
            </div>
            <div className="text-center space-y-1">
              <p className="text-lg font-semibold text-blue-800">
                {user?.companyName || user?.email || 'Supplier Account'}
              </p>
              <p className="text-sm text-blue-600">Account ID: {user?.id || 'N/A'}</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-green-600">
                  R{(creditBalance as any)?.creditBalance || '0.00'}
                </div>
                <p className="text-sm text-slate-600">Available Balance</p>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-orange-600">
                  R{(creditBalance as any)?.totalCreditsSpent || '0.00'}
                </div>
                <p className="text-sm text-slate-600">Total Spent</p>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <Button onClick={() => window.location.href = '/rates-management'} className="w-full bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Buy More Credits
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History - Moved to top priority */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <History className="h-6 w-6 text-slate-600" />
              <div>
                <CardTitle className="text-2xl">Transaction History</CardTitle>
                <p className="text-sm text-slate-600 mt-1">
                  All credit transactions for: {user?.companyName || user?.email || 'Supplier Account'}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoadingTransactions ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-slate-600">Loading transactions...</p>
              </div>
            ) : transactions && Array.isArray(transactions) && transactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount (ZAR)</TableHead>
                    <TableHead className="text-right">Credits</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction: CreditTransaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="font-medium">
                          {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="text-xs text-slate-500">
                          {transaction.createdAt ? new Date(transaction.createdAt).toLocaleTimeString() : ''}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          transaction.type === 'purchase' ? 'default' : 
                          transaction.type === 'spend' ? 'secondary' : 
                          'destructive'
                        }>
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-xs text-slate-500 mt-1">
                            Supplier: {user?.companyName || user?.email || 'Account'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={transaction.type === 'purchase' ? 'text-green-600 font-semibold' : 'text-red-600'}>
                          {transaction.type === 'purchase' ? '+' : '-'}R{Math.abs(parseFloat(transaction.amount)).toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={transaction.type === 'purchase' ? 'text-green-600 font-semibold' : 'text-red-600'}>
                          {transaction.type === 'purchase' ? '+' : '-'}
                          {Math.abs(parseFloat(transaction.amount)).toFixed(0)} credits
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-8 text-center">
                <p className="text-slate-600">No transactions found for this account.</p>
                <Button 
                  onClick={() => window.location.href = '/rates-management'} 
                  className="mt-4"
                >
                  Make Your First Purchase
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Balance Cards - Moved lower */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                Available Credits
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {isLoadingBalance ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-slate-200 rounded w-24 mx-auto"></div>
                </div>
              ) : (
                <p className="text-4xl font-bold text-green-800 mb-2" data-testid="text-credit-balance">
                  R{(creditBalance as any)?.creditBalance || '0.00'}
                </p>
              )}
              <p className="text-sm text-green-600 mt-2">Ready for advertising</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <DollarSign className="h-5 w-5" />
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {isLoadingBalance ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-slate-200 rounded w-24 mx-auto"></div>
                </div>
              ) : (
                <p className="text-3xl font-bold text-green-600">
                  R{(creditBalance as any)?.totalCreditsSpent || '0.00'}
                </p>
              )}
              <p className="text-sm text-slate-600 mt-2">Lifetime advertising spend</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Credit Rate
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-3xl font-bold text-orange-600">R2.50</p>
              <p className="text-sm text-slate-600 mt-2">Per advertising credit</p>
            </CardContent>
          </Card>
        </div>

        {/* Credit Packages */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Choose Your Credit Package</h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {creditPackages.map((pkg) => (
              <Card 
                key={pkg.id} 
                className={`relative transition-all duration-300 hover:shadow-xl ${
                  pkg.popular ? 'border-2 border-primary shadow-lg scale-105' : 'hover:border-primary/30'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="px-3 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-primary">R{pkg.price}</p>
                    <p className="text-slate-600">
                      {pkg.credits}{pkg.bonus ? ` + ${pkg.bonus}` : ''} Credits
                    </p>
                    {pkg.bonus && (
                      <Badge variant="secondary" className="text-xs">
                        Bonus {pkg.bonus} Credits
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full"
                    size="lg"
                    onClick={() => handlePackagePurchase(pkg.id)}
                    disabled={isProcessing}
                    data-testid={`button-purchase-${pkg.id}`}
                  >
                    {isProcessing ? "Processing..." : "Purchase Credits"}
                  </Button>
                  <p className="text-xs text-slate-500 mt-3 text-center">
                    R{(pkg.price / (pkg.credits + (pkg.bonus || 0))).toFixed(2)} per credit
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <div className="mb-12">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Custom Amount</CardTitle>
              <p className="text-sm text-slate-600">Purchase any amount from R50 (20 credits)</p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Enter amount (ZAR)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    min="50"
                    step="10"
                    data-testid="input-custom-amount"
                  />
                  {customAmount && (
                    <p className="text-xs text-slate-500 mt-1">
                      ≈ {Math.floor(parseFloat(customAmount) / 2.5)} credits
                    </p>
                  )}
                </div>
                <Button 
                  onClick={handleCustomPurchase}
                  disabled={!customAmount || parseFloat(customAmount) < 50 || isProcessing}
                  data-testid="button-custom-purchase"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Buy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <History className="h-6 w-6 text-slate-600" />
            <h2 className="text-2xl font-bold text-slate-900">Transaction History</h2>
          </div>
          
          <Card>
            <CardContent className="p-0">
              {isLoadingTransactions ? (
                <div className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-slate-600">Loading transactions...</p>
                </div>
              ) : transactions && Array.isArray(transactions) && transactions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Credits</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction: CreditTransaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'N/A'}
                          <div className="text-xs text-slate-500">
                            {transaction.createdAt ? new Date(transaction.createdAt).toLocaleTimeString() : ''}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            transaction.type === 'purchase' ? 'default' : 
                            transaction.type === 'spend' ? 'secondary' : 
                            'destructive'
                          }>
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            {transaction.description}
                            <div className="text-xs text-slate-500 mt-1">
                              By: {user?.companyName || user?.email || 'Supplier Account'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={transaction.type === 'purchase' ? 'text-green-600 font-semibold' : 'text-red-600'}>
                            {transaction.type === 'purchase' ? '+' : '-'}R{Math.abs(parseFloat(transaction.amount)).toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={transaction.type === 'purchase' ? 'text-green-600 font-semibold' : 'text-red-600'}>
                            {transaction.type === 'purchase' ? '+' : '-'}
                            {Math.abs(parseFloat(transaction.amount)).toFixed(0)} credits
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-12 text-center">
                  <History className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">No transactions yet</p>
                  <p className="text-sm text-slate-500 mt-2">Your credit purchases and spending will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}