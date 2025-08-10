import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ticket, Copy, ExternalLink, Calendar, Package, User } from "lucide-react";
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

        {/* Coupons Grid */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <Card 
                key={coupon.id} 
                className={`hover:shadow-lg transition-shadow ${
                  coupon.isRedeemed ? 'bg-slate-50 border-slate-300' : 
                  isExpired(coupon.expiresAt) ? 'bg-red-50 border-red-200' : 
                  'bg-white border-green-200'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge 
                      className={
                        coupon.isRedeemed ? 'bg-slate-500' : 
                        isExpired(coupon.expiresAt) ? 'bg-red-500' : 
                        'bg-green-600'
                      }
                    >
                      {coupon.isRedeemed ? 'REDEEMED' : 
                       isExpired(coupon.expiresAt) ? 'EXPIRED' : 'ACTIVE'}
                    </Badge>
                    <Ticket className={`h-5 w-5 ${
                      coupon.isRedeemed ? 'text-slate-400' : 
                      isExpired(coupon.expiresAt) ? 'text-red-400' : 
                      'text-green-600'
                    }`} />
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
                        <span className="text-sm text-slate-500 line-through">
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
                        <User className="h-4 w-4" />
                        <span>Redeemed: {formatDate(coupon.redeemedAt)}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  {coupon.redirectUrl && !coupon.isRedeemed && !isExpired(coupon.expiresAt) && (
                    <Link href={coupon.redirectUrl}>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700 gap-2">
                        <ExternalLink className="h-4 w-4" />
                        View Coupon Details
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}