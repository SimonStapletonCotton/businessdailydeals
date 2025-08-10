import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ticket, Clock, Building, Package, TrendingUp, Users } from "lucide-react";
import { format } from "date-fns";

interface PublicCoupon {
  id: string;
  couponCode: string;
  createdAt: string;
  expiresAt: string;
  isRedeemed: boolean;
  dealTitle: string;
  dealPrice: string;
  dealOriginalPrice?: string;
  dealCategory: string;
  supplierCompanyName: string;
  supplierCity?: string;
  supplierProvince?: string;
  buyerFirstName?: string;
  buyerLastName?: string;
  buyerCity?: string;
  buyerProvince?: string;
  buyerCompanyName?: string;
}

export default function LiveCoupons() {
  const { data: coupons, isLoading } = useQuery<PublicCoupon[]>({
    queryKey: ["/api/coupons/public"],
  });

  const { data: stats } = useQuery<{
    totalCoupons: number;
    activeCoupons: number;
    redeemedCoupons: number;
    totalSavings: string;
  }>({
    queryKey: ["/api/coupons/stats"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Live Deal Activity
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          See real-time coupon generation and savings happening on Business Daily Deals.
          Join thousands of buyers already saving money!
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">
                Total Coupons
              </CardTitle>
              <Ticket className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {stats.totalCoupons.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">
                Active Coupons
              </CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {stats.activeCoupons.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">
                Redeemed
              </CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {stats.redeemedCoupons.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">
                Total Savings
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">
                R{parseFloat(stats.totalSavings).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Coupons */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Ticket className="h-6 w-6 text-green-600" />
          All Issued Coupons
        </h2>
        <p className="text-gray-600 mb-6">
          Complete list of all coupons issued with buyer identification for easy searching, downloading, saving, and printing.
        </p>
      </div>

      {/* Coupons Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {coupons?.map((coupon) => {
          const isExpired = new Date(coupon.expiresAt) < new Date();
          const discount = coupon.dealOriginalPrice 
            ? Math.round(((parseFloat(coupon.dealOriginalPrice) - parseFloat(coupon.dealPrice)) / parseFloat(coupon.dealOriginalPrice)) * 100)
            : 0;

          return (
            <Card key={coupon.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold line-clamp-2 text-gray-900">
                      {coupon.dealTitle}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Building className="h-3 w-3" />
                      {coupon.supplierCompanyName}
                      {coupon.supplierCity && (
                        <span className="text-xs text-gray-500">
                          • {coupon.supplierCity}
                        </span>
                      )}
                    </CardDescription>
                    {/* Buyer Information */}
                    <div className="mt-2 text-sm text-gray-600 bg-blue-50 p-2 rounded border">
                      <div className="font-medium text-blue-800 mb-1">Coupon Holder:</div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {coupon.buyerFirstName} {coupon.buyerLastName}
                        </span>
                        {coupon.buyerCompanyName && (
                          <span className="text-xs text-blue-600">
                            • {coupon.buyerCompanyName}
                          </span>
                        )}
                      </div>
                      {(coupon.buyerCity || coupon.buyerProvince) && (
                        <div className="text-xs text-blue-600 mt-1">
                          {coupon.buyerCity}{coupon.buyerCity && coupon.buyerProvince ? ', ' : ''}{coupon.buyerProvince}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {coupon.isRedeemed && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        Redeemed
                      </Badge>
                    )}
                    {isExpired && !coupon.isRedeemed && (
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                        Expired
                      </Badge>
                    )}
                    {!isExpired && !coupon.isRedeemed && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {/* Price and Discount */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-600">
                        R{parseFloat(coupon.dealPrice).toLocaleString()}
                      </span>
                      {coupon.dealOriginalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          R{parseFloat(coupon.dealOriginalPrice).toLocaleString()}
                        </span>
                      )}
                    </div>
                    {discount > 0 && (
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        {discount}% OFF
                      </Badge>
                    )}
                  </div>

                  {/* Category and Timing */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {coupon.dealCategory}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(coupon.createdAt), 'MMM dd')}
                    </div>
                  </div>

                  {/* Full Coupon Code for downloading/printing */}
                  <div className="bg-gray-50 p-3 rounded border">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Coupon Code
                    </div>
                    <div className="font-mono text-sm font-bold text-green-700">
                      {coupon.couponCode}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button 
                        onClick={() => navigator.clipboard.writeText(coupon.couponCode)}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                        data-testid={`button-copy-${coupon.id}`}
                      >
                        Copy Code
                      </button>
                      <button 
                        onClick={() => window.print()}
                        className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                        data-testid={`button-print-${coupon.id}`}
                      >
                        Print Coupon
                      </button>
                    </div>
                  </div>

                  {/* Expiry */}
                  <div className="text-xs text-gray-500">
                    {isExpired ? 'Expired' : 'Valid until'} {format(new Date(coupon.expiresAt), 'MMM dd, yyyy')}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {coupons && coupons.length === 0 && (
        <div className="text-center py-12">
          <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Coupons Yet
          </h3>
          <p className="text-gray-600">
            Be the first to generate a coupon by accepting a deal!
          </p>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-12 text-center bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg border">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Save Money?
        </h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Join Business Daily Deals today and start generating your own coupons from thousands of deals across South Africa.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/register-buyer"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Register as Buyer
          </a>
          <a
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Browse Deals
          </a>
        </div>
      </div>
    </div>
  );
}