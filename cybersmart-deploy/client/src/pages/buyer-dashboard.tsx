import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, Mail, MessageSquare, Smartphone, Plus, X, User, Eye, Search, Heart, Settings } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const keywordUpdateSchema = z.object({
  keywords: z.string().optional(),
  notificationMethod: z.enum(["email", "sms", "whatsapp"], {
    required_error: "Please select a notification method",
  }),
  allowEmailNotifications: z.boolean().default(true),
  allowSmsNotifications: z.boolean().default(false),
  allowWhatsappNotifications: z.boolean().default(false),
});

type KeywordUpdateForm = z.infer<typeof keywordUpdateSchema>;

export default function BuyerDashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);

  const form = useForm<KeywordUpdateForm>({
    resolver: zodResolver(keywordUpdateSchema),
    defaultValues: {
      keywords: "",
      notificationMethod: "email",
      allowEmailNotifications: true,
      allowSmsNotifications: false,
      allowWhatsappNotifications: false,
    },
  });

  // Load user's current keywords and preferences
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    enabled: isAuthenticated,
  });

  // Update form when user data loads
  if (userData && isAuthenticated) {
    if (userData.keywords && keywords.length === 0) {
      const existingKeywords = userData.keywords.split(", ").filter((k: string) => k.trim());
      setKeywords(existingKeywords);
    }
    
    if (form.getValues("notificationMethod") === "email" && userData.notificationMethod) {
      form.setValue("notificationMethod", userData.notificationMethod || "email");
      form.setValue("allowEmailNotifications", userData.allowEmailNotifications ?? true);
      form.setValue("allowSmsNotifications", userData.allowSmsNotifications ?? false);
      form.setValue("allowWhatsappNotifications", userData.allowWhatsappNotifications ?? false);
    }
  }

  // Load user's notifications
  const { data: notifications = [] } = useQuery({
    queryKey: ['/api/notifications'],
    enabled: isAuthenticated,
  });

  const notificationsList = Array.isArray(notifications) ? notifications : [];

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const updateKeywordsMutation = useMutation({
    mutationFn: async (data: KeywordUpdateForm) => {
      return apiRequest("PUT", "/api/auth/update-keywords", {
        email: user?.email,
        keywords: keywords.join(", "),
        notificationMethod: data.notificationMethod,
        allowEmailNotifications: data.allowEmailNotifications,
        allowSmsNotifications: data.allowSmsNotifications,
        allowWhatsappNotifications: data.allowWhatsappNotifications,
      });
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated!",
        description: "Your notification preferences have been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "There was an error updating your settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmitKeywords = (data: KeywordUpdateForm) => {
    updateKeywordsMutation.mutate(data);
  };

  if (!isAuthenticated) {
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
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Access Required</CardTitle>
              <CardDescription>
                Please log in to access your buyer dashboard.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (user?.userType !== 'buyer') {
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
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Buyer Access Only</CardTitle>
              <CardDescription>
                This dashboard is only available for registered buyers.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

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
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <User className="h-8 w-8 text-orange-600" />
              <h1 className="text-3xl font-bold text-gray-800">Buyer Dashboard</h1>
            </div>
            <p className="text-lg text-gray-600">
              Welcome back, {user?.firstName}! Manage your notification preferences and track your activity.
            </p>
          </div>

          <Tabs defaultValue="keywords" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="keywords" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Keywords & Notifications
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Recent Notifications
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Profile Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="keywords" className="space-y-6">
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Bell className="h-6 w-6 text-orange-600" />
                    <CardTitle className="text-xl">Keyword Notifications</CardTitle>
                  </div>
                  <CardDescription>
                    Manage your keywords to receive notifications when relevant deals are posted.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitKeywords)} className="space-y-6">
                      
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

                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        disabled={updateKeywordsMutation.isPending}
                        data-testid="button-update-keywords"
                      >
                        {updateKeywordsMutation.isPending ? "Updating..." : "Update Notification Settings"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Mail className="h-6 w-6 text-blue-600" />
                    <CardTitle className="text-xl">Recent Notifications</CardTitle>
                  </div>
                  <CardDescription>
                    View your recent deal notifications and activity.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {notificationsList.length === 0 ? (
                    <div className="text-center py-8">
                      <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">No notifications yet</h3>
                      <p className="text-gray-500">
                        You'll see notifications here when deals matching your keywords are posted.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {notificationsList.map((notification: any) => (
                        <div key={notification.id} className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-blue-800">{notification.title}</h4>
                              <p className="text-blue-700 mt-1">{notification.message}</p>
                              <p className="text-blue-600 text-sm mt-2">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <Badge className="bg-red-100 text-red-800">New</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Settings className="h-6 w-6 text-gray-600" />
                    <CardTitle className="text-xl">Profile Information</CardTitle>
                  </div>
                  <CardDescription>
                    View and manage your account information.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-700 font-semibold">Name</Label>
                      <p className="text-gray-600 mt-1">{user?.firstName} {user?.lastName}</p>
                    </div>
                    <div>
                      <Label className="text-gray-700 font-semibold">Email</Label>
                      <p className="text-gray-600 mt-1">{user?.email}</p>
                    </div>
                    <div>
                      <Label className="text-gray-700 font-semibold">Mobile</Label>
                      <p className="text-gray-600 mt-1">{user?.mobile || "Not provided"}</p>
                    </div>
                    <div>
                      <Label className="text-gray-700 font-semibold">Province</Label>
                      <p className="text-gray-600 mt-1">{user?.province || "Not provided"}</p>
                    </div>
                    <div>
                      <Label className="text-gray-700 font-semibold">Account Type</Label>
                      <p className="text-gray-600 mt-1 capitalize">{user?.userType}</p>
                    </div>
                    <div>
                      <Label className="text-gray-700 font-semibold">Member Since</Label>
                      <p className="text-gray-600 mt-1">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}