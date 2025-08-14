import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const simpleLoginMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/simple-login', {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Login Successful",
        description: "Welcome to Business Daily Deals!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      window.location.href = "/supplier-dashboard";
    },
    onError: () => {
      toast({
        title: "Login Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  });

  const debugLoginMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/debug/auth', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Debug login failed');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Debug Login Successful",
        description: "Test account authenticated!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      window.location.href = "/supplier-dashboard";
    },
    onError: () => {
      toast({
        title: "Debug Login Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-slate-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Business Daily Deals</CardTitle>
          <p className="text-center text-gray-600">Login to access your marketplace</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full" 
            onClick={() => simpleLoginMutation.mutate()}
            disabled={simpleLoginMutation.isPending}
            data-testid="button-simple-login"
          >
            {simpleLoginMutation.isPending ? "Logging in..." : "Quick Login (Test Account)"}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => debugLoginMutation.mutate()}
            disabled={debugLoginMutation.isPending}
            data-testid="button-debug-login"
          >
            {debugLoginMutation.isPending ? "Logging in..." : "Debug Login"}
          </Button>
          
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={() => window.location.href = "/api/login"}
            data-testid="button-oauth-login"
          >
            Official Login (Replit OAuth)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}