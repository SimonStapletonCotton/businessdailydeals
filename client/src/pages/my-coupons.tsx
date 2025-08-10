import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ticket, Copy, ExternalLink, Calendar, Package, User, CheckCircle, Clock, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface Coupon {
  id: string;
  couponCode: string;
  dealTitle: string;
  dealPrice: string;
  dealOriginalPrice?: string;
  dealDescription: string;
  discountAmount?: string;
  isRedeemed: boolean;
  redeemedAt?: string;
  expiresAt: string;
  validUntil: string;
  createdAt: string;
  redirectUrl?: string;
}

export default function MyCoupons() {
  const { toast } = useToast();

  const { data: coupons = [], isLoading, error } = useQuery<Coupon[]>({
    queryKey: ["/api", "buyer", "coupons"],
    retry: false,
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Coupon code copied to clipboard",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return `R${num.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  // Filter coupons by status
  const activeCoupons = coupons.filter(coupon => !coupon.isRedeemed && !isExpired(coupon.expiresAt));
  const redeemedCoupons = coupons.filter(coupon => coupon.isRedeemed);
  const expiredCoupons = coupons.filter(coupon => !coupon.isRedeemed && isExpired(coupon.expiresAt));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-orange-100 via-orange-50 to-slate-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">Loading your coupons...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-orange-100 via-orange-50 to-slate-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <Ticket className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Unable to Load Coupons</h2>
            <p className="text-slate-600 mb-6">Please log in to view your coupons.</p>
            <Link href="/api/login">
              <Button className="bg-orange-600 hover:bg-orange-700">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-100 via-orange-50 to-slate-100">
      {/* Header */}
      <div className="bg-slate-700 text-white py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <Ticket className="h-8 w-8 text-orange-400" />
            <h1 className="text-3xl font-bold">My Coupons</h1>
          </div>
          <p className="text-slate-300">View and manage your deal coupons</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Navigation */}
        <div className="flex gap-4 mb-6">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Coupons Tabs */}
        {coupons.length === 0 ? (
          <div className="text-center py-20">
            <Ticket className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-4">No Coupons Yet</h2>
            <p className="text-slate-600 mb-6">
              You haven't generated any coupons yet. Browse our hot deals to get started!
            </p>
            <Link href="/hot-deals">
              <Button className="bg-red-600 hover:bg-red-700">
                Browse Hot Deals
              </Button>
            </Link>
          </div>
        ) : (
          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Active ({activeCoupons.length})
              </TabsTrigger>
              <TabsTrigger value="redeemed" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Redeemed ({redeemedCoupons.length})
              </TabsTrigger>
              <TabsTrigger value="expired" className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Expired ({expiredCoupons.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              {activeCoupons.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No Active Coupons</h3>
                  <p className="text-slate-600">You don't have any active coupons at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeCoupons.map((coupon) => (
                    <CouponCardComponent 
                      key={coupon.id} 
                      coupon={coupon} 
                      status="active" 
                      copyToClipboard={copyToClipboard} 
                      formatDate={formatDate} 
                      formatPrice={formatPrice} 
                      isExpired={isExpired}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="redeemed">
              {redeemedCoupons.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No Redeemed Coupons</h3>
                  <p className="text-slate-600">You haven't redeemed any coupons yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {redeemedCoupons.map((coupon) => (
                    <CouponCardComponent 
                      key={coupon.id} 
                      coupon={coupon} 
                      status="redeemed" 
                      copyToClipboard={copyToClipboard} 
                      formatDate={formatDate} 
                      formatPrice={formatPrice} 
                      isExpired={isExpired}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="expired">
              {expiredCoupons.length === 0 ? (
                <div className="text-center py-12">
                  <XCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No Expired Coupons</h3>
                  <p className="text-slate-600">You don't have any expired coupons.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {expiredCoupons.map((coupon) => (
                    <CouponCardComponent 
                      key={coupon.id} 
                      coupon={coupon} 
                      status="expired" 
                      copyToClipboard={copyToClipboard} 
                      formatDate={formatDate} 
                      formatPrice={formatPrice} 
                      isExpired={isExpired}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

// Coupon Card Component
function CouponCardComponent({ 
  coupon, 
  status, 
  copyToClipboard, 
  formatDate, 
  formatPrice,
  isExpired
}: { 
  coupon: Coupon; 
  status: 'active' | 'redeemed' | 'expired';
  copyToClipboard: (text: string) => void;
  formatDate: (dateString: string) => string;
  formatPrice: (price: string) => string;
  isExpired: (expiresAt: string) => boolean;
}) {
  const getStatusStyles = () => {
    switch (status) {
      case 'active':
        return {
          card: 'bg-white border-green-200 hover:border-green-300',
          badge: 'bg-green-600 text-white',
          icon: 'text-green-600'
        };
      case 'redeemed':
        return {
          card: 'bg-slate-50 border-slate-300',
          badge: 'bg-slate-500 text-white',
          icon: 'text-slate-400'
        };
      case 'expired':
        return {
          card: 'bg-red-50 border-red-200',
          badge: 'bg-red-500 text-white',
          icon: 'text-red-400'
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <Card className={`hover:shadow-lg transition-shadow ${styles.card}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge className={styles.badge}>
            {status.toUpperCase()}
          </Badge>
          <Ticket className={`h-5 w-5 ${styles.icon}`} />
        </div>
        <CardTitle className="text-lg line-clamp-2">{coupon.dealTitle}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Deal Price */}
        <div className="bg-slate-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-slate-900">
              {formatPrice(coupon.dealPrice)}
            </span>
            {coupon.dealOriginalPrice && parseFloat(coupon.dealOriginalPrice) > parseFloat(coupon.dealPrice) && (
              <span className="text-2xl text-slate-700 line-through font-medium">
                {formatPrice(coupon.dealOriginalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Coupon Code */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-3 rounded-lg border-2 border-dashed border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Coupon Code</p>
              <p className="font-mono font-bold text-lg text-slate-900">{coupon.couponCode}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(coupon.couponCode)}
              className="gap-2"
              data-testid={`button-copy-coupon-${coupon.id}`}
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
          </div>
        </div>

        {/* Deal Description */}
        <div className="flex items-start gap-2">
          <Package className="h-4 w-4 text-slate-500 mt-1 flex-shrink-0" />
          <p className="text-sm text-slate-600 line-clamp-2">{coupon.dealDescription}</p>
        </div>

        {/* Dates */}
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Created: {formatDate(coupon.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className={isExpired(coupon.expiresAt) ? 'text-red-600 font-medium' : ''}>
              Expires: {formatDate(coupon.expiresAt)}
            </span>
          </div>
          {coupon.isRedeemed && coupon.redeemedAt && (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">
                Redeemed: {formatDate(coupon.redeemedAt)}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link href={`/coupon/${coupon.couponCode}`}>
            <Button 
              className="w-full" 
              variant={status === 'active' ? 'default' : 'outline'}
              disabled={status === 'expired'}
              data-testid={`button-view-coupon-${coupon.id}`}
            >
              <Ticket className="h-4 w-4 mr-2" />
              {status === 'active' ? 'View Coupon' : 
               status === 'redeemed' ? 'View Details' : 'Expired'}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}