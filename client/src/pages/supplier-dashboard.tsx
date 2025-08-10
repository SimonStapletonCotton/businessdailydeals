import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import DealCard from "@/components/deal-card-fixed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, TrendingUp, Users, MessageCircle, Flame, RotateCcw, ChevronDown, ChevronUp, CreditCard, BarChart3, Calendar, Clock, Trash2, Edit } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import type { DealWithSupplier, InquiryWithDetails } from "@/../../server/storage";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/image-upload";

export default function SupplierDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [showExpiredDeals, setShowExpiredDeals] = useState(false);
  const [reactivatingDealId, setReactivatingDealId] = useState<string | null>(null);
  const [newExpirationDate, setNewExpirationDate] = useState("");
  const [extendingDealId, setExtendingDealId] = useState<string | null>(null);
  const [extendExpirationDate, setExtendExpirationDate] = useState("");
  const [deletingDealId, setDeletingDealId] = useState<string | null>(null);
  const [editingDeal, setEditingDeal] = useState<DealWithSupplier | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    originalPrice: "",
    imageUrl: "",
    size: "",
    quantityAvailable: 1,
    productSpecifications: ""
  });

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

  const { data: deals, isLoading: dealsLoading, refetch: refetchDeals } = useQuery<DealWithSupplier[]>({
    queryKey: ["/api/supplier/deals"],
    enabled: isAuthenticated && user?.userType === "supplier",
    staleTime: 0, // Always fetch fresh data
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
          title: "Session Expired",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1000);
      } else {
        toast({
          title: "Error",
          description: "Failed to reactivate deal. Please try again.",
          variant: "destructive",
        });
      }
      setReactivatingDealId(null);
    },
  });

  const extendDealMutation = useMutation({
    mutationFn: async ({ dealId, expiresAt }: { dealId: string; expiresAt: string }) => {
      const response = await apiRequest("PATCH", `/api/deals/${dealId}/extend`, { expiresAt });
      return response.json();
    },
    onSuccess: (data) => {
      const message = data.promotionalPeriod 
        ? `Extended for ${data.extraDays} extra days. FREE during promotional period!`
        : `Extended for ${data.extraDays} extra days. ${data.creditsCharged} credits charged. Remaining balance: ${data.remainingCredits} credits.`;
      
      toast({
        title: "Deal Extended Successfully",
        description: message,
      });
      setExtendingDealId(null);
      setExtendExpirationDate("");
      queryClient.invalidateQueries({ queryKey: ["/api/supplier/deals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/credits/balance"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session Expired",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1000);
      } else {
        toast({
          title: "Error",
          description: "Failed to extend deal. Please try again.",
          variant: "destructive",
        });
      }
      setExtendingDealId(null);
    },
  });

  const deleteDealMutation = useMutation({
    mutationFn: async (dealId: string) => {
      setDeletingDealId(dealId);
      await apiRequest("DELETE", `/api/deals/${dealId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/supplier/deals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/supplier/expired-deals"] });
      setDeletingDealId(null);
      toast({
        title: "Deal Deleted",
        description: "Deal removed successfully.",
      });
    },
    onError: (error: any) => {
      setDeletingDealId(null);
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session Expired",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1000);
      } else {
        toast({
          title: "Error",
          description: "Failed to delete deal. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  // Edit deal mutation
  const editDealMutation = useMutation({
    mutationFn: async (dealData: any) => {
      await apiRequest("PATCH", `/api/deals/${dealData.id}`, dealData);
    },
    onSuccess: () => {
      toast({
        title: "Deal Updated",
        description: "Your deal has been successfully updated.",
      });
      setEditingDeal(null);
      queryClient.invalidateQueries({ queryKey: ["/api/supplier/deals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1000);
      } else {
        toast({
          title: "Error",
          description: "Failed to update deal. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const handleDeleteDeal = (dealId: string) => {
    if (window.confirm("Are you sure you want to delete this deal? This action cannot be undone.")) {
      deleteDealMutation.mutate(dealId);
    }
  };

  const handleExtendDeal = async (dealId: string) => {
    if (!extendExpirationDate) {
      toast({
        title: "Date Required",
        description: "Please select a new expiration date.",
        variant: "destructive",
      });
      return;
    }

    const selectedDate = new Date(extendExpirationDate);
    const currentDate = new Date();
    
    if (selectedDate <= currentDate) {
      toast({
        title: "Invalid Date",
        description: "The expiration date must be in the future.",
        variant: "destructive",
      });
      return;
    }

    // Find the deal to calculate credits
    const deal = deals?.find(d => d.id === dealId);
    if (!deal || !deal.expiresAt) {
      toast({
        title: "Error",
        description: "Deal information not found.",
        variant: "destructive",
      });
      return;
    }

    const currentExpiry = new Date(deal.expiresAt);
    const extraDays = Math.ceil((selectedDate.getTime() - currentExpiry.getTime()) / (1000 * 60 * 60 * 24));
    const creditsPerDay = deal.dealType === "hot" ? 5 : 2;
    const totalCredits = extraDays * creditsPerDay;

    // Check if we're in promotional period (FREE until December 31st, 2025)
    const promotionalEndDate = new Date('2025-12-31T23:59:59.000Z');
    const isPromotionalPeriod = new Date() < promotionalEndDate;

    if (!isPromotionalPeriod) {
      // Check current credit balance (only after promotional period)
      const currentBalance = parseFloat((creditBalance as any)?.creditBalance || '0');
      
      if (currentBalance < totalCredits) {
        toast({
          title: "Insufficient Credits",
          description: `You need ${totalCredits} credits but only have ${currentBalance}. Please top up your credits first.`,
          variant: "destructive",
        });
        return;
      }
    }

    extendDealMutation.mutate({ dealId, expiresAt: extendExpirationDate });
  };

  const handleReactivateDeal = async (dealId: string) => {
    if (!newExpirationDate) {
      toast({
        title: "Date Required",
        description: "Please select a new expiration date.",
        variant: "destructive",
      });
      return;
    }

    const selectedDate = new Date(newExpirationDate);
    const currentDate = new Date();
    
    if (selectedDate <= currentDate) {
      toast({
        title: "Invalid Date",
        description: "The expiration date must be in the future.",
        variant: "destructive",
      });
      return;
    }

    reactivateDealMutation.mutate({ dealId, expiresAt: newExpirationDate });
  };

  const handleEditDeal = (deal: DealWithSupplier) => {
    console.log("Edit button clicked for deal:", deal.id, deal.title);
    console.log("Deal data:", deal);
    
    const formData = {
      title: deal.title || "",
      description: deal.description || "",
      category: deal.category || "",
      price: deal.price || "",
      originalPrice: deal.originalPrice || "",
      imageUrl: deal.imageUrl || "",
      size: deal.size || "",
      quantityAvailable: deal.quantityAvailable || 1,
      productSpecifications: deal.productSpecifications || ""
    };
    
    console.log("Setting form data:", formData);
    setEditFormData(formData);
    setEditingDeal(deal);
    console.log("editingDeal state set to:", deal.id);
  };

  const handleSaveEdit = () => {
    if (!editingDeal) return;
    
    const updatedDeal = {
      id: editingDeal.id,
      ...editFormData,
      price: editFormData.price.toString(),
      originalPrice: editFormData.originalPrice ? editFormData.originalPrice.toString() : null
    };
    
    editDealMutation.mutate(updatedDeal);
  };

  const handleImageChange = (images: string[]) => {
    setEditFormData(prev => ({ ...prev, imageUrl: images[0] || "" }));
  };

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

        {/* FREE Promotional Period Banner */}
        <div className="mb-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white text-center" data-testid="promotional-banner">
          <div className="flex items-center justify-center mb-2">
            <Flame className="h-6 w-6 mr-2 text-orange-200" />
            <h2 className="text-2xl font-bold">🎉 FREE UNTIL 31ST DECEMBER 2025!</h2>
            <Flame className="h-6 w-6 ml-2 text-orange-200" />
          </div>
          <p className="text-lg mb-2">
            <strong>All your deal posting is 100% FREE until 31st December 2025!</strong>
          </p>
          <p className="text-sm opacity-90">
            Post unlimited HOT and REGULAR deals at no cost • No credit charges until 31st December 2025
          </p>
          <div className="mt-3 inline-flex items-center bg-white/20 rounded-full px-4 py-2 text-sm font-medium">
            <Package className="h-4 w-4 mr-2" />
            You're saving R125 per HOT deal • R50 per REGULAR deal until Dec 2025
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
                    💡 1 Credit = R2.50
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
              <div className="space-y-4">
                {deals.slice(0, 6).map((deal: DealWithSupplier) => (
                  <Card key={deal.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={deal.dealType === "hot" ? "destructive" : "default"}>
                            {deal.dealType === "hot" ? "🔥 HOT DEAL" : "📦 REGULAR"}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Posted: {deal.createdAt ? new Date(deal.createdAt).toLocaleDateString() : 'Unknown'}
                          </span>
                        </div>
                        
                        <h3 className="font-semibold text-slate-900 mb-1" data-testid={`text-deal-title-${deal.id}`}>
                          {deal.title}
                        </h3>
                        
                        <div className="text-sm text-muted-foreground mb-2" data-testid={`text-deal-category-${deal.id}`}>
                          {deal.category} • R{parseFloat(deal.price).toLocaleString()}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            Current expiry: {deal.expiresAt ? new Date(deal.expiresAt).toLocaleDateString() : 'No expiry set'}
                          </div>
                          <div className="text-orange-600">
                            {deal.expiresAt ? (() => {
                              const daysLeft = Math.ceil((new Date(deal.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                              return daysLeft > 0 ? `${daysLeft} day${daysLeft > 1 ? 's' : ''} left` : 'Expired';
                            })() : 'No expiry'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditDeal(deal);
                          }}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          data-testid={`button-edit-deal-${deal.id}`}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteDeal(deal.id);
                          }}
                          disabled={deletingDealId === deal.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          data-testid={`button-delete-deal-${deal.id}`}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          {deletingDealId === deal.id ? "Deleting..." : "Delete"}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setExtendingDealId(deal.id);
                            setExtendExpirationDate("");
                          }}
                          data-testid={`button-extend-deal-${deal.id}`}
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          Extend Expiry
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                
                {/* Extend Modal */}
                {extendingDealId && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                      <h3 className="text-lg font-semibold mb-4">Extend Deal Expiry</h3>
                      
                      {(() => {
                        const currentDeal = deals?.find(d => d.id === extendingDealId);
                        if (!currentDeal) return null;
                        
                        return (
                          <div className="space-y-4">
                            <div className="text-sm">
                              <strong>{currentDeal.title}</strong>
                              <div className="mt-2 p-3 bg-slate-50 rounded border">
                                <div>Current expiry: {currentDeal.expiresAt ? new Date(currentDeal.expiresAt).toLocaleDateString() : 'Not set'}</div>
                                <div>Deal type: {currentDeal.dealType === "hot" ? "HOT DEAL" : "REGULAR DEAL"}</div>
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor="extend-expiry-date">New Expiry Date</Label>
                              <Input
                                id="extend-expiry-date"
                                type="date"
                                value={extendExpirationDate}
                                onChange={(e) => setExtendExpirationDate(e.target.value)}
                                className="mt-1"
                                min={new Date().toISOString().split('T')[0]}
                              />
                            </div>
                            
                            {extendExpirationDate && currentDeal.expiresAt && (
                              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                                <div className="text-sm font-medium text-blue-900 mb-1">Extension Cost</div>
                                <div className="text-sm text-blue-800">
                                  {(() => {
                                    const currentExpiry = new Date(currentDeal.expiresAt);
                                    const newExpiry = new Date(extendExpirationDate);
                                    const extraDays = Math.ceil((newExpiry.getTime() - currentExpiry.getTime()) / (1000 * 60 * 60 * 24));
                                    
                                    if (extraDays <= 0) return "Please select a date after the current expiry";
                                    
                                    // Check if we're in promotional period
                                    const promotionalEndDate = new Date('2025-12-31T23:59:59.000Z');
                                    const isPromotionalPeriod = new Date() < promotionalEndDate;
                                    
                                    if (isPromotionalPeriod) {
                                      return (
                                        <div className="text-green-700 font-medium">
                                          <div>{extraDays} extra day{extraDays > 1 ? 's' : ''}</div>
                                          <div>🎉 FREE during promotional period!</div>
                                          <div className="text-xs">Free until December 31st, 2025</div>
                                        </div>
                                      );
                                    }
                                    
                                    // Calculate cost: HOT deals = 5 credits per day, REGULAR = 2 credits per day
                                    const creditsPerDay = currentDeal.dealType === "hot" ? 5 : 2;
                                    const totalCredits = extraDays * creditsPerDay;
                                    const totalCost = totalCredits * 2.5; // R2.50 per credit
                                    
                                    return (
                                      <div>
                                        <div>{extraDays} extra day{extraDays > 1 ? 's' : ''} × {creditsPerDay} credits = {totalCredits} credits</div>
                                        <div className="font-medium">Total cost: R{totalCost.toFixed(2)}</div>
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>
                            )}
                            
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setExtendingDealId(null);
                                  setExtendExpirationDate("");
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => handleExtendDeal(extendingDealId)}
                                disabled={extendDealMutation.isPending || !extendExpirationDate}
                              >
                                {extendDealMutation.isPending ? "Extending..." : "Extend Deal"}
                              </Button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDeal(deal.id)}
                          disabled={deletingDealId === deal.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          data-testid={`button-delete-expired-deal-${deal.id}`}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          {deletingDealId === deal.id ? "Deleting..." : "Delete"}
                        </Button>
                        
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

      {/* Extend Deal Modal */}
      {extendingDealId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Extend Deal Expiry</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setExtendingDealId(null);
                  setExtendExpirationDate("");
                }}
                className="h-8 w-8 p-0"
              >
                ×
              </Button>
            </div>
            
            {(() => {
              const deal = deals?.find(d => d.id === extendingDealId);
              if (!deal) return null;
              
              return (
                <div className="space-y-4">
                  <div className="text-sm">
                    <strong>{deal.title}</strong>
                    <div className="mt-2 p-3 bg-slate-50 rounded border">
                      <div>Current expiry: {deal.expiresAt ? new Date(deal.expiresAt).toLocaleDateString() : 'Not set'}</div>
                      <div>Deal type: {deal.dealType === "hot" ? "HOT DEAL" : "REGULAR DEAL"}</div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="extend-expiry-date">New Expiry Date</Label>
                    <Input
                      id="extend-expiry-date"
                      type="date"
                      value={extendExpirationDate}
                      onChange={(e) => setExtendExpirationDate(e.target.value)}
                      className="mt-1"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  {extendExpirationDate && deal.expiresAt && (
                    <div className="p-3 bg-blue-50 rounded border border-blue-200">
                      <div className="text-sm font-medium text-blue-900 mb-1">Extension Cost</div>
                      <div className="text-sm text-blue-800">
                        {(() => {
                          const currentExpiry = new Date(deal.expiresAt);
                          const newExpiry = new Date(extendExpirationDate);
                          const daysDiff = Math.ceil((newExpiry.getTime() - currentExpiry.getTime()) / (1000 * 60 * 60 * 24));
                          const costPerDay = deal.dealType === "hot" ? 2 : 1;
                          const totalCost = Math.max(0, daysDiff) * costPerDay;
                          
                          return (
                            <>
                              <div>Extension: {Math.max(0, daysDiff)} days</div>
                              <div>Rate: {costPerDay} credit{costPerDay !== 1 ? 's' : ''} per day</div>
                              <div className="font-semibold">Total: {totalCost} credit{totalCost !== 1 ? 's' : ''}</div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setExtendingDealId(null);
                        setExtendExpirationDate("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleExtendDeal(deal.id)}
                      disabled={extendDealMutation.isPending || !extendExpirationDate}
                    >
                      {extendDealMutation.isPending ? "Extending..." : "Extend & Charge Credits"}
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Edit Deal Modal */}
      {editingDeal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Edit Deal - {editingDeal.title}</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingDeal(null)}
                className="h-8 w-8 p-0"
              >
                ×
              </Button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Update your deal information below. Changes will be saved immediately.
            </p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Deal title"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Deal description"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editFormData.category}
                  onValueChange={(value) => setEditFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Industrial Equipment">Industrial Equipment</SelectItem>
                    <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                    <SelectItem value="Software & Services">Software & Services</SelectItem>
                    <SelectItem value="Construction & Building">Construction & Building</SelectItem>
                    <SelectItem value="Automotive & Transport">Automotive & Transport</SelectItem>
                    <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                    <SelectItem value="Healthcare & Medical">Healthcare & Medical</SelectItem>
                    <SelectItem value="Agriculture & Farming">Agriculture & Farming</SelectItem>
                    <SelectItem value="Mining">Mining</SelectItem>
                    <SelectItem value="General Industry">General Industry</SelectItem>
                    <SelectItem value="Residential">Residential</SelectItem>
                    <SelectItem value="Textiles & Clothing">Textiles & Clothing</SelectItem>
                    <SelectItem value="Energy & Utilities">Energy & Utilities</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-price">Price (R)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editFormData.price}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-original-price">Original Price (R)</Label>
                  <Input
                    id="edit-original-price"
                    type="number"
                    value={editFormData.originalPrice}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-size">Size/Dimensions</Label>
                <Input
                  id="edit-size"
                  value={editFormData.size}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, size: e.target.value }))}
                  placeholder="e.g., 50m x 50m"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-quantity">Quantity Available</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  value={editFormData.quantityAvailable}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, quantityAvailable: parseInt(e.target.value) || 1 }))}
                  min="1"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-specifications">Product Specifications</Label>
                <Textarea
                  id="edit-specifications"
                  value={editFormData.productSpecifications}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, productSpecifications: e.target.value }))}
                  placeholder="Additional product details"
                  rows={2}
                />
              </div>
              
              <div>
                <Label>Image</Label>
                <div className="space-y-2">
                  <Input
                    type="url"
                    value={editFormData.imageUrl}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="Image URL (or upload new image below)"
                  />
                  {editFormData.imageUrl && (
                    <div className="border rounded-lg p-2">
                      <img 
                        src={editFormData.imageUrl} 
                        alt="Current deal image" 
                        className="w-full h-32 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <ImageUpload
                    images={editFormData.imageUrl ? [editFormData.imageUrl] : []}
                    onImagesChange={handleImageChange}
                    maxImages={1}
                    label="Upload New Image"
                    description="Upload a new image to replace the current one"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setEditingDeal(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  disabled={editDealMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  {editDealMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
