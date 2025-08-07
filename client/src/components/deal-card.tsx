import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building, Star, Clock, Percent, Download, Package, Ruler, Box, MessageSquare, X, FileText, Hash } from "lucide-react";
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
    onSuccess: (coupon) => {
      toast({
        title: "Coupon Created",
        description: "Your coupon has been generated successfully! You can download it from your coupons page.",
      });
      // Generate and download PDF coupon
      generateCouponPDF(coupon);
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

  const generateCouponPDF = (coupon: any) => {
    // Create a simple HTML coupon that can be printed or saved as PDF
    const couponHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Business Daily Deals Coupon</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .coupon { border: 3px dashed #6B7280; padding: 30px; margin: 20px 0; background: #F9FAFB; }
            .header { text-align: center; color: #059669; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
            .code { background: #374151; color: white; padding: 10px; font-family: monospace; font-size: 18px; text-align: center; margin: 20px 0; }
            .details { margin: 15px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6B7280; }
            .deal-title { font-size: 20px; font-weight: bold; color: #111827; margin-bottom: 10px; }
            .price { font-size: 24px; color: #059669; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="coupon">
            <div class="header">🎫 BUSINESS DAILY DEALS COUPON</div>
            <div class="deal-title">${deal.title}</div>
            <div class="details">
              <p><strong>Deal Price:</strong> <span class="price">R${parseFloat(deal.price).toLocaleString()}</span></p>
              ${deal.originalPrice ? `<p><strong>Original Price:</strong> R${parseFloat(deal.originalPrice).toLocaleString()}</p>` : ''}
              ${deal.discount ? `<p><strong>Discount:</strong> ${deal.discount}% OFF</p>` : ''}
              <p><strong>Supplier:</strong> ${deal.supplier.companyName || deal.supplier.firstName}</p>
              <p><strong>Category:</strong> ${deal.category}</p>
              <p><strong>Min Order:</strong> ${deal.minOrder} unit${deal.minOrder !== 1 ? 's' : ''}</p>
              ${deal.size ? `<p><strong>Size:</strong> ${deal.size}</p>` : ''}
              ${deal.quantityAvailable ? `<p><strong>Available Qty:</strong> ${deal.quantityAvailable} units</p>` : ''}
            </div>
            <div class="code">Coupon Code: ${coupon.couponCode}</div>
            <div class="details">
              <p><strong>Valid Until:</strong> ${new Date(coupon.expiresAt).toLocaleDateString('en-ZA')}</p>
              <p><strong>Description:</strong> ${deal.description}</p>
              ${deal.productSpecifications ? `<p><strong>Specifications:</strong> ${deal.productSpecifications}</p>` : ''}
            </div>
            <div class="footer">
              <p>Present this coupon to the supplier to redeem this offer</p>
              <p>www.businessdailydeals.com.za</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Open coupon in new window for printing/saving
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(couponHTML);
      newWindow.document.close();
    }
  };

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
          </div>
          <Button
            className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
            size="sm"
            onClick={handleViewDetails}
            data-testid="button-view-details"
          >
            View Details
          </Button>
        </CardContent>

        {/* Details Dialog */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {deal.title}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Deal Images */}
              {deal.productImages && deal.productImages.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Product Images
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {deal.productImages.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${deal.title} - Image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                  <p className="text-sm">{deal.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Price</Label>
                  <p className="text-lg font-bold text-primary">{formatPrice(deal.price)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Minimum Order</Label>
                  <p className="text-sm">{deal.minOrder} unit{deal.minOrder !== 1 ? 's' : ''}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Supplier</Label>
                  <p className="text-sm">{deal.supplier.companyName || deal.supplier.firstName}</p>
                </div>
              </div>

              {/* Product Details */}
              {(deal.size || deal.quantityAvailable) && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Box className="h-4 w-4" />
                    Product Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {deal.size && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                          <Ruler className="h-3 w-3" />
                          Size
                        </Label>
                        <p className="text-sm">{deal.size}</p>
                      </div>
                    )}
                    {deal.quantityAvailable && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                          <Hash className="h-3 w-3" />
                          Available Quantity
                        </Label>
                        <p className="text-sm">{deal.quantityAvailable} units</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <p className="text-sm mt-1 leading-relaxed">{deal.description}</p>
              </div>

              {/* Product Specifications */}
              {deal.productSpecifications && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Product Specifications</Label>
                  <p className="text-sm mt-1 leading-relaxed bg-muted p-3 rounded">{deal.productSpecifications}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    setShowDetails(false);
                    handleInquiry();
                  }}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Inquiry
                </Button>
                <Button
                  onClick={() => {
                    setShowDetails(false);
                    handleGetCoupon();
                  }}
                  className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Get Coupon
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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

        {/* Product Images Gallery */}
        {deal.productImages && deal.productImages.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-olive-600" />
              <span className="text-sm font-medium text-charcoal-700">Product Images</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {deal.productImages.slice(0, 4).map((image, index) => (
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
          <div className="space-y-3">
            <Button
              className="w-full bg-olive-600 hover:bg-olive-700 text-white"
              onClick={handleGetCoupon}
              disabled={createCouponMutation.isPending}
              data-testid="button-get-coupon"
            >
              <Download className="h-4 w-4 mr-2" />
              {createCouponMutation.isPending ? "Creating Coupon..." : "Get Coupon"}
            </Button>
            <Button
              variant="outline"
              className="w-full border-olive-600 text-olive-600 hover:bg-olive-50"
              onClick={handleInquiry}
              disabled={createInquiryMutation.isPending}
              data-testid="button-request-quote"
            >
              Request Quote
            </Button>
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
