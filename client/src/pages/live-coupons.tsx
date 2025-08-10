import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ticket, Clock, Building, Package, TrendingUp, Users, Printer, Download, Save } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/navbar";

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
  const { data: coupons, isLoading, error } = useQuery<PublicCoupon[]>({
    queryKey: ["/api/coupons/public"],
  });

  const { data: stats, error: statsError } = useQuery<{
    totalCoupons: number;
    activeCoupons: number;
    redeemedCoupons: number;
    totalSavings: string;
  }>({
    queryKey: ["/api/coupons/stats"],
  });

  // Debug logging (can be removed in production)
  console.log("LiveCoupons debug:", { 
    coupons, 
    isLoading, 
    error, 
    stats, 
    statsError,
    couponsLength: coupons?.length 
  });

  // Print individual coupon function
  const printCoupon = (coupon: PublicCoupon) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const isExpired = new Date(coupon.expiresAt) < new Date();
    const discount = coupon.dealOriginalPrice 
      ? Math.round(((parseFloat(coupon.dealOriginalPrice) - parseFloat(coupon.dealPrice)) / parseFloat(coupon.dealOriginalPrice)) * 100)
      : 0;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Business Daily Deals Coupon - ${coupon.couponCode}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: white;
            }
            .coupon {
              max-width: 600px;
              margin: 0 auto;
              border: 3px dashed #ff6b35;
              border-radius: 15px;
              padding: 30px;
              background: linear-gradient(135deg, #fff5f0 0%, #ffe5d9 100%);
              box-shadow: 0 8px 32px rgba(255, 107, 53, 0.2);
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #ff6b35;
              padding-bottom: 20px;
              margin-bottom: 25px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #ff6b35;
              margin-bottom: 5px;
            }
            .tagline {
              color: #64748b;
              font-size: 14px;
            }
            .deal-title {
              font-size: 24px;
              font-weight: bold;
              color: #1e293b;
              margin: 20px 0 15px 0;
              text-align: center;
            }
            .price-section {
              text-align: center;
              margin: 20px 0;
              padding: 15px;
              background: rgba(255, 107, 53, 0.1);
              border-radius: 10px;
            }
            .current-price {
              font-size: 32px;
              font-weight: bold;
              color: #16a34a;
            }
            .original-price {
              font-size: 18px;
              text-decoration: line-through;
              color: #64748b;
              margin-left: 10px;
            }
            .savings {
              color: #dc2626;
              font-weight: bold;
              font-size: 16px;
            }
            .details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin: 25px 0;
            }
            .detail-section {
              background: rgba(255, 255, 255, 0.8);
              padding: 15px;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            }
            .detail-title {
              font-weight: bold;
              color: #ff6b35;
              margin-bottom: 8px;
              font-size: 14px;
              text-transform: uppercase;
            }
            .detail-value {
              color: #1e293b;
              font-size: 13px;
              line-height: 1.4;
            }
            .coupon-code {
              text-align: center;
              margin: 25px 0;
              padding: 15px;
              background: #1e293b;
              color: white;
              border-radius: 8px;
              font-family: 'Courier New', monospace;
            }
            .code-label {
              font-size: 12px;
              margin-bottom: 5px;
              opacity: 0.8;
            }
            .code-value {
              font-size: 20px;
              font-weight: bold;
              letter-spacing: 2px;
            }
            .validity {
              text-align: center;
              margin-top: 20px;
              padding: 10px;
              ${isExpired ? 'background: #fee2e2; color: #dc2626;' : 'background: #dcfce7; color: #16a34a;'}
              border-radius: 6px;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 25px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              font-size: 12px;
              color: #64748b;
            }
            @media print {
              body { margin: 0; padding: 10px; }
              .coupon { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="coupon">
            <div class="header">
              <div class="logo">🎯 BUSINESS DAILY DEALS</div>
              <div class="tagline">South Africa's Premier B2B Marketplace</div>
            </div>
            
            <div class="deal-title">${coupon.dealTitle}</div>
            
            <div class="price-section">
              <span class="current-price">R${parseFloat(coupon.dealPrice).toLocaleString()}</span>
              ${coupon.dealOriginalPrice ? `<span class="original-price">R${parseFloat(coupon.dealOriginalPrice).toLocaleString()}</span>` : ''}
              ${discount > 0 ? `<div class="savings">Save ${discount}% • R${(parseFloat(coupon.dealOriginalPrice || '0') - parseFloat(coupon.dealPrice)).toLocaleString()} off!</div>` : ''}
            </div>
            
            <div class="details-grid">
              <div class="detail-section">
                <div class="detail-title">Coupon Holder</div>
                <div class="detail-value">
                  <strong>${coupon.buyerFirstName} ${coupon.buyerLastName}</strong><br>
                  ${coupon.buyerCompanyName ? `${coupon.buyerCompanyName}<br>` : ''}
                  ${coupon.buyerCity || coupon.buyerProvince ? `${coupon.buyerCity || ''}${coupon.buyerCity && coupon.buyerProvince ? ', ' : ''}${coupon.buyerProvince || ''}` : 'Location not specified'}
                </div>
              </div>
              
              <div class="detail-section">
                <div class="detail-title">Supplier Details</div>
                <div class="detail-value">
                  ${coupon.supplierCompanyName || 'Company Name Not Available'}<br>
                  ${coupon.supplierCity || coupon.supplierProvince ? `${coupon.supplierCity || ''}${coupon.supplierCity && coupon.supplierProvince ? ', ' : ''}${coupon.supplierProvince || ''}` : 'Location not specified'}<br>
                  Category: ${coupon.dealCategory}
                </div>
              </div>
            </div>
            
            <div class="coupon-code">
              <div class="code-label">COUPON CODE</div>
              <div class="code-value">${coupon.couponCode}</div>
            </div>
            
            <div class="validity">
              ${isExpired ? 'EXPIRED' : 'VALID'} until ${format(new Date(coupon.expiresAt), 'MMMM dd, yyyy')}
            </div>
            
            <div class="detail-section" style="margin-top: 20px;">
              <div class="detail-title">Deal Information</div>
              <div class="detail-value">
                <strong>Deal Title:</strong> ${coupon.dealTitle}<br>
                <strong>Category:</strong> ${coupon.dealCategory}<br>
                <strong>Coupon Price:</strong> R${parseFloat(coupon.dealPrice).toLocaleString()}<br>
                ${coupon.dealOriginalPrice ? `<strong>Original Price:</strong> R${parseFloat(coupon.dealOriginalPrice).toLocaleString()}<br>` : ''}
                ${discount > 0 ? `<strong>Your Savings:</strong> ${discount}% off (R${(parseFloat(coupon.dealOriginalPrice || '0') - parseFloat(coupon.dealPrice)).toLocaleString()})<br>` : ''}
                <strong>Deal Description:</strong> This coupon entitles the holder to purchase "${coupon.dealTitle}" at the special deal price of R${parseFloat(coupon.dealPrice).toLocaleString()}.
              </div>
            </div>
            
            <div class="detail-section" style="margin-top: 15px;">
              <div class="detail-title">Coupon Information</div>
              <div class="detail-value">
                <strong>Generated:</strong> ${format(new Date(coupon.createdAt), 'MMMM dd, yyyy \'at\' HH:mm')}<br>
                <strong>Status:</strong> ${coupon.isRedeemed ? 'REDEEMED' : 'ACTIVE'}<br>
                <strong>Redemption:</strong> Present this coupon to the supplier to purchase at the deal price
              </div>
            </div>
            
            <div class="footer">
              <strong>www.businessdailydeals.co.za</strong><br>
              <strong>HOW TO REDEEM:</strong> Present this coupon to the supplier listed above to purchase "${coupon.dealTitle}" at the special deal price of R${parseFloat(coupon.dealPrice).toLocaleString()}.<br>
              Terms and conditions may apply. Coupon valid for single use only. Valid until ${format(new Date(coupon.expiresAt), 'MMMM dd, yyyy')}.
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

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
    <>
      <Navbar />
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
                    </div>
                  </div>

                  {/* Expiry */}
                  <div className="text-xs text-gray-500">
                    {isExpired ? 'Expired' : 'Valid until'} {format(new Date(coupon.expiresAt), 'MMM dd, yyyy')}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => printCoupon(coupon)}
                      className="flex items-center gap-1"
                      data-testid={`button-print-${coupon.id}`}
                    >
                      <Printer className="h-3 w-3" />
                      Print
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(`Business Daily Deals Coupon\nCode: ${coupon.couponCode}\nDeal: ${coupon.dealTitle}\nPrice: R${coupon.dealPrice}\nValid until: ${format(new Date(coupon.expiresAt), 'MMM dd, yyyy')}`)}`;
                        link.download = `coupon-${coupon.couponCode}.txt`;
                        link.click();
                      }}
                      className="flex items-center gap-1"
                      data-testid={`button-save-${coupon.id}`}
                    >
                      <Save className="h-3 w-3" />
                      Save
                    </Button>
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


      </div>
    </>
  );
}