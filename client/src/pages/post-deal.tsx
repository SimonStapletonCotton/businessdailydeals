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
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { insertDealSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { z } from "zod";

const formSchema = insertDealSchema.omit({ supplierId: true }).extend({
  keywords: z.array(z.string()).optional(),
  expiresAt: z.date().optional(),
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
  const [productImageInput, setProductImageInput] = useState("");
  const [productImages, setProductImages] = useState<string[]>([]);

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
      category: "Electronics",
      price: "",
      originalPrice: "",
      discount: 0,
      minOrder: 1,
      dealType: "regular",
      imageUrl: "",
      keywords: [],
      productImages: [],
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
        imageUrl: data.imageUrl || "",
        keywords: keywords.length > 0 ? keywords : [],
        expiresAt: data.expiresAt,
        productImages: productImages.length > 0 ? productImages : [],
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
      setLocation("/supplier-dashboard");
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
        description: "Failed to post deal. Please try again.",
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

    if (productImages.length === 0) {
      toast({
        title: "Product Images Required",
        description: "Please add at least one product image.",
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

  const addProductImage = () => {
    if (productImageInput.trim() && !productImages.includes(productImageInput.trim())) {
      setProductImages([...productImages, productImageInput.trim()]);
      setProductImageInput("");
    }
  };

  const removeProductImage = (imageToRemove: string) => {
    setProductImages(productImages.filter(img => img !== imageToRemove));
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
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-slate-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900" data-testid="text-page-title">
            Post New Deal
          </h1>
          <p className="text-muted-foreground mt-1">
            Create a new deal to showcase your products to potential buyers
          </p>
        </div>

        {/* Deal Type Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center text-accent" data-testid="text-hot-deal-title">
                <Flame className="h-5 w-5 mr-2" />
                Hot Deal - Premium
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Premium placement on homepage</li>
                <li>• Enhanced visibility</li>
                <li>• Priority in search results</li>
                <li>• Immediate buyer notifications</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary" data-testid="text-regular-deal-title">
                <Package className="h-5 w-5 mr-2" />
                Regular Deal - Standard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Standard marketplace listing</li>
                <li>• Competitive pricing</li>
                <li>• Standard search visibility</li>
                <li>• Keyword-based notifications</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Deal Form */}
        <Card>
          <CardHeader>
            <CardTitle data-testid="text-deal-details-title">Deal Details</CardTitle>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-category">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                        <FormLabel>Sale Price ($) *</FormLabel>
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
                        <FormLabel>Original Price ($)</FormLabel>
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

                {/* Deal Type and Image */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="dealType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deal Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-deal-type">
                              <SelectValue placeholder="Select deal type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="regular">Regular Deal</SelectItem>
                            <SelectItem value="hot">Hot Deal (Premium)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Hot deals get premium placement and higher visibility
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/image.jpg"
                            {...field}
                            value={field.value || ""}
                            data-testid="input-image-url"
                          />
                        </FormControl>
                        <FormDescription>
                          Optional: Cover image for the deal card
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Product Images Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-olive-600" />
                    <h3 className="text-lg font-semibold text-charcoal-900">Product Images *</h3>
                  </div>
                  <div className="bg-olive-50 border border-olive-200 rounded-lg p-4">
                    <div className="flex gap-2 mb-3">
                      <Input
                        placeholder="Enter product image URL..."
                        value={productImageInput}
                        onChange={(e) => setProductImageInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addProductImage())}
                        data-testid="input-product-image"
                      />
                      <Button 
                        type="button" 
                        onClick={addProductImage}
                        variant="outline"
                        className="border-olive-600 text-olive-600 hover:bg-olive-50"
                        data-testid="button-add-product-image"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {productImages.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {productImages.map((image, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="bg-white border border-charcoal-200 text-charcoal-700 px-3 py-1"
                          >
                            <span className="mr-2 truncate max-w-[200px]">{image}</span>
                            <button
                              type="button"
                              onClick={() => removeProductImage(image)}
                              className="text-red-500 hover:text-red-700"
                              data-testid={`button-remove-product-image-${index}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-sm text-charcoal-600 mt-2">
                      Add multiple product image URLs. At least one image is required.
                    </p>
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
                    <FormItem className="flex flex-col">
                      <FormLabel>Expiry Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              data-testid="button-expiry-date"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick an expiry date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date()
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        When should this deal expire? Leave blank for no expiry.
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
