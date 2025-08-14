import { useState } from "react";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Building2, Package, Percent, Image, Clock, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";

const supplierRegistrationSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  address: z.string().min(10, "Please provide a complete address"),
  email: z.string().email("Please enter a valid email address"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  representativeName: z.string().min(2, "Name of company representative must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
  numberOfItems: z.string().min(1, "Number of items to be uploaded is required"),
  rrpPerItem: z.string().min(1, "RRP of each item is required"),
  discountPerItem: z.string().min(1, "Discount on each item is required"),
  itemDescriptions: z.string().min(10, "Detailed description of each item is required"),
  dealType: z.enum(["hot", "regular"], {
    required_error: "Please select whether to load as 24hr deal or regular deal",
  }),
  regularDealDuration: z.string().optional(),
  // Optional verification fields
  vatNumber: z.string().optional(),
  businessRegistrationNumber: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  const discount = parseFloat(data.discountPerItem);
  return !isNaN(discount) && discount > 0;
}, {
  message: "Discount must be greater than 0%",
  path: ["discountPerItem"],
}).refine((data) => data.dealType !== "regular" || data.regularDealDuration, {
  message: "Please select duration for regular deals (7 or 14 days)",
  path: ["regularDealDuration"],
});

type SupplierRegistrationForm = z.infer<typeof supplierRegistrationSchema>;

export default function SupplierRegistration() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<SupplierRegistrationForm>({
    resolver: zodResolver(supplierRegistrationSchema),
    defaultValues: {
      companyName: "",
      address: "",
      email: "",
      mobile: "",
      representativeName: "",
      password: "",
      confirmPassword: "",
      numberOfItems: "",
      rrpPerItem: "",
      discountPerItem: "",
      itemDescriptions: "",
      dealType: "hot",
      regularDealDuration: "",
      vatNumber: "",
      businessRegistrationNumber: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: SupplierRegistrationForm) => {
      const registrationData = {
        ...data,
        userType: "supplier",
      };
      return await apiRequest("POST", "/api/auth/register", registrationData);
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "Your supplier account has been created successfully. Purchase credits to start advertising!",
      });
      setLocation("/supplier-dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SupplierRegistrationForm) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="page-register py-12">
        <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Link href="/">
              <Button variant="outline" className="mr-4">
                ← Back to Home
              </Button>
            </Link>
            <Badge variant="outline" className="text-emerald-600 border-emerald-200">
              Join Business Daily Deals
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Register as a <span className="text-emerald-600">Supplier</span>
          </h1>
          <p className="text-slate-600 text-lg">
            Start selling your products with exclusive deals and reach more customers
          </p>
        </div>

        {/* FREE Promotional Period Banner */}
        <div className="mb-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white text-center" data-testid="promotional-banner">
          <div className="flex items-center justify-center mb-2">
            <Package className="h-6 w-6 mr-2 text-orange-200" />
            <h2 className="text-2xl font-bold">🎉 SPECIAL LAUNCH OFFER!</h2>
            <Package className="h-6 w-6 ml-2 text-orange-200" />
          </div>
          <p className="text-lg mb-2">
            <strong>Register now and post unlimited deals 100% FREE until 20th February 2026!</strong>
          </p>
          <p className="text-sm opacity-90">
            No setup fees • No monthly charges • No credit purchases required until Jan 2026
          </p>
          <div className="mt-3 inline-flex items-center bg-white/20 rounded-full px-4 py-2 text-sm font-medium">
            <Shield className="h-4 w-4 mr-2" />
            Save R125 per HOT deal • R50 per REGULAR deal
          </div>
        </div>

        <Card className="shadow-xl border-slate-200">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3">
              <Building2 className="h-6 w-6" />
              Supplier Registration
            </CardTitle>
            <CardDescription className="text-emerald-100">
              Complete the form below to start posting deals on our B2B marketplace
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Company Information */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Company Information
                  </h3>
                  
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your company name" {...field} data-testid="input-company-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter your complete business address" {...field} data-testid="input-address" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} data-testid="input-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your mobile number" {...field} data-testid="input-mobile" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="representativeName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name of Company Representative</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter the name of your company representative" {...field} data-testid="input-representative" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Create Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Create a password" {...field} data-testid="input-password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirm your password" {...field} data-testid="input-confirm-password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Optional Supplier Verification */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Supplier Verification (Optional)
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Provide your VAT and business registration numbers to become a verified supplier. 
                    Verified suppliers receive a trust badge and higher visibility on the platform.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="vatNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            VAT Number (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 4123456789" {...field} data-testid="input-vat-number" />
                          </FormControl>
                          <FormDescription className="text-xs text-slate-500">
                            Your South African VAT registration number
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessRegistrationNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Business Registration Number (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 2021/123456/07" {...field} data-testid="input-business-registration" />
                          </FormControl>
                          <FormDescription className="text-xs text-slate-500">
                            Your CIPC company registration number
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Deal Information */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Deal Items Information
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="numberOfItems"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Number of Items
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 5" {...field} data-testid="input-number-items" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rrpPerItem"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>RRP per Item (R)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 500.00" {...field} data-testid="input-rrp" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discountPerItem"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Percent className="h-4 w-4" />
                            Discount %
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 25" {...field} data-testid="input-discount" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="itemDescriptions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Detailed Description of Each Item</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide detailed descriptions for each item you want to list. Include specifications, features, and benefits."
                            className="min-h-[100px]"
                            {...field} 
                            data-testid="input-descriptions"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Deal Type Selection */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Deal Type
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="hot-deal"
                          value="hot"
                          {...form.register("dealType")}
                          className="h-4 w-4 text-orange-600"
                          data-testid="radio-hot-deal"
                        />
                        <label htmlFor="hot-deal" className="text-sm font-medium cursor-pointer">
                          HOT Deal
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="regular-deal"
                          value="regular"
                          {...form.register("dealType")}
                          className="h-4 w-4 text-blue-600"
                          data-testid="radio-regular-deal"
                        />
                        <label htmlFor="regular-deal" className="text-sm font-medium cursor-pointer">
                          Regular Deal
                        </label>
                      </div>
                    </div>

                    {form.watch("dealType") === "regular" && (
                      <FormField
                        control={form.control}
                        name="regularDealDuration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Regular Deal Duration</FormLabel>
                            <div className="flex gap-4">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id="7-days"
                                  value="7"
                                  checked={field.value === "7"}
                                  onChange={() => field.onChange("7")}
                                  className="h-4 w-4 text-blue-600"
                                  data-testid="radio-7-days"
                                />
                                <label htmlFor="7-days" className="text-sm cursor-pointer">
                                  7 Days
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id="14-days"
                                  value="14"
                                  checked={field.value === "14"}
                                  onChange={() => field.onChange("14")}
                                  className="h-4 w-4 text-blue-600"
                                  data-testid="radio-14-days"
                                />
                                <label htmlFor="14-days" className="text-sm cursor-pointer">
                                  14 Days
                                </label>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Image className="h-5 w-5 text-blue-600" />
                      <h4 className="font-medium text-blue-800">Images Required</h4>
                    </div>
                    <p className="text-sm text-blue-700">
                      After registration, you'll be able to upload images for each item through your supplier dashboard.
                    </p>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-5 w-5 text-emerald-600" />
                      <h4 className="font-medium text-emerald-800">Credits Needed to Advertise</h4>
                    </div>
                    <p className="text-sm text-emerald-700 mb-2">
                      Purchase credits after registration to start advertising your deals.
                    </p>
                    <p className="text-xs text-emerald-600">
                      💡 1 Credit = R2.50 • View rates page for pricing details
                    </p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  disabled={registerMutation.isPending}
                  data-testid="button-register"
                >
                  {registerMutation.isPending ? "Creating Account..." : "Create Supplier Account"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}