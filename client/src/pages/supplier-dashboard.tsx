import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import DealCard from "@/components/deal-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, TrendingUp, Users, MessageCircle, Flame, RotateCcw, ChevronDown, ChevronUp, CreditCard, BarChart3 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import type { DealWithSupplier, InquiryWithDetails } from "@/../../server/storage";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SupplierDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [showExpiredDeals, setShowExpiredDeals] = useState(false);
  const [reactivatingDealId, setReactivatingDealId] = useState<string | null>(null);
  const [newExpirationDate, setNewExpirationDate] = useState("");

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

  const { data: inquiries, isLoading: inquiriesLoading } = useQuery<InquiryWithDetails[]>({
    queryKey: ["/api/supplier/inquiries"],
    enabled: isAuthenticated && user?.userType === "supplier",
  });

  const { data: expiredDeals, isLoading: expiredDealsLoading } = useQuery<DealWithSupplier[]>({
    queryKey: ["/api/supplier/expired-deals"],
    enabled: isAuthenticated && user?.userType === "supplier",
  });

  const { data: creditBalance } = useQuery({
    queryKey: ["/api/credits/balance"],
    enabled: isAuthenticated && user?.userType === "supplier",
  });

  const reactivateDealMutation = useMutation({
    mutationFn: async ({ dealId, expiresAt }: { dealId: string; expiresAt: string }) => {
      await apiRequest("PATCH", `/api/deals/${dealId}/reactivate`, { expiresAt });
    },
    onSuccess: () => {
      toast({
        title: "Deal Reactivated",
        description: "Your deal has been successfully reactivated.",
      });
      setReactivatingDealId(null);
      setNewExpirationDate("");
      queryClient.invalidateQueries({ queryKey: ["/api/supplier/deals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/supplier/expired-deals"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to reactivate deal. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-stone-50 to-slate-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 rounded mb-4 max-w-md mx-auto"></div>
              <div className="h-4 bg-slate-200 rounded mb-8 max-w-sm mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="h-24 bg-slate-200 rounded-lg"></div>
                ))}
              </div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You need to be a supplier to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  const hotDeals = deals?.filter((deal: DealWithSupplier) => deal.dealType === "hot") || [];
  const regularDeals = deals?.filter((deal: DealWithSupplier) => deal.dealType === "regular") || [];
  const activeDeals = deals?.filter((deal: DealWithSupplier) => deal.status === "active") || [];
  const pendingInquiries = inquiries?.filter((inquiry: InquiryWithDetails) => inquiry.status === "pending") || [];

  return (
    <div className="min-h-screen page-dashboard">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Modern Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-accent/20 to-primary/20 p-4 rounded-full">
              <TrendingUp className="h-10 w-10 text-accent" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4" data-testid="text-page-title">
            Supplier Dashboard
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-8">
            Welcome back, {user.firstName || user.companyName || "Supplier"}. Manage your deals and connect with buyers.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/post-deal">
              <Button className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white px-8 py-3 text-lg shadow-lg" data-testid="button-post-deal">
                <Plus className="h-5 w-5 mr-2" />
                Post New Deal
              </Button>
            </Link>
            <Link href="/supplier-analytics">
              <Button variant="outline" className="border-2 border-slate-300 hover:border-primary px-8 py-3 text-lg" data-testid="button-view-analytics">
                <BarChart3 className="h-5 w-5 mr-2" />
                View Analytics
              </Button>
            </Link>
          </div>
        </div>

        {/* Modern Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="bg-gradient-to-br from-primary/10 to-primary/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2" data-testid="text-stat-total-deals">
                {deals?.length || 0}
              </div>
              <div className="text-sm text-slate-600 font-medium">Total Deals</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-white to-green-50 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2" data-testid="text-stat-active-deals">
                {activeDeals.length}
              </div>
              <div className="text-sm text-slate-600 font-medium">Active Deals</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-white to-orange-50 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="bg-gradient-to-br from-accent/10 to-accent/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Flame className="h-8 w-8 text-accent" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2" data-testid="text-stat-hot-deals">
                {hotDeals.length}
              </div>
              <div className="text-sm text-slate-600 font-medium">Hot Deals</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2" data-testid="text-stat-inquiries">
                {pendingInquiries.length}
              </div>
              <div className="text-sm text-slate-600 font-medium">Pending Inquiries</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-white to-emerald-50 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2" data-testid="text-stat-credits">
                {(creditBalance as any)?.balance || 0}
              </div>
              <div className="text-sm text-slate-600 font-medium">Available Credits</div>
            </CardContent>
          </Card>
        </div>

        {/* Credit Management Section */}
        <Card className="mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center text-emerald-800">
              <CreditCard className="h-5 w-5 mr-2" />
              Credit Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-emerald-200">
                  <h4 className="font-semibold text-emerald-800 mb-2">Current Balance</h4>
                  <p className="text-2xl font-bold text-emerald-600">
                    {(creditBalance as any)?.balance || 0} Credits
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    💡 1 Credit = 1 Rand
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-emerald-200">
                  <h4 className="font-semibold text-emerald-800 mb-2">How Credits Work</h4>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• Purchase credits to advertise your deals</li>
                    <li>• Credits are automatically applied to your adverts</li>
                    <li>• View detailed rates on the rates page</li>
                    <li>• Credits never expire - use when needed</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-emerald-200">
                  <h4 className="font-semibold text-emerald-800 mb-2">Quick Actions</h4>
                  <div className="space-y-3">
                    <Link href="/rates">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" data-testid="button-view-rates">
                        View Advertising Rates
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      data-testid="button-purchase-credits"
                    >
                      Purchase Credits
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Pro Tip</h4>
                  <p className="text-sm text-blue-700">
                    Check the rates page to see exactly what it costs to advertise 
                    different numbers of items for various durations. Plan your 
                    advertising budget effectively!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Inquiries */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center" data-testid="text-inquiries-title">
              <MessageCircle className="h-5 w-5 mr-2" />
              Recent Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {inquiriesLoading ? (
              <div className="text-center py-4">Loading inquiries...</div>
            ) : inquiries && inquiries.length > 0 ? (
              <div className="space-y-4">
                {inquiries.slice(0, 5).map((inquiry: InquiryWithDetails) => (
                  <div key={inquiry.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900" data-testid={`text-inquiry-deal-${inquiry.id}`}>
                        {inquiry.deal.title}
                      </h4>
                      <p className="text-sm text-muted-foreground" data-testid={`text-inquiry-buyer-${inquiry.id}`}>
                        From: {inquiry.buyer.firstName} {inquiry.buyer.lastName}
                      </p>
                      {inquiry.message && (
                        <p className="text-sm text-slate-600 mt-1" data-testid={`text-inquiry-message-${inquiry.id}`}>
                          "{inquiry.message}"
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={inquiry.status === "pending" ? "default" : "secondary"}
                        data-testid={`badge-inquiry-status-${inquiry.id}`}
                      >
                        {inquiry.status}
                      </Badge>
                      <div className="text-xs text-muted-foreground" data-testid={`text-inquiry-date-${inquiry.id}`}>
                        {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString() : 'Unknown date'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground" data-testid="text-no-inquiries">
                  No inquiries yet. Post some deals to start receiving inquiries from buyers.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Deals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center" data-testid="text-deals-title">
                <Package className="h-5 w-5 mr-2" />
                Your Deals
              </span>
              <Link href="/post-deal">
                <Button variant="outline" size="sm" data-testid="button-post-new-deal">
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Deal
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dealsLoading ? (
              <div className="text-center py-4">Loading deals...</div>
            ) : deals && deals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deals.slice(0, 6).map((deal: DealWithSupplier) => (
                  <DealCard key={deal.id} deal={deal} variant={deal.dealType === "hot" ? "hot" : "regular"} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2" data-testid="text-no-deals">
                  No deals posted yet
                </h3>
                <p className="text-muted-foreground mb-4" data-testid="text-no-deals-description">
                  Start by posting your first deal to reach potential buyers.
                </p>
                <Link href="/post-deal">
                  <Button data-testid="button-create-first-deal">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Deal
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expired Deals Dropdown */}
        <Card className="mt-8">
          <CardHeader>
            <Button
              variant="ghost"
              onClick={() => setShowExpiredDeals(!showExpiredDeals)}
              className="w-full justify-between"
              data-testid="button-toggle-expired-deals"
            >
              <span className="flex items-center">
                <RotateCcw className="h-5 w-5 mr-2" />
                Expired Deals ({expiredDeals?.length || 0})
                {expiredDealsLoading && <span className="ml-2 text-muted-foreground">(Loading...)</span>}
              </span>
              {showExpiredDeals ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CardHeader>
            {showExpiredDeals && (
              <CardContent>
                {expiredDeals && expiredDeals.length > 0 ? (
                  <div className="space-y-4">
                    {expiredDeals.map((deal: DealWithSupplier) => (
                    <div key={deal.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-slate-50">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900" data-testid={`text-expired-deal-title-${deal.id}`}>
                          {deal.title}
                        </h4>
                        <p className="text-sm text-muted-foreground" data-testid={`text-expired-deal-category-${deal.id}`}>
                          {deal.category} • R{deal.price}
                        </p>
                        <p className="text-xs text-red-600" data-testid={`text-expired-deal-date-${deal.id}`}>
                          Expired: {deal.expiresAt ? new Date(deal.expiresAt).toLocaleDateString() : 'Unknown date'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {reactivatingDealId === deal.id ? (
                          <div className="flex items-center space-x-2">
                            <div>
                              <Label htmlFor={`expiry-${deal.id}`} className="text-xs">New Expiry Date</Label>
                              <Input
                                id={`expiry-${deal.id}`}
                                type="date"
                                value={newExpirationDate}
                                onChange={(e) => setNewExpirationDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-32 text-xs"
                                data-testid={`input-new-expiry-${deal.id}`}
                              />
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                if (newExpirationDate) {
                                  const expiresAt = new Date(newExpirationDate);
                                  expiresAt.setHours(23, 59, 59, 999);
                                  reactivateDealMutation.mutate({
                                    dealId: deal.id,
                                    expiresAt: expiresAt.toISOString()
                                  });
                                }
                              }}
                              disabled={!newExpirationDate || reactivateDealMutation.isPending}
                              data-testid={`button-confirm-reactivate-${deal.id}`}
                            >
                              {reactivateDealMutation.isPending ? "..." : "Confirm"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setReactivatingDealId(null);
                                setNewExpirationDate("");
                              }}
                              data-testid={`button-cancel-reactivate-${deal.id}`}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setReactivatingDealId(deal.id);
                              // Set default to 30 days from now
                              const defaultDate = new Date();
                              defaultDate.setDate(defaultDate.getDate() + 30);
                              setNewExpirationDate(defaultDate.toISOString().split('T')[0]);
                            }}
                            data-testid={`button-reactivate-${deal.id}`}
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reactivate
                          </Button>
                        )}
                      </div>
                    </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <RotateCcw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground" data-testid="text-no-expired-deals">
                      No expired deals to reactivate.
                    </p>
                  </div>
                )}
              </CardContent>
            )}
        </Card>
      </main>
    </div>
  );
}
