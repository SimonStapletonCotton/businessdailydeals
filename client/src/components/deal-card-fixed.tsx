import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  variant?: "hot" | "regular" | "compact";
}

export default function DealCard({ deal, variant = "regular" }: DealCardProps) {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [showCompactModal, setShowCompactModal] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState("");

  const createCouponMutation = useMutation({
    mutationFn: async (data: { dealId: string; supplierId: string }) => {
      return await apiRequest("POST", "/api/coupons", data);
    },
    onSuccess: (response: any) => {
      toast({
        title: "Coupon Generated!",
        description: `Your coupon code: ${response.couponCode}. Valid until ${new Date(response.expiresAt).toLocaleDateString()}.`,
      });
      setShowCompactModal(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate coupon. Please try again.",
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
                  <span className="text-xs text-slate-500 line-through ml-2">R{parseFloat(deal.originalPrice).toLocaleString()}</span>
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
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setShowCompactModal(false)}
            />
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 z-51 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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
                        <span className="text-lg text-slate-500 line-through ml-2">R{parseFloat(deal.originalPrice).toLocaleString()}</span>
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
                    {isAuthenticated ? (
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => createCouponMutation.mutate({ dealId: deal.id, supplierId: deal.supplierId })}
                        disabled={createCouponMutation.isPending}
                      >
                        <Ticket className="h-4 w-4 mr-2" />
                        {createCouponMutation.isPending ? "Generating Coupon..." : "Get Coupon Code"}
                      </Button>
                    ) : (
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => window.location.href = '/register-buyer'}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Register to Get Coupon
                      </Button>
                    )}
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
          </>
        )}
      </>
    );
  }

  // Regular deal card layout (rest of the component...)
  // Include the existing regular layout code here
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <p className="text-slate-600">Regular deal layout - to be implemented</p>
      </CardContent>
    </Card>
  );
}