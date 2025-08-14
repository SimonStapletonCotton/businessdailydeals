import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Package, CreditCard, Ruler, Hash, Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { BackButton } from "@/components/back-button";

const findDealSchema = z.object({
  productName: z.string().min(2, "Product name must be at least 2 characters"),
  productSize: z.string().optional(),
  quantityRequired: z.string().min(1, "Quantity is required"),
  deliveryDestination: z.string().min(2, "Delivery destination is required"),
  priceRangeMin: z.string().optional(),
  priceRangeMax: z.string().optional(),
  additionalRequirements: z.string().optional(),
});

type FindDealForm = z.infer<typeof findDealSchema>;

const southAfricanCities = [
  "Cape Town", "Johannesburg", "Durban", "Pretoria", "Port Elizabeth", 
  "Bloemfontein", "East London", "Pietermaritzburg", "Nelspruit", 
  "Polokwane", "Kimberley", "Rustenburg", "George", "Stellenbosch", 
  "Potchefstroom", "Vereeniging", "Krugersdorp", "Witbank", "Vanderbijlpark", "Other"
];

export default function FindMeDeal() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<FindDealForm>({
    resolver: zodResolver(findDealSchema),
    defaultValues: {
      productName: "",
      productSize: "",
      quantityRequired: "",
      deliveryDestination: "",
      priceRangeMin: "",
      priceRangeMax: "",
      additionalRequirements: "",
    },
  });

  const submitRequestMutation = useMutation({
    mutationFn: async (data: FindDealForm) => {
      const requestData = {
        productName: data.productName,
        productSize: data.productSize || null,
        quantityRequired: parseInt(data.quantityRequired),
        deliveryDestination: data.deliveryDestination,
        priceRangeMin: data.priceRangeMin ? parseFloat(data.priceRangeMin) : null,
        priceRangeMax: data.priceRangeMax ? parseFloat(data.priceRangeMax) : null,
        additionalRequirements: data.additionalRequirements || null,
      };
      
      await apiRequest("POST", "/api/deal-requests", requestData);
    },
    onSuccess: () => {
      toast({
        title: "Deal Request Submitted",
        description: "Suppliers will be notified and will contact you with matching deals.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit deal request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FindDealForm) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to submit a deal request.",
        variant: "destructive",
      });
      // Redirect to login
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1500);
      return;
    }

    if (!data.productName || !data.quantityRequired || !data.deliveryDestination) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    submitRequestMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-300 rounded mb-4"></div>
              <div className="h-4 bg-slate-300 rounded mb-8"></div>
              <div className="h-64 bg-slate-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Login Required</h1>
            <p className="text-muted-foreground mb-4">Please log in to submit deal requests.</p>
            <Button onClick={() => window.location.href = "/api/login"}>
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-find-deal">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BackButton label="← Back to Home" />
        {/* Modern Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-violet-500/20 to-indigo-500/20 p-4 rounded-full">
              <Search className="h-10 w-10 text-violet-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
            Find Me a Deal
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Tell us what you need and we'll connect you with suppliers who can provide matching deals
          </p>
        </div>

        {/* Deal Request Form */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center text-2xl">
              <Package className="mr-3 h-6 w-6" />
              Product Request Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Product Name */}
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-lg font-semibold">
                        <Package className="mr-2 h-5 w-5 text-violet-600" />
                        Product Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Office chairs, laptops, construction materials..."
                          {...field}
                          className="text-lg p-4 border-2 border-slate-200 focus:border-violet-500"
                          data-testid="input-product-name"
                        />
                      </FormControl>
                      <FormDescription>
                        Describe the product or service you need as specifically as possible
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Size */}
                  <FormField
                    control={form.control}
                    name="productSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center font-semibold">
                          <Ruler className="mr-2 h-4 w-4 text-violet-600" />
                          Size/Dimensions
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Large, 50cm x 30cm, 15 inch..."
                            {...field}
                            className="p-3 border-2 border-slate-200 focus:border-violet-500"
                            data-testid="input-product-size"
                          />
                        </FormControl>
                        <FormDescription>
                          Optional: Specify size, dimensions, or specifications
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Quantity Required */}
                  <FormField
                    control={form.control}
                    name="quantityRequired"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center font-semibold">
                          <Hash className="mr-2 h-4 w-4 text-violet-600" />
                          Quantity Required *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="e.g., 50, 100, 500..."
                            {...field}
                            className="p-3 border-2 border-slate-200 focus:border-violet-500"
                            data-testid="input-quantity"
                          />
                        </FormControl>
                        <FormDescription>
                          How many units do you need?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Delivery Destination */}
                <FormField
                  control={form.control}
                  name="deliveryDestination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center font-semibold">
                        <MapPin className="mr-2 h-4 w-4 text-violet-600" />
                        Delivery Destination *
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full p-3 border-2 border-slate-200 rounded-md focus:border-violet-500 focus:outline-none bg-white"
                          data-testid="select-delivery-destination"
                        >
                          <option value="">Select delivery city or area</option>
                          {southAfricanCities.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormDescription>
                        Where do you need the products delivered?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price Range */}
                <div className="space-y-4">
                  <div className="flex items-center mb-2">
                    <CreditCard className="mr-2 h-5 w-5 text-violet-600" />
                    <h3 className="text-lg font-semibold">Budget Range (ZAR)</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="priceRangeMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Budget</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="e.g., 1000.00"
                              {...field}
                              className="p-3 border-2 border-slate-200 focus:border-violet-500"
                              data-testid="input-price-min"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="priceRangeMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Budget</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="e.g., 5000.00"
                              {...field}
                              className="p-3 border-2 border-slate-200 focus:border-violet-500"
                              data-testid="input-price-max"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Optional: Specify your budget range to help suppliers provide appropriate quotes
                  </p>
                </div>

                {/* Additional Requirements */}
                <FormField
                  control={form.control}
                  name="additionalRequirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Additional Requirements</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any specific requirements, quality standards, delivery timelines, or other important details..."
                          {...field}
                          rows={4}
                          className="p-4 border-2 border-slate-200 focus:border-violet-500 resize-none"
                          data-testid="textarea-requirements"
                        />
                      </FormControl>
                      <FormDescription>
                        Optional: Include any additional specifications, quality requirements, or special conditions
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitRequestMutation.isPending}
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-4 text-lg font-semibold shadow-lg transition-all duration-200"
                    data-testid="button-submit-request"
                  >
                    {submitRequestMutation.isPending ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting Request...
                      </div>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        {!isAuthenticated ? "Login to Submit Request" : "Submit Deal Request"}
                      </>
                    )}
                  </Button>
                </div>

                {/* Information Box */}
                <div className="bg-violet-50 border border-violet-200 rounded-lg p-6 mt-6">
                  <h4 className="font-semibold text-violet-900 mb-2">What happens next?</h4>
                  <ul className="text-sm text-violet-800 space-y-1">
                    <li>• Suppliers matching your requirements will be automatically notified</li>
                    <li>• You'll receive quotes and proposals directly via email or notifications</li>
                    <li>• Compare offers and choose the best supplier for your needs</li>
                    <li>• Connect directly with suppliers to finalize your order</li>
                  </ul>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}