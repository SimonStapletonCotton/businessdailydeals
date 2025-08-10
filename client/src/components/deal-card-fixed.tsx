import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Clock, Percent, Package, MessageSquare, UserPlus, Lock, Shield, Ticket } from "lucide-react";
import { Deal } from "@shared/schema";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  variant?: "hot" | "regular" | "compact";
}

export default function DealCard({ deal, variant = "regular" }: DealCardProps) {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [showCompactModal, setShowCompactModal] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState("");

  const createCouponMutation = useMutation({
    mutationFn: async (data: { dealId: string; supplierId: string }) => {
      console.log("Creating coupon for deal:", data);
      console.log("Authentication state before API call:", isAuthenticated);
      
      try {
        const response = await apiRequest("POST", "/api/coupons", data);
        console.log("Coupon API response object:", response);
        const responseData = await response.json();
        console.log("Coupon response data:", responseData);
        return responseData;
      } catch (error: any) {
        console.error("API request error:", error);
        console.log("Error status:", error?.status);
        console.log("Error message:", error?.message);
        
        // Parse error response if possible
        if (error?.message?.includes(':')) {
          const [status, message] = error.message.split(': ', 2);
          error.status = parseInt(status);
          error.parsedMessage = message;
        }
        
        throw error;
      }
    },
    onSuccess: (response: any) => {
      console.log("Coupon creation successful:", response);
      const couponCode = response.couponCode || "Unknown";
      const expiresAt = response.expiresAt || response.validUntil;
      
      toast({
        title: "Coupon Generated Successfully!",
        description: `Your coupon code: ${couponCode}. Valid until ${expiresAt ? new Date(expiresAt).toLocaleDateString() : 'N/A'}. Visit "My Coupons" to view all your coupons.`,
      });
      setShowCompactModal(false);
      
      // Show navigation hint after a short delay
      setTimeout(() => {
        const viewCoupons = confirm("Would you like to view all your coupons now?");
        if (viewCoupons) {
          window.location.href = "/my-coupons";
        }
      }, 3000);
      
      // Invalidate coupons cache
      queryClient.invalidateQueries({ queryKey: ["/api/buyer/coupons"] });
    },
    onError: (error: any) => {
      console.error("Coupon generation failed:", error);
      console.log("Error details:", {
        status: error?.status,
        message: error?.message,
        response: error?.response,
      });
      
      // Check for authentication errors
      const isAuthError = error?.status === 401 || 
                         error?.message?.includes('401') || 
                         error?.message?.includes('Unauthorized') || 
                         isUnauthorizedError(error);
                         
      if (isAuthError) {
        toast({
          title: "Login Required",
          description: "Please log in to generate a coupon",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1000);
        return;
      }
      
      if (error?.status === 404) {
        toast({
          title: "Deal Not Found",
          description: "This deal is no longer available",
          variant: "destructive",
        });
        return;
      }
      
      // More specific error handling
      const errorMessage = error?.message || error?.error || "Failed to generate coupon. Please try again.";
      toast({
        title: "Coupon Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

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
      // Invalidate inquiries cache
      queryClient.invalidateQueries({ queryKey: ["/api/inquiries"] });
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

  // Compact badge-style layout for grid displays
  if (variant === "compact") {
    return (
      <>
        <Card className="hover:shadow-lg transition-shadow border-2 border-red-200 hover:border-red-300 h-fit">
          <CardContent className="p-4">
            {deal.imageUrl && (
              <img 
                src={deal.imageUrl} 
                alt={deal.title}
                className="w-full h-32 object-cover rounded mb-3"
              />
            )}
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-red-600 text-white text-xs">HOT DEAL</Badge>
              {deal.discount && deal.discount > 0 && (
                <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                  {deal.discount}% OFF
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-slate-900 mb-2 text-sm line-clamp-2">{deal.title}</h3>
            <p className="text-xs text-slate-600 mb-3 line-clamp-2">{deal.description}</p>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-lg font-bold text-slate-900">R{parseFloat(deal.price).toLocaleString()}</span>
                {deal.originalPrice && parseFloat(deal.originalPrice) > parseFloat(deal.price) && (
                  <span className="text-sm text-slate-700 line-through ml-2 font-medium">R{parseFloat(deal.originalPrice).toLocaleString()}</span>
                )}
              </div>
            </div>
            <div className="text-xs text-slate-500 mb-3">
              Min. order: {deal.minOrder} unit{deal.minOrder !== 1 ? "s" : ""}
            </div>
            <Button
              size="sm" 
              className="w-full bg-red-600 hover:bg-red-700 text-white text-xs h-8"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("COMPACT: Opening deal modal for:", deal.id);
                setShowCompactModal(true);
              }}
            >
              View Deal
            </Button>
          </CardContent>
        </Card>

        {/* Compact Deal Modal */}
        {showCompactModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setShowCompactModal(false)}
            />
            <div 
              className="relative bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-slate-900">{deal.title}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCompactModal(false)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  ×
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Deal Info */}
                <div>
                  {deal.imageUrl && (
                    <img 
                      src={deal.imageUrl} 
                      alt={deal.title}
                      className="w-full h-48 object-cover rounded mb-4"
                    />
                  )}
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Description</h3>
                      <p className="text-slate-600">{deal.description}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Category</h3>
                      <p className="text-slate-600">{deal.category}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Pricing & Actions */}
                <div>
                  <div className="bg-slate-50 p-4 rounded-lg mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-red-600 text-white">HOT DEAL</Badge>
                      {deal.discount && deal.discount > 0 && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {deal.discount}% OFF
                        </Badge>
                      )}
                    </div>
                    <div className="mb-3">
                      <span className="text-3xl font-bold text-slate-900">R{parseFloat(deal.price).toLocaleString()}</span>
                      {deal.originalPrice && parseFloat(deal.originalPrice) > parseFloat(deal.price) && (
                        <span className="text-xl text-slate-700 line-through ml-2 font-medium">R{parseFloat(deal.originalPrice).toLocaleString()}</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">
                      Min. order: {deal.minOrder} unit{deal.minOrder !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold text-slate-900 mb-2">Supplier Information</h3>
                    <p className="text-slate-600">{deal.supplier.companyName || deal.supplier.firstName}</p>
                    {deal.supplier.isVerified && (
                      <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700 border-green-200">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified Supplier
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => {
                        console.log("Button clicked! Authentication state:", isAuthenticated);
                        console.log("Deal data:", { dealId: deal.id, supplierId: deal.supplierId });
                        
                        if (!isAuthenticated) {
                          console.log("Not authenticated, redirecting to login");
                          window.location.href = '/api/login';
                          return;
                        }
                        
                        console.log("Attempting to create coupon...");
                        
                        // Direct API call for coupon generation
                        console.log("Calling mutation with:", { dealId: deal.id, supplierId: deal.supplierId });
                        createCouponMutation.mutate({ dealId: deal.id, supplierId: deal.supplierId });
                      }}
                      disabled={createCouponMutation.isPending}
                    >
                      <Ticket className="h-4 w-4 mr-2" />
                      {createCouponMutation.isPending ? "Generating Coupon..." : 
                       isAuthenticated ? "Get Coupon Code" : "Login to Get Coupon"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowCompactModal(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Regular deal card layout for detailed views
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

  const submitInquiry = () => {
    createInquiryMutation.mutate({
      dealId: deal.id,
      supplierId: deal.supplierId,
      message: inquiryMessage,
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow border-2 border-slate-200 hover:border-slate-300">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Image */}
          <div className="lg:col-span-1">
            {deal.imageUrl ? (
              <img 
                src={deal.imageUrl} 
                alt={deal.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-48 bg-slate-100 rounded-lg flex items-center justify-center">
                <Package className="h-12 w-12 text-slate-400" />
              </div>
            )}
          </div>

          {/* Middle Column - Deal Details */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              {variant === "hot" && (
                <Badge className="bg-red-600 text-white">HOT DEAL</Badge>
              )}
              {deal.discount && deal.discount > 0 && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <Percent className="h-3 w-3 mr-1" />
                  {deal.discount}% OFF
                </Badge>
              )}
              {deal.supplier.isVerified && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">{deal.title}</h3>
            <p className="text-slate-600 mb-4">{deal.description}</p>

            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>{deal.supplier.companyName || `${deal.supplier.firstName} ${deal.supplier.lastName}`}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>Category: {deal.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Min. order: {deal.minOrder} unit{deal.minOrder !== 1 ? 's' : ''}</span>
              </div>
              {deal.expiresAt && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Expires: {getTimeLeft()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Pricing & Actions */}
          <div className="lg:col-span-1">
            <div className="bg-slate-50 p-4 rounded-lg mb-4">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-slate-900">
                  {formatPrice(deal.price)}
                </div>
                {deal.originalPrice && parseFloat(deal.originalPrice) > parseFloat(deal.price) && (
                  <div className="text-xl text-slate-700 line-through font-medium">
                    {formatPrice(deal.originalPrice)}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={handleGetCoupon}
                disabled={createCouponMutation.isPending}
              >
                <Ticket className="h-4 w-4 mr-2" />
                {createCouponMutation.isPending ? "Generating..." : "Get Coupon"}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleInquiry}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Inquiry
              </Button>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setShowDetails(true)}
              >
                View Full Details
              </Button>
            </div>
          </div>
        </div>

        {/* Inquiry Form Modal */}
        {showInquiryForm && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setShowInquiryForm(false)}
            />
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 z-51 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Send Inquiry</h3>
              <textarea
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                placeholder="Enter your message to the supplier..."
                className="w-full h-32 p-3 border border-slate-300 rounded-lg resize-none"
              />
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={submitInquiry}
                  disabled={createInquiryMutation.isPending || !inquiryMessage.trim()}
                  className="flex-1"
                >
                  {createInquiryMutation.isPending ? "Sending..." : "Send"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowInquiryForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Details Modal */}
        {showDetails && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setShowDetails(false)}
            />
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 z-51 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-slate-900">Deal Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Full Description</h3>
                  <p className="text-slate-600">{deal.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-slate-900">Category</h4>
                    <p className="text-slate-600">{deal.category}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Minimum Order</h4>
                    <p className="text-slate-600">{deal.minOrder} unit{deal.minOrder !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-900">Supplier</h4>
                  <p className="text-slate-600">{deal.supplier.companyName || `${deal.supplier.firstName} ${deal.supplier.lastName}`}</p>
                  <p className="text-sm text-slate-500">{deal.supplier.email}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}