import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, X, Tags, BellRing, Handshake } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Keyword } from "@shared/schema";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function KeywordNotifications() {
  const { toast } = useToast();
  const [newKeyword, setNewKeyword] = useState("");
  const [email, setEmail] = useState("");

  const { data: keywords, isLoading } = useQuery({
    queryKey: ["/api/keywords"],
  });

  const addKeywordMutation = useMutation({
    mutationFn: async (keyword: string) => {
      await apiRequest("POST", "/api/keywords", { keyword });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/keywords"] });
      setNewKeyword("");
      toast({
        title: "Keyword Added",
        description: "You'll be notified when deals match this keyword.",
      });
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
        description: "Failed to add keyword. Please try again.",
        variant: "destructive",
      });
    },
  });

  const removeKeywordMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/keywords/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/keywords"] });
      toast({
        title: "Keyword Removed",
        description: "You'll no longer receive notifications for this keyword.",
      });
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
        description: "Failed to remove keyword. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      addKeywordMutation.mutate(newKeyword.trim());
    }
  };

  const handleRemoveKeyword = (id: string) => {
    removeKeywordMutation.mutate(id);
  };

  const handleNotificationSignup = () => {
    if (email.trim()) {
      toast({
        title: "Email Registered",
        description: "You'll receive email notifications for matching deals.",
      });
      setEmail("");
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-slate-900 flex items-center justify-center">
          <Bell className="text-accent mr-3" />
          Never Miss a Deal
        </CardTitle>
        <p className="text-muted-foreground">
          Set up keyword notifications and get alerted when suppliers post deals matching your interests
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tags className="text-primary text-2xl" />
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Set Keywords</h4>
            <p className="text-sm text-muted-foreground">
              Add specific product keywords or categories you're interested in
            </p>
          </div>
          <div className="text-center">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BellRing className="text-accent text-2xl" />
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Get Notified</h4>
            <p className="text-sm text-muted-foreground">
              Receive instant alerts when matching deals are posted
            </p>
          </div>
          <div className="text-center">
            <div className="bg-success/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Handshake className="text-success text-2xl" />
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Connect & Save</h4>
            <p className="text-sm text-muted-foreground">
              Connect directly with suppliers and secure exclusive deals
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Your Keywords</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {isLoading ? (
                <p className="text-muted-foreground">Loading keywords...</p>
              ) : keywords && keywords.length > 0 ? (
                keywords.map((keyword: Keyword) => (
                  <Badge
                    key={keyword.id}
                    variant="secondary"
                    className="flex items-center gap-2"
                    data-testid={`badge-keyword-${keyword.id}`}
                  >
                    {keyword.keyword}
                    <button
                      onClick={() => handleRemoveKeyword(keyword.id)}
                      className="hover:text-destructive"
                      data-testid={`button-remove-keyword-${keyword.id}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground">No keywords added yet</p>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Enter a keyword (e.g., office equipment, laptops)"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddKeyword()}
                data-testid="input-new-keyword"
              />
              <Button
                onClick={handleAddKeyword}
                disabled={!newKeyword.trim() || addKeywordMutation.isPending}
                data-testid="button-add-keyword"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Email Notifications</h4>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleNotificationSignup()}
                className="flex-1"
                data-testid="input-notification-email"
              />
              <Button
                onClick={handleNotificationSignup}
                disabled={!email.trim()}
                data-testid="button-start-notifications"
              >
                Start Notifications
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
