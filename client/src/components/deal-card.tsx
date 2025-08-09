import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Building, Clock, Percent, Package, MessageSquare, UserPlus, Lock, Shield, Ticket } from "lucide-react";
import { Deal } from "@shared/schema";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";

// Define extended deal type with supplier info
type DealWithSupplier = Deal & {
  supplier: {
    id: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    email?: string;
    isVerified?: boolean;
  };
};

interface DealCardProps {
  deal: DealWithSupplier;
  variant?: "hot" | "regular";
}

export default function DealCard({ deal, variant = "regular" }: DealCardProps) {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState("");

  const createInquiryMutation = useMutation({
    mutationFn: async (data: { dealId: string; supplierId: string; message?: string }) => {
      await apiRequest("POST", "/api/inquiries", data);
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Sent",
        description: "Your inquiry has been sent to the supplier.",
      });
      setShowInquiryForm(false);
      setInquiryMessage("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to send inquiry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createCouponMutation = useMutation({
    mutationFn: async (data: { dealId: string; supplierId: string }) => {
      return await apiRequest("POST", "/api/coupons", data);
    },
    onSuccess: (response: any) => {
      toast({
        title: "Coupon Generated!",
        description: `Your coupon code is: ${response.couponCode}`,
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to generate coupon. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return `R${num.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getTimeLeft = () => {
    if (!deal.expiresAt) return "";
    const now = new Date().getTime();
    const expires = new Date(deal.expiresAt).getTime();
    const diff = expires - now;

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const handleInquiry = () => {
    if (!isAuthenticated) {
      window.location.href = '/register-buyer';
      return;
    }
    setShowInquiryForm(true);
  };

  const handleGetCoupon = () => {
    if (!isAuthenticated) {
      window.location.href = '/register-buyer';
      return;
    }
    createCouponMutation.mutate({ dealId: deal.id, supplierId: deal.supplierId });
  };

  const handleViewDetails = () => {
    // Allow everyone to view deal details - no authentication required
    setShowDetails(true);
  };

  const submitInquiry = () => {
    createInquiryMutation.mutate({
      dealId: deal.id,
      supplierId: deal.supplierId,
      message: inquiryMessage,
    });
  };

  const cardClass = variant === "hot" ? "border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50" : "border-gray-200";

  return (
    <Card className={`hover:shadow-xl transition-all duration-300 ${cardClass} flex flex-col h-full`}>
      <div className="relative">
        {deal.imageUrl && (
          <img
            src={deal.imageUrl}
            alt={deal.title}
            className="w-full h-32 object-cover rounded-t-xl"
            data-testid="img-deal"
          />
        )}
        <div className="absolute top-4 left-4">
          <Badge className="bg-accent text-accent-foreground" data-testid="badge-hot">
            HOT
          </Badge>
        </div>
        {deal.expiresAt && (
          <div className="absolute top-4 right-4">
            <Badge variant="destructive" data-testid="badge-expires">
              <Clock className="h-3 w-3 mr-1" />
              {getTimeLeft()}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground" data-testid="text-category">
            {deal.category}
          </span>
          {deal.discount && (
            <Badge className="text-success bg-success/10" data-testid="badge-discount">
              <Percent className="h-3 w-3 mr-1" />
              {deal.discount}%
            </Badge>
          )}
        </div>
        
        <h4 className="text-base font-semibold text-slate-900 mb-1" data-testid="text-title">
          {deal.title}
        </h4>
        
        <p className="text-muted-foreground text-sm mb-3" data-testid="text-description">
          {deal.description}
        </p>

        <div className="mb-3">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xl font-bold text-primary" data-testid="text-price">
              {formatPrice(deal.price)}
            </span>
            {deal.originalPrice && (
              <span className="text-muted-foreground line-through text-sm" data-testid="text-original-price">
                {formatPrice(deal.originalPrice)}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground" data-testid="text-min-order">
            Min. order: {deal.minOrder} unit{deal.minOrder !== 1 ? "s" : ""}
          </span>
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground mb-3">
          <Building className="h-3 w-3 mr-1" />
          <span data-testid="text-supplier">{deal.supplier.companyName || deal.supplier.firstName}</span>
          {deal.supplier.isVerified && (
            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700 border-green-200 text-xs px-1 py-0">
              <Shield className="h-2 w-2 mr-1" />
              Verified
            </Badge>
          )}
        </div>
        
        {!showInquiryForm ? (
          <div className="space-y-2 mt-auto">
            {isAuthenticated ? (
              <>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-10 flex items-center justify-center"
                  onClick={handleGetCoupon}
                  disabled={createCouponMutation.isPending}
                  data-testid="button-take-offer"
                >
                  <Ticket className="h-4 w-4 mr-2" />
                  {createCouponMutation.isPending ? "Generating Coupon..." : "Take This Offer"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-olive-600 text-olive-600 hover:bg-olive-50 h-10 flex items-center justify-center"
                  onClick={handleViewDetails}
                  data-testid="button-view-details"
                >
                  View Details
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-10 flex items-center justify-center"
                  onClick={() => window.location.href = '/register-buyer'}
                  data-testid="button-register-for-offer"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register to Take Offer
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-olive-600 text-olive-600 hover:bg-olive-50 h-10 flex items-center justify-center"
                  onClick={handleViewDetails}
                  data-testid="button-view-details"
                >
                  View Details
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              className="w-full p-3 border border-input rounded-md resize-none"
              placeholder="Add a message to your inquiry (optional)"
              value={inquiryMessage}
              onChange={(e) => setInquiryMessage(e.target.value)}
              rows={3}
              data-testid="textarea-inquiry-message"
            />
            <div className="flex space-x-2">
              <Button
                onClick={submitInquiry}
                disabled={createInquiryMutation.isPending}
                className="flex-1"
                data-testid="button-send-inquiry"
              >
                {createInquiryMutation.isPending ? "Sending..." : "Send Inquiry"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowInquiryForm(false)}
                data-testid="button-cancel-inquiry"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* ABSOLUTE POSITIONED TWO-COLUMN DIALOG */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent 
          className="p-0 border-0 bg-white"
          style={{ 
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '1200px',
            maxWidth: '90vw',
            height: '80vh',
            maxHeight: '800px',
            borderRadius: '8px',
            boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
            zIndex: 9999
          }}
        >
          {/* Header */}
          <div style={{ 
            padding: '24px', 
            borderBottom: '1px solid #e5e7eb',
            background: '#f9fafb'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              margin: 0,
              color: '#111827'
            }}>
              <Package style={{ width: '20px', height: '20px' }} />
              Deal Details: {deal.title}
            </h2>
          </div>
          
          {/* TWO COLUMNS WITH ABSOLUTE POSITIONING */}
          <div style={{ 
            position: 'relative',
            height: 'calc(100% - 80px)',
            overflow: 'hidden'
          }}>
            {/* LEFT COLUMN */}
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '50%',
              height: '100%',
              padding: '24px',
              borderRight: '1px solid #e5e7eb',
              overflowY: 'auto',
              background: 'white'
            }}>
              {deal.imageUrl && (
                <img 
                  src={deal.imageUrl} 
                  alt={deal.title}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}
                />
              )}
              
              <div style={{
                background: '#f9fafb',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '8px' }}>Description</h3>
                <p style={{ color: '#374151' }}>{deal.description}</p>
              </div>

              <div style={{
                background: '#f0fdf4',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>Price</p>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>{formatPrice(deal.price)}</p>
                    {deal.originalPrice && (
                      <p style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'line-through' }}>{formatPrice(deal.originalPrice)}</p>
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>Min Order</p>
                    <p style={{ fontSize: '18px', fontWeight: '600' }}>{deal.minOrder} units</p>
                  </div>
                </div>
              </div>

              {deal.expiresAt && (
                <div style={{
                  background: '#fef2f2',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #fecaca'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock style={{ width: '16px', height: '16px', color: '#dc2626' }} />
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#b91c1c' }}>
                      Deal expires: {getTimeLeft()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div style={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: '50%',
              height: '100%',
              padding: '24px',
              overflowY: 'auto',
              background: 'white'
            }}>
              <div style={{
                background: '#eff6ff',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <h3 style={{ 
                  fontWeight: '600', 
                  fontSize: '18px', 
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Building style={{ width: '20px', height: '20px' }} />
                  Supplier Information
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <p style={{ fontWeight: '500' }}>{deal.supplier.firstName} {deal.supplier.lastName}</p>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{deal.supplier.email}</p>
                  {deal.supplier.isVerified && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: '#dcfce7',
                      color: '#166534',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      width: 'fit-content'
                    }}>
                      <Shield style={{ width: '12px', height: '12px' }} />
                      Verified Supplier
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Button
                  onClick={() => {
                    setShowDetails(false);
                    handleInquiry();
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  style={{ height: '48px' }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Inquiry
                </Button>
                
                <Button
                  onClick={() => {
                    setShowDetails(false);
                    handleGetCoupon();
                  }}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={createCouponMutation.isPending}
                  style={{ height: '48px' }}
                >
                  <Ticket className="h-4 w-4 mr-2" />
                  {createCouponMutation.isPending ? "Generating..." : "Get Coupon"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}