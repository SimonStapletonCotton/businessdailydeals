import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, AlertCircle, Search, MapPin, Clock, ShieldCheck, User } from 'lucide-react';
import { BackButton } from '@/components/back-button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface CouponValidation {
  valid: boolean;
  coupon?: {
    id: string;
    couponCode: string;
    purchasePrice: string;
    isRedeemed: boolean;
    redeemedAt: string | null;
    redemptionLocation: string | null;
    redemptionNotes: string | null;
    expiryDate: string | null;
    createdAt: string;
    deal: {
      title: string;
      description: string;
      price: string;
      originalPrice?: string;
      category: string;
    };
    buyer: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  message: string;
  canRedeem: boolean;
}

interface RedemptionHistory {
  id: string;
  attemptedAt: string;
  success: boolean;
  location?: string;
  notes?: string;
  failureReason?: string;
}

export default function CouponVerification() {
  const [couponCode, setCouponCode] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [validatedCode, setValidatedCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const { toast } = useToast();

  // Validate coupon
  const { data: validation, isLoading: isValidating, refetch: validateCoupon } = useQuery<CouponValidation>({
    queryKey: ['/api/coupons', validatedCode, 'validate'],
    enabled: !!validatedCode,
    retry: false,
  });

  // Get redemption history
  const { data: history = [] } = useQuery<RedemptionHistory[]>({
    queryKey: ['/api/coupons', validatedCode, 'history'],
    enabled: !!validatedCode && validation?.valid,
    retry: false,
  });

  const handleValidate = () => {
    if (!couponCode.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a coupon code",
        variant: "destructive",
      });
      return;
    }
    setValidatedCode(couponCode.trim().toUpperCase());
  };

  const handleRedeem = async () => {
    if (!validation?.canRedeem) {
      toast({
        title: "Redemption Error",
        description: "This coupon cannot be redeemed",
        variant: "destructive",
      });
      return;
    }

    setIsRedeeming(true);
    try {
      const response = await apiRequest('POST', `/api/coupons/${validatedCode}/redeem`, {
        location: location.trim(),
        notes: notes.trim()
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Coupon Redeemed Successfully!",
          description: result.message,
        });
        
        // Refresh validation and history
        validateCoupon();
        setLocation('');
        setNotes('');
      } else {
        toast({
          title: "Redemption Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Redemption error:', error);
      toast({
        title: "System Error",
        description: "Failed to process redemption. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: string) => {
    return `R${parseFloat(price).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-100 via-orange-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <BackButton />
        
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Coupon Verification System</h1>
          <p className="text-slate-600">Secure coupon validation and redemption for suppliers</p>
        </div>

        {/* Validation Input */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Validate Coupon
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="couponCode">Coupon Code</Label>
              <div className="flex gap-2">
                <Input
                  id="couponCode"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code (e.g., BDD-ABC123)"
                  className="flex-1"
                  data-testid="input-coupon-code"
                />
                <Button 
                  onClick={handleValidate}
                  disabled={isValidating}
                  data-testid="button-validate-coupon"
                >
                  {isValidating ? 'Validating...' : 'Validate'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Validation Results */}
        {validatedCode && (
          <Card className={`border-2 ${
            validation?.valid 
              ? validation?.canRedeem 
                ? 'border-green-300 bg-green-50' 
                : 'border-yellow-300 bg-yellow-50'
              : 'border-red-300 bg-red-50'
          }`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {validation?.valid ? (
                  validation?.canRedeem ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  )
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                Validation Result: {validatedCode}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant={validation?.canRedeem ? "default" : validation?.valid ? "secondary" : "destructive"}>
                    {validation?.canRedeem ? 'READY FOR REDEMPTION' : validation?.valid ? 'ALREADY PROCESSED' : 'INVALID COUPON'}
                  </Badge>
                </div>

                <p className="text-sm text-slate-700">{validation?.message}</p>

                {validation?.coupon && (
                  <div className="space-y-4">
                    <Separator />
                    
                    {/* Deal Information */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-800">Deal Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">{validation.coupon.deal.title}</p>
                          <p className="text-slate-600">{validation.coupon.deal.description}</p>
                          <p className="text-slate-600">Category: {validation.coupon.deal.category}</p>
                        </div>
                        <div className="space-y-1">
                          <p><strong>Deal Price:</strong> {formatPrice(validation.coupon.deal.price)}</p>
                          {validation.coupon.deal.originalPrice && (
                            <p><strong>Original Price:</strong> <span className="line-through">{formatPrice(validation.coupon.deal.originalPrice)}</span></p>
                          )}
                          <p><strong>Paid:</strong> {formatPrice(validation.coupon.purchasePrice)}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Buyer Information */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Buyer Information
                      </h4>
                      <div className="text-sm space-y-1">
                        <p><strong>Name:</strong> {validation.coupon.buyer.firstName} {validation.coupon.buyer.lastName}</p>
                        <p><strong>Email:</strong> {validation.coupon.buyer.email}</p>
                      </div>
                    </div>

                    <Separator />

                    {/* Coupon Status */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        Coupon Status
                      </h4>
                      <div className="text-sm space-y-1">
                        <p><strong>Generated:</strong> {formatDate(validation.coupon.createdAt)}</p>
                        {validation.coupon.expiryDate && (
                          <p><strong>Expires:</strong> {formatDate(validation.coupon.expiryDate)}</p>
                        )}
                        {validation.coupon.isRedeemed && (
                          <>
                            <p><strong>Redeemed:</strong> {formatDate(validation.coupon.redeemedAt!)}</p>
                            {validation.coupon.redemptionLocation && (
                              <p><strong>Location:</strong> {validation.coupon.redemptionLocation}</p>
                            )}
                            {validation.coupon.redemptionNotes && (
                              <p><strong>Notes:</strong> {validation.coupon.redemptionNotes}</p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Redemption Form */}
        {validation?.canRedeem && (
          <Card className="border-green-300">
            <CardHeader>
              <CardTitle className="text-green-700">Redeem Coupon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Redemption Location (Optional)</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Main Branch, Store #123, Cape Town"
                    data-testid="input-redemption-location"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Redemption Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional notes about this redemption..."
                  data-testid="textarea-redemption-notes"
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleRedeem}
                  disabled={isRedeeming}
                  className="bg-green-600 hover:bg-green-700"
                  data-testid="button-redeem-coupon"
                >
                  {isRedeeming ? 'Processing...' : 'Redeem Coupon'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Redemption History */}
        {history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Redemption History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {history.map((attempt) => (
                  <div 
                    key={attempt.id} 
                    className={`p-3 rounded border ${
                      attempt.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {attempt.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-medium">
                        {attempt.success ? 'Successfully Redeemed' : 'Redemption Failed'}
                      </span>
                      <Badge variant={attempt.success ? "default" : "destructive"} className="ml-auto">
                        {formatDate(attempt.attemptedAt)}
                      </Badge>
                    </div>
                    {attempt.location && <p className="text-sm text-slate-600">Location: {attempt.location}</p>}
                    {attempt.notes && <p className="text-sm text-slate-600">Notes: {attempt.notes}</p>}
                    {attempt.failureReason && <p className="text-sm text-red-600">Reason: {attempt.failureReason}</p>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Notice */}
        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-slate-700">
                <p className="font-medium mb-1">Security Notice</p>
                <p>Each coupon can only be redeemed once. All redemption attempts are logged and tracked for security purposes. 
                If you encounter any issues with coupon validation, please contact Business Daily Deals support.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}