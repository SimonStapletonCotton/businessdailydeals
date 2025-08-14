import { useQuery } from "@tanstack/react-query";
import { type User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/user"],
    retry: false,
    staleTime: 0, // Always fresh to catch auth state changes immediately
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: false, // Don't auto-refetch to avoid spam
  });

  const isAuthenticated = !!user && !error;
  
  // Debug logging to help track auth state
  console.log("Auth State:", { user: !!user, error: !!error, isAuthenticated, loading: isLoading });

  return {
    user: user as User | undefined,
    isLoading,
    isAuthenticated,
    error
  };
}
