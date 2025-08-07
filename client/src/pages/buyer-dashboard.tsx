import { useEffect } from "react";
import Navbar from "@/components/navbar";
import DealCard from "@/components/deal-card";
import KeywordNotifications from "@/components/keyword-notifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BellRing, Package, MessageCircle, TrendingUp, Eye, EyeOff } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { DealWithSupplier, NotificationWithDeal, InquiryWithDetails } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function BuyerDashboard() {
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
    if (!isLoading && isAuthenticated && user?.userType !== "buyer") {
      toast({
        title: "Access Denied",
        description: "You need to be a buyer to access this page.",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: notifications, isLoading: notificationsLoading } = useQuery<NotificationWithDeal[]>({
    queryKey: ["/api/notifications"],
    enabled: isAuthenticated && user?.userType === "buyer",
  });

  const { data: inquiries, isLoading: inquiriesLoading } = useQuery<InquiryWithDetails[]>({
    queryKey: ["/api/buyer/inquiries"],
    enabled: isAuthenticated && user?.userType === "buyer",
  });

  const { data: hotDeals, isLoading: hotDealsLoading } = useQuery<DealWithSupplier[]>({
    queryKey: ["/api/deals", { type: "hot" }],
    enabled: isAuthenticated && user?.userType === "buyer",
  });

  const { data: regularDeals, isLoading: regularDealsLoading } = useQuery<DealWithSupplier[]>({
    queryKey: ["/api/deals", { type: "regular" }],
    enabled: isAuthenticated && user?.userType === "buyer",
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      await apiRequest("PATCH", `/api/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
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
        description: "Failed to mark notification as read.",
        variant: "destructive",
      });
    },
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

  if (!isAuthenticated || user?.userType !== "buyer") {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You need to be a buyer to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  const unreadNotifications = notifications?.filter((n: NotificationWithDeal) => !n.isRead) || [];
  const recentNotifications = notifications?.slice(0, 5) || [];
  const recentInquiries = inquiries?.slice(0, 5) || [];
  const recommendedDeals = [...(hotDeals?.slice(0, 2) || []), ...(regularDeals?.slice(0, 4) || [])];

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900" data-testid="text-page-title">
            Buyer Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user.firstName || "Buyer"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Bell className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900" data-testid="text-stat-total-notifications">
                {notifications?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Notifications</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <BellRing className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900" data-testid="text-stat-unread-notifications">
                {unreadNotifications.length}
              </div>
              <div className="text-sm text-muted-foreground">Unread Notifications</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900" data-testid="text-stat-inquiries-sent">
                {inquiries?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Inquiries Sent</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900" data-testid="text-stat-deals-available">
                {(hotDeals?.length || 0) + (regularDeals?.length || 0)}
              </div>
              <div className="text-sm text-muted-foreground">Available Deals</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Notifications */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center" data-testid="text-notifications-title">
              <Bell className="h-5 w-5 mr-2" />
              Recent Notifications
              {unreadNotifications.length > 0 && (
                <Badge className="ml-2" data-testid="badge-unread-count">
                  {unreadNotifications.length} unread
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notificationsLoading ? (
              <div className="text-center py-4">Loading notifications...</div>
            ) : recentNotifications.length > 0 ? (
              <div className="space-y-4">
                {recentNotifications.map((notification: NotificationWithDeal) => (
                  <div 
                    key={notification.id} 
                    className={`flex items-center justify-between p-4 border rounded-lg ${
                      notification.isRead ? 'border-border bg-white' : 'border-primary/20 bg-primary/5'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {notification.isRead ? (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-primary" />
                        )}
                        <h4 className="font-semibold text-slate-900" data-testid={`text-notification-message-${notification.id}`}>
                          {notification.message}
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1" data-testid={`text-notification-deal-${notification.id}`}>
                        Deal: {notification.deal.title}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.isRead && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                          disabled={markAsReadMutation.isPending}
                          data-testid={`button-mark-read-${notification.id}`}
                        >
                          Mark as Read
                        </Button>
                      )}
                      <div className="text-xs text-muted-foreground" data-testid={`text-notification-date-${notification.id}`}>
                        {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString() : 'Unknown date'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground" data-testid="text-no-notifications">
                  No notifications yet. Set up keywords to receive alerts for matching deals.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Inquiries */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center" data-testid="text-inquiries-title">
              <MessageCircle className="h-5 w-5 mr-2" />
              Your Recent Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {inquiriesLoading ? (
              <div className="text-center py-4">Loading inquiries...</div>
            ) : recentInquiries.length > 0 ? (
              <div className="space-y-4">
                {recentInquiries.map((inquiry: InquiryWithDetails) => (
                  <div key={inquiry.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900" data-testid={`text-inquiry-deal-${inquiry.id}`}>
                        {inquiry.deal.title}
                      </h4>
                      <p className="text-sm text-muted-foreground" data-testid={`text-inquiry-supplier-${inquiry.id}`}>
                        To: {inquiry.supplier.companyName || inquiry.supplier.firstName}
                      </p>
                      {inquiry.message && (
                        <p className="text-sm text-slate-600 mt-1" data-testid={`text-inquiry-message-${inquiry.id}`}>
                          "{inquiry.message}"
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={inquiry.status === "pending" ? "default" : inquiry.status === "responded" ? "secondary" : "outline"}
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
                  No inquiries sent yet. Browse deals and send inquiries to suppliers.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Keyword Management */}
        <div className="mb-8">
          <KeywordNotifications />
        </div>

        {/* Recommended Deals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center" data-testid="text-recommended-deals-title">
              <Package className="h-5 w-5 mr-2" />
              Recommended Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hotDealsLoading || regularDealsLoading ? (
              <div className="text-center py-4">Loading deals...</div>
            ) : recommendedDeals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedDeals.map((deal: DealWithSupplier) => (
                  <DealCard 
                    key={deal.id} 
                    deal={deal} 
                    variant={deal.dealType === "hot" ? "hot" : "regular"} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground" data-testid="text-no-recommended-deals">
                  No deals available at the moment. Check back later for new opportunities.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
