import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Star, Clock, Percent } from "lucide-react";
import { DealWithSupplier } from "@shared/schema";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";

interface DealCardProps {
  deal: DealWithSupplier;
  variant?: "hot" | "regular";
}

export default function DealCard({ deal, variant = "regular" }: DealCardProps) {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [showInquiryForm, setShowInquiryForm] = useState(false);
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

  const handleInquiry = () => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    setShowInquiryForm(true);
  };

  const submitInquiry = () => {
    createInquiryMutation.mutate({
      dealId: deal.id,
      supplierId: deal.supplierId,
      message: inquiryMessage,
    });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(parseFloat(price));
  };

  const getTimeLeft = () => {
    if (!deal.expiresAt) return null;
    const now = new Date();
    const expires = new Date(deal.expiresAt);
    const diff = expires.getTime() - now.getTime();
    
    if (diff <= 0) return "Expired";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} left`;
    return "Less than 1 hour left";
  };

  const cardClass = variant === "hot" ? "deal-card-hot" : "deal-card-regular";

  if (variant === "regular") {
    return (
      <Card className={`hover:shadow-lg transition-all duration-300 ${cardClass} relative`}>
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold z-10">
          REGULAR
        </div>
        {deal.imageUrl && (
          <img
            src={deal.imageUrl}
            alt={deal.title}
            className="w-full h-32 object-cover rounded-t-lg"
            data-testid="img-deal"
          />
        )}
        <CardContent className="p-4">
          <span className="text-xs text-muted-foreground" data-testid="text-category">
            {deal.category}
          </span>
          <h4 className="font-semibold text-slate-900 mb-2 text-sm" data-testid="text-title">
            {deal.title}
          </h4>
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-primary" data-testid="text-price">
              {formatPrice(deal.price)}
            </span>
            {deal.discount && (
              <Badge variant="secondary" className="text-success" data-testid="badge-discount">
                -{deal.discount}%
              </Badge>
            )}
          </div>
          <div className="flex items-center text-xs text-muted-foreground mb-3">
            <Building className="h-3 w-3 mr-1" />
            <span data-testid="text-supplier">{deal.supplier.companyName || deal.supplier.firstName}</span>
          </div>
          <Button
            className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
            size="sm"
            onClick={handleInquiry}
            data-testid="button-view-details"
          >
            View Details
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`hover:shadow-xl transition-all duration-300 ${cardClass}`}>
      <div className="relative">
        {deal.imageUrl && (
          <img
            src={deal.imageUrl}
            alt={deal.title}
            className="w-full h-48 object-cover rounded-t-xl"
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
      <CardContent className="p-6">
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
        <h4 className="text-lg font-semibold text-slate-900 mb-2" data-testid="text-title">
          {deal.title}
        </h4>
        <p className="text-muted-foreground text-sm mb-4" data-testid="text-description">
          {deal.description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-primary" data-testid="text-price">
              {formatPrice(deal.price)}
            </span>
            {deal.originalPrice && (
              <span className="text-muted-foreground line-through ml-2" data-testid="text-original-price">
                {formatPrice(deal.originalPrice)}
              </span>
            )}
          </div>
          <span className="text-sm text-muted-foreground" data-testid="text-min-order">
            Min. order: {deal.minOrder} unit{deal.minOrder !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Building className="h-4 w-4 mr-2" />
            <span data-testid="text-supplier">{deal.supplier.companyName || deal.supplier.firstName}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span data-testid="text-rating">4.8</span>
          </div>
        </div>
        
        {!showInquiryForm ? (
          <Button
            className="w-full"
            onClick={handleInquiry}
            disabled={createInquiryMutation.isPending}
            data-testid="button-request-quote"
          >
            Request Quote
          </Button>
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
    </Card>
  );
}
