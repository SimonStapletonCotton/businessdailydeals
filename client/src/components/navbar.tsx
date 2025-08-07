import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, User, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User as UserType } from "@shared/schema";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
    enabled: isAuthenticated,
  });

  const unreadCount = Array.isArray(notifications) ? notifications.filter((n: any) => !n.isRead).length : 0;

  const updateUserTypeMutation = useMutation({
    mutationFn: async (userType: string) => {
      await apiRequest("PATCH", "/api/user/type", { userType });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  const handleUserTypeChange = (userType: string) => {
    updateUserTypeMutation.mutate(userType);
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const NavLinks = () => (
    <>
      <Link href="/hot-deals">
        <Button
          variant={location === "/hot-deals" ? "default" : "ghost"}
          className="text-sm font-medium"
          data-testid="link-hot-deals"
        >
          Hot Deals
        </Button>
      </Link>
      <Link href="/regular-deals">
        <Button
          variant={location === "/regular-deals" ? "default" : "ghost"}
          className="text-sm font-medium"
          data-testid="link-regular-deals"
        >
          Regular Deals
        </Button>
      </Link>
      {(user as UserType)?.userType === "supplier" ? (
        <Link href="/supplier-dashboard">
          <Button
            variant={location === "/supplier-dashboard" ? "default" : "ghost"}
            className="text-sm font-medium"
            data-testid="link-supplier-dashboard"
          >
            Dashboard
          </Button>
        </Link>
      ) : (
        <Link href="/buyer-dashboard">
          <Button
            variant={location === "/buyer-dashboard" ? "default" : "ghost"}
            className="text-sm font-medium"
            data-testid="link-buyer-dashboard"
          >
            Dashboard
          </Button>
        </Link>
      )}
    </>
  );

  return (
    <header className="bg-white shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <h1 className="text-2xl font-bold text-primary cursor-pointer" data-testid="text-logo">
                Business Deals
              </h1>
            </Link>
            <nav className="hidden md:flex space-x-2">
              <NavLinks />
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <>
                <div className="hidden md:block">
                  <Select
                    value={(user as UserType)?.userType || "buyer"}
                    onValueChange={handleUserTypeChange}
                  >
                    <SelectTrigger className="w-48" data-testid="select-user-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buyer">Switch to Buyer</SelectItem>
                      <SelectItem value="supplier">Switch to Supplier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="notification-badge" data-testid="badge-notification-count">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>

                {(user as UserType)?.userType === "supplier" && (
                  <Link href="/post-deal">
                    <Button className="bg-accent hover:bg-accent/90" data-testid="button-post-deal">
                      <Plus className="h-4 w-4 mr-2" />
                      Post Deal
                    </Button>
                  </Link>
                )}

                <Button variant="ghost" size="icon" onClick={handleLogout} data-testid="button-logout">
                  <User className="h-5 w-5" />
                </Button>
              </>
            )}

            {!isAuthenticated && (
              <Button
                onClick={() => (window.location.href = "/api/login")}
                data-testid="button-login"
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="space-y-2">
                    <NavLinks />
                  </div>
                  {isAuthenticated && (
                    <div className="pt-4 border-t">
                      <Select
                        value={(user as UserType)?.userType || "buyer"}
                        onValueChange={handleUserTypeChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="buyer">Switch to Buyer</SelectItem>
                          <SelectItem value="supplier">Switch to Supplier</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
