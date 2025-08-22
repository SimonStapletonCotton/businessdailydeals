import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Banknote, Shield, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface CouponPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: {
    id: string;
    title: string;
    originalPrice: string;
    discountedPrice: string;
    companyName: string;
    category: string;
    expiresAt: Date;
  };
  onSuccess: (coupon: any) => void;
}

export function CouponPurchaseModal({ 
  isOpen, 
  onClose, 
  deal, 
  onSuccess 
}: CouponPurchaseModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Check if we're in promotional period (FREE until February 20, 2026)
  const now = new Date();
  const promotionalEndDate = new Date('2026-02-20T23:59:59Z');
  const isPromotionalPeriod = now <= promotionalEndDate;

  const handlePurchase = async () => {
    setIsProcessing(true);
    
    try {
      const response = await apiRequest('POST', '/api/coupons/purchase', {
        dealId: deal.id
      });

      const data = await response.json();

      if (data.promotional) {
        // FREE promotional coupon
        toast({
          title: "Coupon Generated Successfully!",
          description: `Your free coupon code: ${data.coupon.code}`,
        });
        onSuccess(data.coupon);
        onClose();
      } else {
        // Redirect to PayFast for payment
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.paymentUrl;
        form.target = '_blank';

        // Add all PayFast fields
        Object.keys(data.paymentData).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = data.paymentData[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);

        toast({
          title: "Redirecting to Payment",
          description: "Complete your payment to receive your coupon",
        });
        onClose();
      }
    } catch (error) {
      console.error('Error purchasing coupon:', error);
      toast({
        title: "Purchase Failed",
        description: "Unable to process coupon purchase. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsProcessing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-orange-500" />
            Purchase Coupon
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Deal Summary */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
              {deal.title}
            </h3>
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <p><strong>Company:</strong> {deal.companyName}</p>
              <p><strong>Category:</strong> {deal.category}</p>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 line-through">R{deal.originalPrice}</span>
                <span className="font-bold text-green-600">R{deal.discountedPrice}</span>
              </div>
              <p className="flex items-center gap-1 text-xs">
                <Clock className="w-3 h-3" />
                Valid until: {new Date(deal.expiresAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Payment Options */}
          <div className="space-y-4">
            {isPromotionalPeriod ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-600 hover:bg-green-700">FREE</Badge>
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    Promotional Period
                  </span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  All coupon purchases are FREE until February 20th, 2026!
                  Generate your coupon instantly at no cost.
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800 dark:text-blue-200">
                    Secure Card Payment
                  </span>
                </div>
                <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                  <p>Pay <strong>R{deal.discountedPrice}</strong> securely via PayFast</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1">
                      <CreditCard className="w-3 h-3" />
                      Visa/Mastercard
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      SSL Secured
                    </span>
                    <span className="flex items-center gap-1">
                      <Banknote className="w-3 h-3" />
                      SA Banking
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={isProcessing}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isProcessing ? (
                "Processing..."
              ) : isPromotionalPeriod ? (
                "Get FREE Coupon"
              ) : (
                `Pay R${deal.discountedPrice}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}