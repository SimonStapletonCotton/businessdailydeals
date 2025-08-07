import { useEffect } from "react";
import Navbar from "@/components/navbar";
import DealCard from "@/components/deal-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, TrendingUp, Users, MessageCircle, Flame } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { DealWithSupplier, InquiryWithDetails } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function SupplierDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.userType !== "supplier") {
    return (
      <div className="min-h-screen bg-slate-50">
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
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900" data-testid="text-page-title">
              Supplier Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user.firstName || user.companyName || "Supplier"}
            </p>
          </div>
          <Link href="/post-deal">
            <Button className="bg-accent hover:bg-accent/90" data-testid="button-post-deal">
              <Plus className="h-4 w-4 mr-2" />
              Post New Deal
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900" data-testid="text-stat-total-deals">
                {deals?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Deals</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900" data-testid="text-stat-active-deals">
                {activeDeals.length}
              </div>
              <div className="text-sm text-muted-foreground">Active Deals</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Flame className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900" data-testid="text-stat-hot-deals">
                {hotDeals.length}
              </div>
              <div className="text-sm text-muted-foreground">Hot Deals</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900" data-testid="text-stat-inquiries">
                {pendingInquiries.length}
              </div>
              <div className="text-sm text-muted-foreground">Pending Inquiries</div>
            </CardContent>
          </Card>
        </div>

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
      </main>
    </div>
  );
}
