import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, X, Calendar as CalendarIcon, Flame, Package, AlertCircle } from "lucide-react";
import { ImageUpload } from "@/components/image-upload";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { insertDealSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { z } from "zod";
import { DealPricingInfo } from "@/components/deal-pricing-info";

const formSchema = insertDealSchema.omit({ supplierId: true, createdAt: true, updatedAt: true }).extend({
  keywords: z.array(z.string()).optional(),
  expiresAt: z.date().optional(),
  discount: z.number().optional(),
  minOrder: z.number().optional(),
  size: z.string().optional(),
  quantityAvailable: z.number().optional(),
  productSpecifications: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const categories = [
  "Electronics",
  "Industrial Equipment", 
  "Office Supplies",
  "Software & Services",
  "Construction & Building",
  "Automotive & Transport",
  "Food & Beverage",
  "Healthcare & Medical",
  "Agriculture & Farming",
  "Mining",
  "General Industry",
  "Residential",
  "Textiles & Clothing",
  "Energy & Utilities",
  "Packaging & Logistics",
  "Safety & Security",
  "Cleaning & Maintenance",
  "Manufacturing & Tools",
  "Printing & Advertising",
  "Hospitality & Tourism",
  "Sports & Recreation",
  "Water",
  "Other"
];

export default function PostDeal() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<string>("");


  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
    if (!isLoading && isAuthenticated && (user as any)?.userType !== "supplier") {
      toast({
        title: "Access Denied",
        description: "Only suppliers can post deals.",
        variant: "destructive",
      });
      setLocation("/");
    }
  }, [isAuthenticated, isLoading, user, toast, setLocation]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      price: "",
      originalPrice: "",
      discount: 0,
      minOrder: 1,
      dealType: "regular",
      imageUrl: "",
      keywords: [],

      size: "",
      quantityAvailable: undefined,
      productSpecifications: "",
    },
  });

  const createDealMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const dealData = {
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price,
        originalPrice: data.originalPrice || undefined,
        discount: Number(data.discount) || 0,
        minOrder: Number(data.minOrder) || 1,
        dealType: data.dealType,
        imageUrl: mainImage || "",
        keywords: keywords.length > 0 ? keywords : [],
        expiresAt: data.expiresAt,

        size: data.size || undefined,
        quantityAvailable: data.quantityAvailable || undefined,
        productSpecifications: data.productSpecifications || undefined,
      };
      console.log("Sending to API:", dealData);
      await apiRequest("POST", "/api/deals", dealData);
    },
    onSuccess: () => {
      toast({
        title: "Deal Posted Successfully",
        description: "Your deal has been posted and is now live.",
      });
      // Invalidate supplier dashboard queries to refresh the deals list
      queryClient.invalidateQueries({ queryKey: ["/api/supplier/deals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
      setLocation("/supplier-dashboard");
    },
    onError: (error: any) => {
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
      
      // Handle credit-related errors
      if (error?.response?.data?.creditError) {
        toast({
          title: "Insufficient Credits",
          description: error.response.data.details || "Not enough credits to post this deal type.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to post deal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted with data:", data);
    console.log("User:", user);
    console.log("Keywords:", keywords);
    console.log("Authentication status:", { isAuthenticated, userType: (user as any)?.userType });
    
    if (!data.title || !data.description || !data.category || !data.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Title, Description, Category, Price).",
        variant: "destructive",
      });
      return;
    }


    
    createDealMutation.mutate(data);
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter(k => k !== keywordToRemove));
  };

  const handleMainImageChange = (images: string[]) => {
    setMainImage(images[0] || "");
  };



  const calculateDiscount = () => {
    const price = parseFloat(form.watch("price") || "0");
    const originalPrice = parseFloat(form.watch("originalPrice") || "0");
    
    if (originalPrice > 0 && price > 0 && originalPrice > price) {
      const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
      form.setValue("discount", discount);
    } else {
      form.setValue("discount", 0);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-8"></div>
              <div className="h-64 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Login Required</h1>
            <p className="text-muted-foreground mb-4">Please log in to post deals.</p>
            <Button onClick={() => window.location.href = "/api/login"}>
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if ((user as any)?.userType !== "supplier") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Supplier Access Required</h1>
            <p className="text-muted-foreground mb-4">Only suppliers can post deals. Please switch to supplier mode.</p>
            <Button onClick={() => setLocation("/")}>
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-post">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Modern Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-accent/20 to-primary/20 p-4 rounded-full">
              <Plus className="h-10 w-10 text-accent" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4" data-testid="text-page-title">
            Post New Deal
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Create compelling deal listings to attract buyers and grow your business in the South African B2B marketplace
          </p>
        </div>

        {/* FREE Promotional Period Banner */}
        <div className="mb-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white text-center" data-testid="promotional-banner">
          <div className="flex items-center justify-center mb-2">
            <Flame className="h-6 w-6 mr-2 text-orange-200" />
            <h2 className="text-2xl font-bold">🎉 FREE UNTIL 20TH FEBRUARY 2026!</h2>
            <Flame className="h-6 w-6 ml-2 text-orange-200" />
          </div>
          <p className="text-lg mb-2">
            <strong>All deal posting is 100% FREE for suppliers until 20th February 2026!</strong>
          </p>
          <p className="text-sm opacity-90">
            Post unlimited HOT and REGULAR deals at no cost • Build your customer base • Start selling today
          </p>
          <div className="mt-3 inline-flex items-center bg-white/20 rounded-full px-4 py-2 text-sm font-medium">
            <Package className="h-4 w-4 mr-2" />
            Normally R125 for HOT deals • R50 for REGULAR deals • Now FREE until Feb 20, 2026!
          </div>
        </div>

        {/* Credit Pricing Information */}
        <DealPricingInfo />

        {/* Modern Deal Type Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-white to-orange-50 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-accent text-xl" data-testid="text-hot-deal-title">
                <div className="bg-gradient-to-br from-accent/10 to-accent/20 p-3 rounded-full mr-3">
                  <Flame className="h-6 w-6 text-accent" />
                </div>
                Hot Deal - Premium
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-center"><span className="text-accent mr-2">✓</span> Premium placement on homepage</li>
                <li className="flex items-center"><span className="text-accent mr-2">✓</span> Enhanced visibility</li>
                <li className="flex items-center"><span className="text-accent mr-2">✓</span> Priority in search results</li>
                <li className="flex items-center"><span className="text-accent mr-2">✓</span> Immediate buyer notifications</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-primary text-xl" data-testid="text-regular-deal-title">
                <div className="bg-gradient-to-br from-primary/10 to-primary/20 p-3 rounded-full mr-3">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                Regular Deal - Standard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-center"><span className="text-primary mr-2">✓</span> Standard marketplace listing</li>
                <li className="flex items-center"><span className="text-primary mr-2">✓</span> Competitive pricing</li>
                <li className="flex items-center"><span className="text-primary mr-2">✓</span> Standard search visibility</li>
                <li className="flex items-center"><span className="text-primary mr-2">✓</span> Keyword-based notifications</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Modern Deal Form */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-slate-900" data-testid="text-deal-details-title">Deal Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deal Title *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Professional Workstation Package"
                            {...field}
                            data-testid="input-title"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            data-testid="select-category"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your deal in detail..."
                          className="min-h-[100px]"
                          {...field}
                          data-testid="textarea-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sale Price (R) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setTimeout(calculateDiscount, 100);
                            }}
                            data-testid="input-price"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="originalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Original Price (R)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              field.onChange(e);
                              setTimeout(calculateDiscount, 100);
                            }}
                            data-testid="input-original-price"
                          />
                        </FormControl>
                        <FormDescription>
                          Optional: Set to show discount percentage
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            {...field}
                            value={field.value || 0}
                            readOnly
                            className="bg-muted"
                            data-testid="input-discount"
                          />
                        </FormControl>
                        <FormDescription>
                          Auto-calculated
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min. Order Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            value={field.value || 1}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            data-testid="input-min-order"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Deal Type and Main Image */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="dealType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deal Type *</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            data-testid="select-deal-type"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Select deal type</option>
                            <option value="regular">Regular Deal</option>
                            <option value="hot">Hot Deal (Premium)</option>
                          </select>
                        </FormControl>
                        <FormDescription>
                          Hot deals get premium placement and higher visibility
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <ImageUpload
                      images={mainImage ? [mainImage] : []}
                      onImagesChange={handleMainImageChange}
                      maxImages={1}
                      label="Main Cover Image"
                      description="Upload one main image for your deal (max 5MB)"
                    />
                  </div>
                </div>



                {/* Product Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size/Dimensions</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., L x W x H: 50cm x 30cm x 20cm"
                            {...field}
                            value={field.value || ""}
                            data-testid="input-size"
                          />
                        </FormControl>
                        <FormDescription>
                          Optional: Product size or dimensions
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantityAvailable"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity Available</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="e.g., 100"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                            data-testid="input-quantity-available"
                          />
                        </FormControl>
                        <FormDescription>
                          Optional: Total units available for this deal
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="productSpecifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Specifications</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter detailed product specifications, features, materials, etc..."
                          className="min-h-[100px]"
                          {...field}
                          value={field.value || ""}
                          data-testid="textarea-product-specifications"
                        />
                      </FormControl>
                      <FormDescription>
                        Optional: Detailed product specifications, features, materials, technical details, etc.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Expiry Date */}
                <FormField
                  control={form.control}
                  name="expiresAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value ? field.value.toISOString().split('T')[0] : ''}
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : undefined;
                            field.onChange(date);
                          }}
                          min={new Date().toISOString().split('T')[0]}
                          data-testid="input-expiry-date"
                          className="w-[240px]"
                        />
                      </FormControl>
                      <FormDescription>
                        When should this deal expire? Leave blank for no expiry.<br/>
                        <span className="text-amber-600 font-medium">⚠️ Note: Deals are FREE until Feb 20, 2026. Extensions beyond this date will require credits starting Feb 21, 2026.</span>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Keywords */}
                <div className="space-y-4">
                  <div>
                    <FormLabel>Keywords</FormLabel>
                    <FormDescription>
                      Add keywords to help buyers find your deal through notifications
                    </FormDescription>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {keywords.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-2"
                        data-testid={`badge-keyword-${index}`}
                      >
                        {keyword}
                        <button
                          type="button"
                          onClick={() => removeKeyword(keyword)}
                          className="hover:text-destructive"
                          data-testid={`button-remove-keyword-${index}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter a keyword (e.g., office equipment, laptops)"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                      data-testid="input-keyword"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addKeyword}
                      disabled={!keywordInput.trim()}
                      data-testid="button-add-keyword"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/supplier-dashboard")}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createDealMutation.isPending}
                    className="bg-primary hover:bg-primary/90"
                    data-testid="button-post-deal"
                  >
                    {createDealMutation.isPending ? "Posting..." : "Post Deal"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Pricing Guideline */}
        <Card className="mt-8 border-amber-200 bg-amber-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">Pricing Structure</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• <strong>Hot Deals:</strong> Premium placement on home page with higher pricing</li>
                  <li>• <strong>Regular Deals:</strong> Listed in dropdown sections with standard pricing</li>
                  <li>• Include shipping costs in your pricing or specify shipping terms</li>
                  <li>• Set realistic minimum order quantities to attract buyers</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
