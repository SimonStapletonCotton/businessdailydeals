import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, PrinterIcon, QrCodeIcon, Ticket, Store, User, Phone, Mail, MapPin, Clock, Gift } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/navbar";

export default function CouponPage() {
  const { code } = useParams();

  const { data: coupon, isLoading, error } = useQuery({
    queryKey: [`/api/coupons/${code}`],
    enabled: !!code,
  });

  // Type guard to ensure coupon has required properties
  const isValidCoupon = (coupon: any): coupon is {
    couponCode: string;
    validUntil: string;
    createdAt: string;
    dealTitle: string;
    dealDescription: string;
    dealPrice: string;
    dealOriginalPrice?: string;
    isRedeemed: boolean;
    supplier: {
      companyName?: string;
      firstName: string;
      lastName: string;
      email?: string;
      mobile?: string;
    };
    buyer: {
      firstName: string;
      lastName: string;
      email: string;
    };
  } => {
    return coupon && typeof coupon === 'object' && 
           'couponCode' in coupon && 
           'validUntil' in coupon &&
           'createdAt' in coupon;
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !coupon || !isValidCoupon(coupon)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="text-center p-8">
            <CardContent>
              <Ticket className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Coupon Not Found</h2>
              <p className="text-slate-600">
                The coupon code you're looking for doesn't exist or has expired.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isExpired = new Date() > new Date(coupon.validUntil);
  const validUntilDate = new Date(coupon.validUntil);
  const issueDate = new Date(coupon.createdAt);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Print Header (only visible when printing) */}
        <div className="print-only mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Business Daily Deals</h1>
          <p className="text-slate-600">www.businessdailydeals.co.za</p>
          <p className="text-slate-600">B2B Marketplace - Deal Acceptance Coupon</p>
        </div>

        {/* Main Coupon Card */}
        <Card className="mb-8 shadow-2xl border-2 border-dashed border-orange-200 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader className="text-center bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Gift className="h-8 w-8" />
              <CardTitle className="text-3xl font-bold">DEAL ACCEPTANCE COUPON</CardTitle>
              <Gift className="h-8 w-8" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <QrCodeIcon className="h-5 w-5" />
              <span className="text-xl font-mono tracking-wider">{coupon.couponCode}</span>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {/* Status Badge */}
            <div className="flex justify-center mb-6">
              {isExpired ? (
                <Badge variant="destructive" className="text-lg px-4 py-2">
                  <Clock className="h-4 w-4 mr-2" />
                  EXPIRED
                </Badge>
              ) : coupon.isRedeemed ? (
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  <Ticket className="h-4 w-4 mr-2" />
                  REDEEMED
                </Badge>
              ) : (
                <Badge className="text-lg px-4 py-2 bg-green-600 hover:bg-green-700">
                  <Ticket className="h-4 w-4 mr-2" />
                  VALID
                </Badge>
              )}
            </div>

            {/* Deal Information */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Deal Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
                  Deal Information
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Deal Title</p>
                    <p className="text-lg font-semibold text-slate-900" data-testid="text-deal-title">{coupon.dealTitle}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Description</p>
                    <p className="text-slate-700" data-testid="text-deal-description">{coupon.dealDescription}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Special Price</p>
                      <p className="text-2xl font-bold text-green-600" data-testid="text-deal-price">
                        R{Number(coupon.dealPrice).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    {coupon.dealOriginalPrice && (
                      <div className="text-right">
                        <p className="text-sm text-slate-600 font-medium">Original Price</p>
                        <p className="text-lg text-slate-500 line-through" data-testid="text-original-price">
                          R{Number(coupon.dealOriginalPrice).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Validity & Supplier Info */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
                  Coupon Details
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Issue Date</p>
                    <p className="text-slate-900 flex items-center gap-2" data-testid="text-issue-date">
                      <CalendarIcon className="h-4 w-4" />
                      {format(issueDate, 'dd MMMM yyyy, HH:mm')}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Valid Until</p>
                    <p className={`flex items-center gap-2 font-semibold ${isExpired ? 'text-red-600' : 'text-green-600'}`} data-testid="text-valid-until">
                      <Clock className="h-4 w-4" />
                      {format(validUntilDate, 'dd MMMM yyyy, HH:mm')}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Supplier Contact</p>
                    <div className="space-y-2 text-slate-700">
                      <p className="flex items-center gap-2" data-testid="text-supplier-name">
                        <Store className="h-4 w-4" />
                        {coupon.supplier?.companyName || `${coupon.supplier?.firstName} ${coupon.supplier?.lastName}`}
                      </p>
                      {coupon.supplier?.email && (
                        <p className="flex items-center gap-2" data-testid="text-supplier-email">
                          <Mail className="h-4 w-4" />
                          {coupon.supplier.email}
                        </p>
                      )}
                      {coupon.supplier?.mobile && (
                        <p className="flex items-center gap-2" data-testid="text-supplier-mobile">
                          <Phone className="h-4 w-4" />
                          {coupon.supplier.mobile}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="text-lg font-bold text-blue-900 mb-3">How to Use This Coupon</h4>
              <div className="space-y-2 text-blue-800">
                <p>• Print this coupon or save it to your device</p>
                <p>• Contact the supplier using the details above</p>
                <p>• Present this coupon code: <strong className="font-mono">{coupon.couponCode}</strong></p>
                <p>• Coupon is valid for <strong>30 days</strong> from issue date</p>
                <p>• Terms and conditions may apply - confirm with supplier</p>
              </div>
            </div>

            {/* Buyer Information */}
            <div className="mt-8 p-4 bg-slate-50 rounded-lg">
              <h4 className="text-sm font-bold text-slate-700 mb-2">Issued To:</h4>
              <p className="text-slate-600 flex items-center gap-2" data-testid="text-buyer-name">
                <User className="h-4 w-4" />
                {coupon.buyer?.firstName} {coupon.buyer?.lastName} ({coupon.buyer?.email})
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 print:hidden">
          <Button onClick={handlePrint} size="lg" className="bg-blue-600 hover:bg-blue-700">
            <PrinterIcon className="h-5 w-5 mr-2" />
            Print Coupon
          </Button>
          <Button variant="outline" size="lg" onClick={() => window.history.back()}>
            Back to Deals
          </Button>
        </div>

        {/* Footer (print only) */}
        <div className="print-only mt-8 text-center text-sm text-slate-600 border-t pt-4">
          <p>This coupon was generated by Business Daily Deals (www.businessdailydeals.co.za)</p>
          <p>For support, contact: admin@businessdailydeals.co.za</p>
        </div>
      </div>
    </div>
  );
}