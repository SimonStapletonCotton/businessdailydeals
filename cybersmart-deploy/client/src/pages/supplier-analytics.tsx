import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Eye, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Package, 
  Flame, 
  Clock,
  CreditCard,
  Download,
  Filter,
  Search
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { DealWithSupplier } from "@/../../server/storage";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

interface CreditTransaction {
  id: string;
  amount: string;
  type: 'spend' | 'refund' | 'purchase';
  description: string;
  dealId?: string;
  createdAt: string;
}

interface DealAnalytics extends DealWithSupplier {
  creditsSpent: number;
  roi: number;
  performance: 'excellent' | 'good' | 'average' | 'poor';
}

export default function SupplierAnalytics() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
    if (!isLoading && isAuthenticated && user?.userType !== "supplier") {
      toast({
        title: "Access Denied",
        description: "You need to be a supplier to access this page.",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: deals, isLoading: dealsLoading } = useQuery<DealWithSupplier[]>({
    queryKey: ["/api/supplier/deals"],
    enabled: isAuthenticated && user?.userType === "supplier",
  });

  const { data: expiredDeals } = useQuery<DealWithSupplier[]>({
    queryKey: ["/api/supplier/expired-deals"],
    enabled: isAuthenticated && user?.userType === "supplier",
  });

  const { data: creditTransactions, isLoading: transactionsLoading } = useQuery<CreditTransaction[]>({
    queryKey: ["/api/credits/transactions"],
    enabled: isAuthenticated && user?.userType === "supplier",
  });

  const { data: creditBalance } = useQuery({
    queryKey: ["/api/credits/balance"],
    enabled: isAuthenticated && user?.userType === "supplier",
  });

  if (isLoading || dealsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-8"></div>
              <div className="h-64 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.userType !== "supplier") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-4">Supplier access required.</p>
          </div>
        </div>
      </div>
    );
  }

  // Combine active and expired deals for comprehensive view
  const allDeals = [...(deals || []), ...(expiredDeals || [])];
  
  // Enhanced analytics calculations
  const enhancedDeals: DealAnalytics[] = allDeals.map(deal => {
    const creditsSpent = parseFloat(deal.creditsCost || '0');
    const views = deal.viewCount || 0;
    const clicks = deal.clickCount || 0;
    
    // Calculate ROI based on views per credit spent
    const roi = creditsSpent > 0 ? views / creditsSpent : 0;
    
    // Performance classification
    let performance: 'excellent' | 'good' | 'average' | 'poor' = 'poor';
    if (roi >= 10) performance = 'excellent';
    else if (roi >= 5) performance = 'good';
    else if (roi >= 2) performance = 'average';
    
    return {
      ...deal,
      creditsSpent,
      roi,
      performance
    };
  });

  // Filter deals based on search and filters
  const filteredDeals = enhancedDeals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || deal.status === filterStatus;
    const matchesType = filterType === "all" || deal.dealType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Summary calculations
  const totalCreditsSpent = creditTransactions?.reduce((sum, transaction) => 
    transaction.type === 'spend' ? sum + parseFloat(transaction.amount) : sum, 0) || 0;
  
  const totalViews = allDeals.reduce((sum, deal) => sum + (deal.viewCount || 0), 0);
  const totalClicks = allDeals.reduce((sum, deal) => sum + (deal.clickCount || 0), 0);
  const activeDealsCount = deals?.filter(deal => deal.status === 'active').length || 0;
  const expiredDealsCount = expiredDeals?.length || 0;

  const getPerformanceBadge = (performance: string) => {
    const variants = {
      excellent: "bg-green-100 text-green-800",
      good: "bg-blue-100 text-blue-800", 
      average: "bg-yellow-100 text-yellow-800",
      poor: "bg-red-100 text-red-800"
    };
    return variants[performance as keyof typeof variants] || variants.poor;
  };

  const exportData = () => {
    const csvData = filteredDeals.map(deal => ({
      Title: deal.title,
      Type: deal.dealType,
      Status: deal.status,
      'Credits Spent': deal.creditsSpent,
      'Created Date': format(new Date(deal.createdAt), 'yyyy-MM-dd'),
      'Expires Date': deal.expiresAt ? format(new Date(deal.expiresAt!), 'yyyy-MM-dd') : 'No expiry',
      Views: deal.viewCount || 0,
      Clicks: deal.clickCount || 0,
      ROI: deal.roi.toFixed(2),
      Performance: deal.performance
    }));
    
    // Simple CSV export
    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `supplier-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen page-analytics">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-accent/20 to-primary/20 p-4 rounded-full">
              <BarChart3 className="h-10 w-10 text-accent" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4" data-testid="text-page-title">
            Supplier Analytics
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Comprehensive overview of your advertising performance, spending, and deal analytics
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-3 rounded-full w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                <CreditCard className="h-7 w-7 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1" data-testid="text-total-spent">
                {totalCreditsSpent.toFixed(0)} credits
              </div>
              <div className="text-sm text-slate-600">Total Spent</div>
              <div className="text-xs text-slate-500 mt-1">R{(totalCreditsSpent * 2.5).toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-full w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                <Eye className="h-7 w-7 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1" data-testid="text-total-views">
                {totalViews.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600">Total Views</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-full w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                <Package className="h-7 w-7 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1" data-testid="text-active-deals">
                {activeDealsCount}
              </div>
              <div className="text-sm text-slate-600">Active Deals</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-orange-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-3 rounded-full w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1" data-testid="text-avg-roi">
                {totalCreditsSpent > 0 ? (totalViews / totalCreditsSpent).toFixed(1) : '0'}
              </div>
              <div className="text-sm text-slate-600">Avg ROI (Views/Credit)</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="deals" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deals">Deal Performance</TabsTrigger>
            <TabsTrigger value="transactions">Credit History</TabsTrigger>
          </TabsList>

          <TabsContent value="deals" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters & Export
                  </span>
                  <Button onClick={exportData} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search deals..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      data-testid="input-search-deals"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger data-testid="select-filter-status">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger data-testid="select-filter-type">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="hot">Hot Deals</SelectItem>
                      <SelectItem value="regular">Regular Deals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Deals Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Deal Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left p-3 font-semibold">Deal</th>
                        <th className="text-left p-3 font-semibold">Type</th>
                        <th className="text-left p-3 font-semibold">Status</th>
                        <th className="text-left p-3 font-semibold">Credits</th>
                        <th className="text-left p-3 font-semibold">Created</th>
                        <th className="text-left p-3 font-semibold">Expires</th>
                        <th className="text-left p-3 font-semibold">Views</th>
                        <th className="text-left p-3 font-semibold">Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDeals.map((deal) => (
                        <tr key={deal.id} className="border-b border-slate-100 hover:bg-slate-50" data-testid={`row-deal-${deal.id}`}>
                          <td className="p-3">
                            <div>
                              <div className="font-semibold text-slate-900 truncate max-w-48" title={deal.title}>
                                {deal.title}
                              </div>
                              <div className="text-slate-600 text-xs truncate max-w-48" title={deal.description}>
                                {deal.description}
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant={deal.dealType === 'hot' ? 'destructive' : 'secondary'} className="text-xs">
                              {deal.dealType === 'hot' ? (
                                <><Flame className="h-3 w-3 mr-1" />HOT</>
                              ) : (
                                <><Package className="h-3 w-3 mr-1" />REG</>
                              )}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge 
                              variant={deal.status === 'active' ? 'default' : 'secondary'}
                              className="text-xs capitalize"
                            >
                              {deal.status}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="text-slate-900 font-medium">{deal.creditsSpent}</div>
                            <div className="text-slate-500 text-xs">R{(deal.creditsSpent * 2.5).toFixed(2)}</div>
                          </td>
                          <td className="p-3 text-slate-600 text-xs">
                            {format(new Date(deal.createdAt), 'MMM dd, yyyy')}
                          </td>
                          <td className="p-3 text-slate-600 text-xs">
                            {deal.expiresAt ? format(new Date(deal.expiresAt!), 'MMM dd, yyyy') : 'No expiry'}
                          </td>
                          <td className="p-3">
                            <div className="text-slate-900 font-medium">{deal.viewCount || 0}</div>
                            <div className="text-slate-500 text-xs">{deal.clickCount || 0} clicks</div>
                          </td>
                          <td className="p-3">
                            <Badge className={`text-xs ${getPerformanceBadge(deal.performance)}`}>
                              {deal.performance}
                            </Badge>
                            <div className="text-slate-500 text-xs mt-1">
                              ROI: {deal.roi.toFixed(1)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredDeals.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <Package className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                      <p>No deals found matching your criteria.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Credit Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {transactionsLoading ? (
                  <div className="text-center py-8">Loading transactions...</div>
                ) : creditTransactions && creditTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {creditTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg" data-testid={`transaction-${transaction.id}`}>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900">{transaction.description}</div>
                          <div className="text-slate-600 text-sm">
                            {format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${
                            transaction.type === 'spend' ? 'text-red-600' : 
                            transaction.type === 'refund' ? 'text-green-600' : 'text-blue-600'
                          }`}>
                            {transaction.type === 'spend' ? '-' : '+'}
                            {transaction.amount} credits
                          </div>
                          <div className="text-slate-500 text-sm">
                            R{(parseFloat(transaction.amount) * 2.5).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p>No credit transactions found.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}