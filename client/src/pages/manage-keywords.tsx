import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, Mail, MessageSquare, Smartphone, Plus, X, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import Navbar from "@/components/navbar";

const keywordManagementSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  keywords: z.string().optional(),
  notificationMethod: z.enum(["email", "sms", "whatsapp"], {
    required_error: "Please select a notification method",
  }),
  allowEmailNotifications: z.boolean().default(true),
  allowSmsNotifications: z.boolean().default(false),
  allowWhatsappNotifications: z.boolean().default(false),
});

type KeywordManagementForm = z.infer<typeof keywordManagementSchema>;

export default function ManageKeywords() {
  const { toast } = useToast();
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [userFound, setUserFound] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const form = useForm<KeywordManagementForm>({
    resolver: zodResolver(keywordManagementSchema),
    defaultValues: {
      email: "",
      keywords: "",
      notificationMethod: "email",
      allowEmailNotifications: true,
      allowSmsNotifications: false,
      allowWhatsappNotifications: false,
    },
  });

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const findUserMutation = useMutation({
    mutationFn: async (email: string) => {
      return apiRequest("POST", "/api/auth/find-user", { email });
    },
    onSuccess: (response: any) => {
      setCurrentUser(response.user);
      setUserFound(true);
      
      // Populate form with existing user data
      if (response.user.keywords) {
        const existingKeywords = response.user.keywords.split(", ").filter((k: string) => k.trim());
        setKeywords(existingKeywords);
      }
      
      form.setValue("notificationMethod", response.user.notificationMethod || "email");
      form.setValue("allowEmailNotifications", response.user.allowEmailNotifications ?? true);
      form.setValue("allowSmsNotifications", response.user.allowSmsNotifications ?? false);
      form.setValue("allowWhatsappNotifications", response.user.allowWhatsappNotifications ?? false);
      
      toast({
        title: "User Found!",
        description: `Welcome back, ${response.user.firstName}! You can now manage your keywords.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "User Not Found",
        description: "No account found with this email address. Please check the email or register for a new account.",
        variant: "destructive",
      });
      setUserFound(false);
      setCurrentUser(null);
    },
  });

  const updateKeywordsMutation = useMutation({
    mutationFn: async (data: KeywordManagementForm) => {
      return apiRequest("PUT", "/api/auth/update-keywords", {
        email: data.email,
        keywords: keywords.join(", "),
        notificationMethod: data.notificationMethod,
        allowEmailNotifications: data.allowEmailNotifications,
        allowSmsNotifications: data.allowSmsNotifications,
        allowWhatsappNotifications: data.allowWhatsappNotifications,
      });
    },
    onSuccess: () => {
      toast({
        title: "Keywords Updated!",
        description: "Your notification preferences have been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "There was an error updating your keywords. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmitKeywords = (data: KeywordManagementForm) => {
    updateKeywordsMutation.mutate(data);
  };

  const handleFindUser = () => {
    const email = form.getValues("email");
    if (email) {
      findUserMutation.mutate(email);
    }
  };

  return (
    <div className="min-h-screen" style={{
      background: `linear-gradient(135deg, 
        #ff8f00 0%, 
        #ff8f00 20%, 
        #ffab40 40%, 
        #e3f2fd 60%, 
        #f8fafc 80%, 
        #f8fafc 100%)`
    }}>
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Bell className="h-8 w-8 text-orange-600" />
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Manage Your Keywords
                </CardTitle>
              </div>
              <CardDescription className="text-lg text-gray-600">
                Already registered? Add more keywords to receive notifications on deals that match your interests.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...form}>
                {!userFound ? (
                  // Step 1: Find User
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Your Email Address <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Enter your registered email address" 
                              {...field} 
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="button"
                      onClick={handleFindUser}
                      className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                      disabled={findUserMutation.isPending}
                      data-testid="button-find-user"
                    >
                      {findUserMutation.isPending ? "Searching..." : "Find My Account"}
                    </Button>
                    
                    <div className="text-center pt-4">
                      <p className="text-sm text-gray-600 mb-2">
                        Don't have an account yet?
                      </p>
                      <Link href="/buyer-registration">
                        <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                          Register as New Buyer
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  // Step 2: Manage Keywords
                  <form onSubmit={form.handleSubmit(onSubmitKeywords)} className="space-y-6">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Bell className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-green-800">
                          Welcome back, {currentUser?.firstName}!
                        </h3>
                      </div>
                      <p className="text-green-700 text-sm">
                        Account: {currentUser?.email} • User Type: {currentUser?.userType}
                      </p>
                    </div>

                    {/* Keywords Management */}
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Bell className="h-5 w-5 text-orange-600" />
                        <h3 className="font-semibold text-orange-800">Your Deal Notification Keywords</h3>
                      </div>
                      
                      <div className="mb-4">
                        <Label className="text-orange-800 mb-2 block">Add New Keywords</Label>
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
                          <div className="mt-3">
                            <Label className="text-orange-800 mb-2 block">Current Keywords ({keywords.length}):</Label>
                            <div className="flex flex-wrap gap-2">
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
                          </div>
                        )}
                      </div>

                      {/* Notification Method */}
                      <FormField
                        control={form.control}
                        name="notificationMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-orange-800">
                              How would you like to receive notifications? <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <select 
                                {...field}
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                data-testid="select-notification-method"
                              >
                                <option value="email">📧 Email Notifications</option>
                                <option value="sms">📱 SMS Notifications</option>
                                <option value="whatsapp">💬 WhatsApp Notifications</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Notification Preferences */}
                      <div className="mt-4 space-y-3">
                        <Label className="text-orange-800">Additional Notification Preferences:</Label>
                        
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

                    <div className="flex gap-3">
                      <Button 
                        type="button"
                        onClick={() => {
                          setUserFound(false);
                          setCurrentUser(null);
                          setKeywords([]);
                          form.reset();
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Search
                      </Button>
                      
                      <Button 
                        type="submit" 
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        disabled={updateKeywordsMutation.isPending}
                        data-testid="button-update-keywords"
                      >
                        {updateKeywordsMutation.isPending ? "Updating..." : "Update Keywords"}
                      </Button>
                    </div>
                  </form>
                )}
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}