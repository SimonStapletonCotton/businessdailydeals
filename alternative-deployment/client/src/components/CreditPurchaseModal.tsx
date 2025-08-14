import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Coins, Shield, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface CreditPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CREDIT_PACKAGES = [
  {
    id: 'starter',
    name: 'Starter Package',
    credits: 100,
    price: 250,
    description: 'Perfect for testing the platform'
  },
  {
    id: 'business',
    name: 'Business Package',
    credits: 550,
    price: 1000,
    bonus: 50,
    description: 'Most popular choice for active suppliers',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise Package',
    credits: 1200,
    price: 1800,
    bonus: 200,
    description: 'For high-volume deal posting'
  },
  {
    id: 'premium',
    name: 'Premium Package',
    credits: 2500,
    price: 3200,
    bonus: 500,
    description: 'Maximum value for power users'
  }
];

export function CreditPurchaseModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: CreditPurchaseModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>('business');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'package' | 'custom'>('package');
  const { toast } = useToast();

  const handlePurchase = async () => {
    setIsProcessing(true);
    
    try {
      const purchaseData = paymentMode === 'package' 
        ? { packageId: selectedPackage }
        : { customAmount: parseFloat(customAmount) };

      const response = await apiRequest('POST', '/api/credits/purchase', purchaseData);
      const data = await response.json();

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
        description: `Complete your payment to receive ${data.credits} credits`,
      });
      
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error purchasing credits:', error);
      toast({
        title: "Purchase Failed",
        description: "Unable to process credit purchase. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsProcessing(false);
  };

  const selectedPkg = CREDIT_PACKAGES.find(pkg => pkg.id === selectedPackage);
  const customCredits = customAmount ? Math.floor(parseFloat(customAmount) / 2.5) : 0;
  const isValid = paymentMode === 'package' 
    ? selectedPackage 
    : (customAmount && parseFloat(customAmount) >= 50);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-orange-500" />
            Purchase Credits
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Mode Selection */}
          <div className="flex gap-4">
            <Button
              variant={paymentMode === 'package' ? 'default' : 'outline'}
              onClick={() => setPaymentMode('package')}
              className="flex-1"
            >
              Credit Packages
            </Button>
            <Button
              variant={paymentMode === 'custom' ? 'default' : 'outline'}
              onClick={() => setPaymentMode('custom')}
              className="flex-1"
            >
              Custom Amount
            </Button>
          </div>

          {paymentMode === 'package' ? (
            /* Package Selection */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CREDIT_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPackage === pkg.id
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  {pkg.popular && (
                    <Badge className="absolute -top-2 -right-2 bg-orange-600 hover:bg-orange-700">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {pkg.name}
                    </h3>
                    <div className="text-2xl font-bold text-orange-600">
                      R{pkg.price}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-medium">{pkg.credits} Credits</span>
                      {pkg.bonus && (
                        <span className="text-green-600 ml-2">
                          (+{pkg.bonus} bonus!)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      {pkg.description}
                    </p>
                    <div className="text-xs text-slate-400">
                      R{(pkg.price / pkg.credits).toFixed(2)} per credit
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Custom Amount */
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customAmount">Custom Amount (Minimum R50)</Label>
                <Input
                  id="customAmount"
                  type="number"
                  min="50"
                  step="0.01"
                  placeholder="Enter amount in Rand"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                />
                {customAmount && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    You'll receive <strong>{customCredits} credits</strong> (R2.50 per credit)
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800 dark:text-blue-200">
                Secure Payment via PayFast
              </span>
            </div>
            
            {isValid && (
              <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-bold">
                    R{paymentMode === 'package' ? selectedPkg?.price : customAmount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Credits:</span>
                  <span className="font-bold">
                    {paymentMode === 'package' ? selectedPkg?.credits : customCredits}
                  </span>
                </div>
                <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1">
                      <CreditCard className="w-3 h-3" />
                      Visa/Mastercard
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      SSL Secured
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
              disabled={!isValid || isProcessing}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isProcessing ? (
                "Processing..."
              ) : (
                `Pay R${paymentMode === 'package' ? selectedPkg?.price || 0 : customAmount || 0}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}