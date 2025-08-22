import { useQuery } from "@tanstack/react-query";
import { type User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/user"],
    retry: false,
    staleTime: 30000, // Keep data fresh for 30 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const isAuthenticated = !!user && !error;

  return {
    user: user as User | undefined,
    isLoading,
    isAuthenticated,
    error
  };
}
