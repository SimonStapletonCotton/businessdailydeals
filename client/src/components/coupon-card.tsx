import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Download, CheckCircle, AlertCircle } from "lucide-react";
import type { CouponWithDetails } from "@shared/schema";

interface CouponCardProps {
  coupon: CouponWithDetails;
  onDownload?: (coupon: CouponWithDetails) => void;
}

export function CouponCard({ coupon, onDownload }: CouponCardProps) {
  const isExpired = new Date(coupon.expiresAt) < new Date();
  const isRedeemed = coupon.status === "redeemed";
  
  const getStatusColor = () => {
    if (isRedeemed) return "bg-emerald-600 text-white";
    if (isExpired) return "bg-gray-500 text-white";
    return "bg-olive-600 text-white";
  };

  const getStatusText = () => {
    if (isRedeemed) return "Redeemed";
    if (isExpired) return "Expired";
    return "Active";
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return "N/A";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-ZA");
  };

  return (
    <Card className="border border-charcoal-200 bg-white hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-semibold text-charcoal-900 line-clamp-2">
            {coupon.deal.title}
          </CardTitle>
          <Badge className={getStatusColor()}>
            {getStatusText()}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-charcoal-600">
          <span className="font-mono bg-charcoal-100 px-2 py-1 rounded text-charcoal-800">
            {coupon.couponCode}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-charcoal-600">Deal Price:</span>
            <span className="font-semibold text-olive-700">
              R{parseFloat(coupon.deal.price).toLocaleString()}
            </span>
          </div>
          
          {coupon.deal.originalPrice && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-charcoal-600">Original Price:</span>
              <span className="text-sm text-charcoal-500 line-through">
                R{parseFloat(coupon.deal.originalPrice).toLocaleString()}
              </span>
            </div>
          )}
          
          {coupon.deal.discount && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-charcoal-600">Discount:</span>
              <span className="text-sm font-medium text-red-600">
                {coupon.deal.discount}% OFF
              </span>
            </div>
          )}
        </div>

        <div className="border-t pt-3 space-y-2">
          <div className="flex items-center gap-2 text-sm text-charcoal-600">
            <Calendar className="h-4 w-4" />
            <span>Downloaded: {formatDate(coupon.downloadedAt)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-charcoal-600">
            <AlertCircle className="h-4 w-4" />
            <span>Expires: {formatDate(coupon.expiresAt)}</span>
          </div>
          
          {coupon.redeemedAt && (
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <CheckCircle className="h-4 w-4" />
              <span>Redeemed: {formatDate(coupon.redeemedAt)}</span>
            </div>
          )}
        </div>

        {coupon.deal.description && (
          <div className="border-t pt-3">
            <p className="text-sm text-charcoal-600 line-clamp-3">
              {coupon.deal.description}
            </p>
          </div>
        )}
        
        {coupon.redemptionNotes && (
          <div className="border-t pt-3">
            <p className="text-sm font-medium text-charcoal-700">Redemption Notes:</p>
            <p className="text-sm text-charcoal-600 mt-1">
              {coupon.redemptionNotes}
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-3">
        <Button
          onClick={() => onDownload?.(coupon)}
          disabled={isRedeemed || isExpired}
          className="w-full bg-olive-600 hover:bg-olive-700 text-white disabled:bg-gray-400"
          data-testid={`button-download-coupon-${coupon.id}`}
        >
          <Download className="h-4 w-4 mr-2" />
          {isRedeemed ? "Already Redeemed" : isExpired ? "Expired" : "Download Coupon"}
        </Button>
      </CardFooter>
    </Card>
  );
}