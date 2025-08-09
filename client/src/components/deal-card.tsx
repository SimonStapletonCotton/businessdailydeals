import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TestModal } from "./test-modal";
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
                  onClick={() => {
                    console.log("AUTH VIEW: Opening modal for deal:", deal.id);
                    setShowDetails(true);
                  }}
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
                  onClick={() => {
                    console.log("AUTH VIEW: Opening modal for deal:", deal.id);
                    setShowDetails(true);
                  }}
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

      {/* TEST MODAL */}
      <TestModal 
        isOpen={showDetails} 
        onClose={() => setShowDetails(false)} 
      />
    </Card>
  );
}