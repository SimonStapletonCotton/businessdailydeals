import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingBag, Gift, Smartphone, Bell, Mail, MessageSquare, X, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
import Navbar from "@/components/navbar";

const buyerRegistrationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  surname: z.string().min(2, "Surname must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
  province: z.string({
    required_error: "Please select your province",
  }).min(1, "Please select your province"),
  subscribeToNewsletter: z.boolean().default(false),
  acceptDataOffer: z.boolean().default(false),
  mobileProvider: z.string().optional(),
  
  // Keyword notifications and preferences
  keywords: z.string().min(1, "Please add at least one keyword for notifications"),
  notificationMethod: z.enum(["email", "sms", "whatsapp"], {
    required_error: "Please select a notification method",
  }),
  allowEmailNotifications: z.boolean().default(true),
  allowSmsNotifications: z.boolean().default(false),
  allowWhatsappNotifications: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => !data.acceptDataOffer || data.mobileProvider, {
  message: "Please select your mobile provider to receive the data offer",
  path: ["mobileProvider"],
});

type BuyerRegistrationForm = z.infer<typeof buyerRegistrationSchema>;

const southAfricanProvinces = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape"
];

export default function BuyerRegistration() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);

  const form = useForm<BuyerRegistrationForm>({
    resolver: zodResolver(buyerRegistrationSchema),
    defaultValues: {
      firstName: "",
      surname: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      province: "",
      subscribeToNewsletter: false,
      acceptDataOffer: false,
      mobileProvider: "",
      keywords: "",
      notificationMethod: "email",
      allowEmailNotifications: true,
      allowSmsNotifications: false,
      allowWhatsappNotifications: false,
    },
  });

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      const newKeywords = [...keywords, keywordInput.trim()];
      setKeywords(newKeywords);
      form.setValue("keywords", newKeywords.join(", "));
      setKeywordInput("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    const newKeywords = keywords.filter(k => k !== keywordToRemove);
    setKeywords(newKeywords);
    form.setValue("keywords", newKeywords.join(", "));
  };

  const registerMutation = useMutation({
    mutationFn: async (data: BuyerRegistrationForm) => {
      const registrationData = {
        ...data,
        keywordsList: keywords, // Send keywords as array
        userType: "buyer",
      };
      return await apiRequest("POST", "/api/auth/register", registrationData);
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "Your buyer account has been created successfully. You can now start browsing deals!",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BuyerRegistrationForm) => {
    console.log("Form submitted with data:", data);
    console.log("Keywords state:", keywords);
    console.log("Form errors:", form.formState.errors);
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="page-register py-12">
        <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Link href="/">
              <Button variant="outline" className="mr-4">
                ← Back to Home
              </Button>
            </Link>
            <Badge variant="outline" className="text-indigo-600 border-indigo-200">
              Join Business Daily Deals
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Register as a <span className="text-blue-600">Buyer</span>
          </h1>
          <p className="text-slate-600 text-lg mb-2">
            Start saving money with exclusive B2B deals and special offers
          </p>
          <p className="text-green-600 font-semibold text-base bg-green-50 px-4 py-2 rounded-lg border border-green-200">
            There is no cost to register or engage as a buyer
          </p>
        </div>

        <Card className="shadow-xl border-slate-200">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3">
              <ShoppingBag className="h-6 w-6" />
              Buyer Registration
            </CardTitle>
            <CardDescription className="text-blue-100">
              Complete the form below to access our exclusive B2B marketplace
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your first name" {...field} data-testid="input-first-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="surname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Surname</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your surname" {...field} data-testid="input-surname" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Contact Information */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email address" {...field} data-testid="input-email" />
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

                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Province</FormLabel>
                      <FormControl>
                        <select 
                          {...field}
                          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          data-testid="select-province"
                        >
                          <option value="">Select your province</option>
                          {southAfricanProvinces.map((province) => (
                            <option key={province} value={province}>
                              {province}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                {/* Newsletter Subscription */}
                <FormField
                  control={form.control}
                  name="subscribeToNewsletter"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-newsletter"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="cursor-pointer">
                          Subscribe to our weekly deal newsletter
                        </FormLabel>
                        <FormDescription>
                          Get notified about upcoming deals and special offers
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Data Offer */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Gift className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-green-800">FREE Data Offer!</h3>
                  </div>
                  <p className="text-green-700 mb-4 text-sm">
                    Receive 500MB of FREE data if you spend R5,000 or more in any given month
                  </p>
                  
                  <FormField
                    control={form.control}
                    name="acceptDataOffer"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-data-offer"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="cursor-pointer text-green-800">
                            Yes, I want to receive FREE data!
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {form.watch("acceptDataOffer") && (
                    <div className="mt-4">
                      <FormField
                        control={form.control}
                        name="mobileProvider"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-green-800">
                              <Smartphone className="h-4 w-4" />
                              Select your mobile provider
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-mobile-provider">
                                  <SelectValue placeholder="Choose your provider" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="vodacom">Vodacom</SelectItem>
                                <SelectItem value="mtn">MTN</SelectItem>
                                <SelectItem value="telkom">Telkom</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                {/* Keywords and Notification Preferences */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Bell className="h-5 w-5 text-orange-600" />
                    <h3 className="font-semibold text-orange-800">Deal Notifications & Keywords</h3>
                  </div>
                  <p className="text-orange-700 mb-4 text-sm">
                    Get notified when deals match your interests. Add keywords and choose how you want to be notified.
                  </p>

                  {/* Keywords Input */}
                  <div className="mb-4">
                    <Label className="text-orange-800 mb-2 block">Add Keywords for Deal Notifications</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., electronics, office supplies, machinery"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                        data-testid="input-keyword"
                      />
                      <Button 
                        type="button" 
                        onClick={addKeyword}
                        variant="outline"
                        size="sm"
                        data-testid="button-add-keyword"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {keywords.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                            {keyword}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 ml-2 hover:bg-transparent"
                              onClick={() => removeKeyword(keyword)}
                              data-testid={`button-remove-keyword-${index}`}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Hidden field for form validation */}
                  <FormField
                    control={form.control}
                    name="keywords"
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Notification Method Selection */}
                  <FormField
                    control={form.control}
                    name="notificationMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-orange-800">How would you like to receive notifications?</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-notification-method">
                              <SelectValue placeholder="Choose notification method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="email">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email Notifications
                              </div>
                            </SelectItem>
                            <SelectItem value="sms">
                              <div className="flex items-center gap-2">
                                <Smartphone className="h-4 w-4" />
                                SMS Notifications
                              </div>
                            </SelectItem>
                            <SelectItem value="whatsapp">
                              <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                WhatsApp Notifications
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Additional Notification Preferences */}
                  <div className="mt-4 space-y-3">
                    <FormField
                      control={form.control}
                      name="allowEmailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-allow-email"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer text-orange-800">
                              Allow email notifications
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="allowSmsNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-allow-sms"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer text-orange-800">
                              Allow SMS notifications
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="allowWhatsappNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-allow-whatsapp"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer text-orange-800">
                              Allow WhatsApp notifications
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  disabled={registerMutation.isPending}
                  data-testid="button-register"
                >
                  {registerMutation.isPending ? "Creating Account..." : "Create Buyer Account"}
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