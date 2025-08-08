import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { CouponCard } from "@/components/coupon-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ticket, Download, Clock, CheckCircle } from "lucide-react";
import type { CouponWithDetails } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useEffect } from "react";

export default function MyCoupons() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: coupons, isLoading: couponsLoading } = useQuery({
    queryKey: ["/api/buyer/coupons"],
    enabled: isAuthenticated,
    retry: false,
  });

  const handleDownloadCoupon = (coupon: CouponWithDetails) => {
    // Generate and download PDF coupon
    const couponHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Business Daily Deals Coupon - ${coupon.couponCode}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .coupon { border: 3px dashed #6B7280; padding: 30px; margin: 20px 0; background: #F9FAFB; }
            .header { text-align: center; color: #059669; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
            .code { background: #374151; color: white; padding: 10px; font-family: monospace; font-size: 18px; text-align: center; margin: 20px 0; }
            .details { margin: 15px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6B7280; }
            .deal-title { font-size: 20px; font-weight: bold; color: #111827; margin-bottom: 10px; }
            .price { font-size: 24px; color: #059669; font-weight: bold; }
            .status { text-align: center; padding: 10px; margin: 20px 0; }
            .active { background: #D1FAE5; color: #065F46; }
            .redeemed { background: #FEE2E2; color: #991B1B; }
            .expired { background: #F3F4F6; color: #374151; }
          </style>
        </head>
        <body>
          <div class="coupon">
            <div class="header">🎫 BUSINESS DAILY DEALS COUPON</div>
            <div class="deal-title">${coupon.deal.title}</div>
            <div class="status ${coupon.status}">
              Status: ${coupon.status.toUpperCase()}
            </div>
            <div class="details">
              <p><strong>Deal Price:</strong> <span class="price">R${parseFloat(coupon.deal.price).toLocaleString()}</span></p>
              ${coupon.deal.originalPrice ? `<p><strong>Original Price:</strong> R${parseFloat(coupon.deal.originalPrice).toLocaleString()}</p>` : ''}
              ${coupon.deal.discount ? `<p><strong>Discount:</strong> ${coupon.deal.discount}% OFF</p>` : ''}
              <p><strong>Supplier:</strong> ${coupon.supplier.companyName || coupon.supplier.firstName}</p>
              <p><strong>Category:</strong> ${coupon.deal.category}</p>
              <p><strong>Min Order:</strong> ${coupon.deal.minOrder} unit${coupon.deal.minOrder !== 1 ? 's' : ''}</p>
            </div>
            <div class="code">Coupon Code: ${coupon.couponCode}</div>
            <div class="details">
              <p><strong>Downloaded:</strong> ${coupon.downloadedAt ? new Date(coupon.downloadedAt).toLocaleDateString('en-ZA') : 'N/A'}</p>
              <p><strong>Valid Until:</strong> ${new Date(coupon.expiresAt).toLocaleDateString('en-ZA')}</p>
              ${coupon.redeemedAt ? `<p><strong>Redeemed:</strong> ${new Date(coupon.redeemedAt).toLocaleDateString('en-ZA')}</p>` : ''}
              <p><strong>Description:</strong> ${coupon.deal.description}</p>
              ${coupon.redemptionNotes ? `<p><strong>Redemption Notes:</strong> ${coupon.redemptionNotes}</p>` : ''}
            </div>
            <div class="footer">
              <p>Present this coupon to the supplier to redeem this offer</p>
              <p>www.businessdailydeals.com.za</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Open coupon in new window for printing/saving
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(couponHTML);
      newWindow.document.close();
    }
  };

  if (isLoading || couponsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-olive-50 to-charcoal-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-charcoal-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-charcoal-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  const couponsArray = (coupons as CouponWithDetails[]) || [];
  
  const activeCoupons = couponsArray.filter((c: CouponWithDetails) => 
    c.status === "active" && new Date(c.expiresAt) > new Date()
  );
  
  const redeemedCoupons = couponsArray.filter((c: CouponWithDetails) => 
    c.status === "redeemed"
  );
  
  const expiredCoupons = couponsArray.filter((c: CouponWithDetails) => 
    c.status === "expired" || new Date(c.expiresAt) <= new Date()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-stone-50 to-slate-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Modern Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-4 rounded-full">
              <Ticket className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
            My Coupons
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            View, download, and manage your deal coupons from South African suppliers. Present these to redeem your offers.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-olive-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-charcoal-600">Active Coupons</CardTitle>
              <Clock className="h-4 w-4 text-olive-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-olive-700">{activeCoupons.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-charcoal-600">Redeemed</CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700">{redeemedCoupons.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-charcoal-600">Expired</CardTitle>
              <div className="w-4 h-4 rounded-full bg-gray-400"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-700">{expiredCoupons.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Coupons List */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-charcoal-200">
            <TabsTrigger 
              value="active" 
              className="data-[state=active]:bg-olive-600 data-[state=active]:text-white"
              data-testid="tab-active-coupons"
            >
              Active ({activeCoupons.length})
            </TabsTrigger>
            <TabsTrigger 
              value="redeemed" 
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              data-testid="tab-redeemed-coupons"
            >
              Redeemed ({redeemedCoupons.length})
            </TabsTrigger>
            <TabsTrigger 
              value="expired" 
              className="data-[state=active]:bg-gray-600 data-[state=active]:text-white"
              data-testid="tab-expired-coupons"
            >
              Expired ({expiredCoupons.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            {activeCoupons.length === 0 ? (
              <Card className="bg-white">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Ticket className="h-12 w-12 text-charcoal-400 mb-4" />
                  <h3 className="text-lg font-semibold text-charcoal-900 mb-2">No Active Coupons</h3>
                  <p className="text-charcoal-600 text-center">
                    You haven't downloaded any coupons yet. Browse our deals and get coupons to save on your purchases!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeCoupons.map((coupon: CouponWithDetails) => (
                  <CouponCard
                    key={coupon.id}
                    coupon={coupon}
                    onDownload={handleDownloadCoupon}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="redeemed" className="mt-6">
            {redeemedCoupons.length === 0 ? (
              <Card className="bg-white">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="h-12 w-12 text-charcoal-400 mb-4" />
                  <h3 className="text-lg font-semibold text-charcoal-900 mb-2">No Redeemed Coupons</h3>
                  <p className="text-charcoal-600 text-center">
                    You haven't redeemed any coupons yet. Use your active coupons to get great deals!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {redeemedCoupons.map((coupon: CouponWithDetails) => (
                  <CouponCard
                    key={coupon.id}
                    coupon={coupon}
                    onDownload={handleDownloadCoupon}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="expired" className="mt-6">
            {expiredCoupons.length === 0 ? (
              <Card className="bg-white">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-charcoal-400 mb-4" />
                  <h3 className="text-lg font-semibold text-charcoal-900 mb-2">No Expired Coupons</h3>
                  <p className="text-charcoal-600 text-center">
                    Great! You don't have any expired coupons. Keep using your active coupons before they expire.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {expiredCoupons.map((coupon: CouponWithDetails) => (
                  <CouponCard
                    key={coupon.id}
                    coupon={coupon}
                    onDownload={handleDownloadCoupon}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}