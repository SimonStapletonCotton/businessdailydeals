import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building, Star, Clock, Percent, Download, Package, Ruler, Box, MessageSquare, X, FileText, Hash, UserPlus, Lock, Shield, Ticket } from "lucide-react";
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
    onSuccess: (response) => {
      if (response.redirectUrl) {
        window.location.href = response.redirectUrl;
      } else {
        toast({
          title: "Coupon Generated",
          description: "Your deal acceptance coupon has been created successfully.",
        });
      }
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
        description: "Failed to create coupon. Please try again.",
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

  const handleViewDetails = () => {
    setShowDetails(true);
  };

  const handleGetCoupon = () => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    createCouponMutation.mutate({
      dealId: deal.id,
      supplierId: deal.supplierId,
    });
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
            {deal.supplier.isVerified && (
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700 border-green-200 text-xs px-1 py-0">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          {isAuthenticated ? (
            <Button
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 flex items-center justify-center"
              onClick={handleViewDetails}
              data-testid="button-view-details"
            >
              View Details
            </Button>
          ) : (
            <Button
              className="w-full bg-primary text-white hover:bg-primary/90 h-10 flex items-center justify-center"
              onClick={() => window.location.href = '/register-buyer'}
              data-testid="button-register-to-view"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Register to View
            </Button>
          )}
        </CardContent>

        {/* Details Dialog */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
            <DialogHeader className="pb-3 border-b">
              <DialogTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5" />
                {deal.title}
              </DialogTitle>
            </DialogHeader>
            
            {/* Compact Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-3">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-4">
                {/* Deal Info Card */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Category:</span>
                      <p className="font-medium">{deal.category}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Price:</span>
                      <p className="text-xl font-bold text-primary">{formatPrice(deal.price)}</p>
                      {deal.originalPrice && parseFloat(deal.originalPrice) > parseFloat(deal.price) && (
                        <p className="text-xs text-gray-500 line-through">{formatPrice(deal.originalPrice)}</p>
                      )}
                    </div>
                    <div>
                      <span className="text-gray-600">Min Order:</span>
                      <p className="font-medium">{deal.minOrder} unit{deal.minOrder !== 1 ? 's' : ''}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Supplier:</span>
                      <div className="flex items-center gap-1">
                        <p className="font-medium text-xs">{deal.supplier.companyName || deal.supplier.firstName}</p>
                        {deal.supplier.isVerified && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 text-xs px-1 py-0">
                            <Shield className="h-3 w-3" />
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-sm">Description</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{deal.description}</p>
                </div>

                {/* Additional Details */}
                {(deal.size || deal.quantityAvailable || deal.productSpecifications) && (
                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                      <Box className="h-4 w-4" />
                      Product Details
                    </h4>
                    <div className="space-y-3 text-sm">
                      {deal.size && (
                        <div>
                          <span className="text-gray-600">Size:</span>
                          <span className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">{deal.size}</span>
                        </div>
                      )}
                      {deal.quantityAvailable && (
                        <div>
                          <span className="text-gray-600">Available:</span>
                          <span className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">{deal.quantityAvailable} units</span>
                        </div>
                      )}
                      {deal.productSpecifications && (
                        <div>
                          <span className="text-gray-600 block mb-1">Specifications:</span>
                          <div className="bg-gray-50 p-2 rounded text-xs text-gray-700">
                            {deal.productSpecifications}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Images & Actions */}
              <div className="space-y-4">
                {/* Product Images */}
                {deal.productImages && deal.productImages.length > 0 && (
                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Images
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {deal.productImages.slice(0, 4).map((image: string, index: number) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${deal.title} - ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                      ))}
                    </div>
                    {deal.productImages.length > 4 && (
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        +{deal.productImages.length - 4} more images
                      </p>
                    )}
                  </div>
                )}

                {/* Compact Action Buttons */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 text-sm">Actions</h4>
                  <div className="space-y-2">
                    <Button
                      onClick={() => {
                        setShowDetails(false);
                        handleInquiry();
                      }}
                      className="w-full bg-blue-600 text-white hover:bg-blue-700 h-9 text-sm"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Inquiry
                    </Button>
                    <Button
                      onClick={() => {
                        setShowDetails(false);
                        handleGetCoupon();
                      }}
                      className="w-full bg-green-600 text-white hover:bg-green-700 h-9 text-sm"
                    >
                      <Ticket className="h-4 w-4 mr-2" />
                      Get Coupon
                    </Button>
                  </div>
                </div>

                {/* Additional Info */}
                {(deal.shippingCost && parseFloat(deal.shippingCost) > 0) || deal.expiresAt ? (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm">Important Info</h4>
                    {deal.shippingCost && parseFloat(deal.shippingCost) > 0 && (
                      <p className="text-xs text-gray-700 mb-1">
                        <span className="font-medium">Shipping:</span> {formatPrice(deal.shippingCost)}
                      </p>
                    )}
                    {deal.expiresAt && (
                      <p className="text-xs text-red-600 font-medium">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {getTimeLeft()}
                      </p>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    );
  }

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

        {/* Product Images Gallery */}
        {deal.productImages && deal.productImages.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-olive-600" />
              <span className="text-sm font-medium text-charcoal-700">Product Images</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {deal.productImages.slice(0, 4).map((image: string, index: number) => (
                <img
                  key={index}
                  src={image}
                  alt={`${deal.title} - Image ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0 border border-charcoal-200"
                  data-testid={`img-product-${index}`}
                />
              ))}
              {deal.productImages.length > 4 && (
                <div className="w-16 h-16 bg-charcoal-100 rounded-lg flex-shrink-0 border border-charcoal-200 flex items-center justify-center text-xs text-charcoal-600">
                  +{deal.productImages.length - 4}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Product Details */}
        {(deal.size || deal.quantityAvailable || deal.productSpecifications) && (
          <div className="mb-4 p-3 bg-olive-50 rounded-lg border border-olive-200">
            {deal.size && (
              <div className="flex items-center gap-2 mb-2">
                <Ruler className="h-4 w-4 text-olive-600" />
                <span className="text-sm text-charcoal-700">
                  <span className="font-medium">Size:</span> {deal.size}
                </span>
              </div>
            )}
            {deal.quantityAvailable && (
              <div className="flex items-center gap-2 mb-2">
                <Box className="h-4 w-4 text-olive-600" />
                <span className="text-sm text-charcoal-700">
                  <span className="font-medium">Available:</span> {deal.quantityAvailable} units
                </span>
              </div>
            )}
            {deal.productSpecifications && (
              <div className="mt-2">
                <span className="text-sm font-medium text-charcoal-700">Specifications:</span>
                <p className="text-sm text-charcoal-600 mt-1 line-clamp-2">
                  {deal.productSpecifications}
                </p>
              </div>
            )}
          </div>
        )}
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
                  disabled={createInquiryMutation.isPending}
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
                  className="w-full border-primary text-primary hover:bg-primary/10 h-10 flex items-center justify-center"
                  onClick={() => window.location.href = '/register-buyer'}
                  data-testid="button-register-for-details"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Register to View Details
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
    </Card>
  );
}
