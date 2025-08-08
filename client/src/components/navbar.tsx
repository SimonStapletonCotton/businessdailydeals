import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, User, Menu, Ticket, DollarSign, Search, CreditCard, Building2, Home, UserPlus, ShoppingBag, HelpCircle, Mail, Coins } from "lucide-react";
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

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      <Link href="/">
        <Button
          variant={location === "/" ? "default" : "ghost"}
          className={mobile ? "w-full justify-start" : "text-sm font-medium"}
          data-testid="link-home"
          onClick={mobile ? () => setMobileMenuOpen(false) : undefined}
        >
          <Home className="h-4 w-4 mr-2" />
          Home / How Site Works
        </Button>
      </Link>
      
      {!isAuthenticated ? (
        <>
          <Button
            variant="ghost"
            className={mobile ? "w-full justify-start" : "text-sm font-medium"}
            data-testid="link-register-supplier"
            onClick={() => {
              window.location.href = "/api/login";
              if (mobile) setMobileMenuOpen(false);
            }}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Register as SUPPLIER
          </Button>
          <Button
            variant="ghost"
            className={mobile ? "w-full justify-start" : "text-sm font-medium"}
            data-testid="link-register-buyer"
            onClick={() => {
              window.location.href = "/api/login";
              if (mobile) setMobileMenuOpen(false);
            }}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Register as BUYER
          </Button>
        </>
      ) : null}

      <Link href="/search">
        <Button
          variant={location === "/search" ? "default" : "ghost"}
          className={mobile ? "w-full justify-start" : "text-sm font-medium"}
          data-testid="link-search"
          onClick={mobile ? () => setMobileMenuOpen(false) : undefined}
        >
          <Search className="h-4 w-4 mr-2" />
          Find Me a Deal
        </Button>
      </Link>
      
      <Link href="/regular-deals">
        <Button
          variant={location === "/regular-deals" ? "default" : "ghost"}
          className={mobile ? "w-full justify-start" : "text-sm font-medium"}
          data-testid="link-regular-deals"
          onClick={mobile ? () => setMobileMenuOpen(false) : undefined}
        >
          <Ticket className="h-4 w-4 mr-2" />
          Regular Deals
        </Button>
      </Link>

      {isAuthenticated && (user as UserType)?.userType === "supplier" && (
        <Link href="/supplier-dashboard">
          <Button
            variant={location === "/supplier-dashboard" ? "default" : "ghost"}
            className={mobile ? "w-full justify-start" : "text-sm font-medium"}
            data-testid="link-supplier-dashboard"
            onClick={mobile ? () => setMobileMenuOpen(false) : undefined}
          >
            Supplier Dashboard
          </Button>
        </Link>
      )}
      
      <Link href="/rates-management">
        <Button
          variant={location === "/rates-management" ? "default" : "ghost"}
          className={mobile ? "w-full justify-start" : "text-sm font-medium"}
          data-testid="link-rates"
          onClick={mobile ? () => setMobileMenuOpen(false) : undefined}
        >
          <DollarSign className="h-4 w-4 mr-2" />
          Rates per Advert
        </Button>
      </Link>
      
      {isAuthenticated && (user as UserType)?.userType === "supplier" && (
        <Link href="/credits">
          <Button
            variant={location === "/credits" ? "default" : "ghost"}
            className={mobile ? "w-full justify-start" : "text-sm font-medium"}
            data-testid="link-my-credits"
            onClick={mobile ? () => setMobileMenuOpen(false) : undefined}
          >
            <Coins className="h-4 w-4 mr-2" />
            My Credits
          </Button>
        </Link>
      )}
      
      {isAuthenticated && (user as UserType)?.userType === "buyer" && (
        <Link href="/my-coupons">
          <Button
            variant={location === "/my-coupons" ? "default" : "ghost"}
            className={mobile ? "w-full justify-start" : "text-sm font-medium"}
            data-testid="link-my-coupons"
            onClick={mobile ? () => setMobileMenuOpen(false) : undefined}
          >
            <Ticket className="h-4 w-4 mr-2" />
            Coupons Downloaded
          </Button>
        </Link>
      )}
      
      <Link href="/contact">
        <Button
          variant={location === "/contact" ? "default" : "ghost"}
          className={mobile ? "w-full justify-start" : "text-sm font-medium"}
          data-testid="link-contact"
          onClick={mobile ? () => setMobileMenuOpen(false) : undefined}
        >
          <Mail className="h-4 w-4 mr-2" />
          Contact Us
        </Button>
      </Link>
    </>
  );

  return (
    <header className="bg-white shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <h1 className="text-2xl font-bold text-primary cursor-pointer" data-testid="text-logo">
                Business Daily Deals
              </h1>
            </Link>
            <nav className="hidden md:flex space-x-2">
              <NavLinks />
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <div className="flex flex-col space-y-4 mt-8">
                    <div className="text-lg font-semibold text-slate-900 mb-4">Navigation</div>
                    <div className="flex flex-col space-y-2">
                      <NavLinks mobile={true} />
                    </div>
                    
                    {isAuthenticated && (
                      <>
                        <div className="border-t pt-4 mt-6">
                          <div className="text-sm font-medium text-slate-700 mb-3">Account Settings</div>
                          <Select
                            value={(user as UserType)?.userType || "buyer"}
                            onValueChange={handleUserTypeChange}
                          >
                            <SelectTrigger className="w-full mb-3" data-testid="select-user-type-mobile">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="buyer">Switch to Buyer</SelectItem>
                              <SelectItem value="supplier">Switch to Supplier</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <div className="flex flex-col space-y-2">
                            <Button variant="ghost" className="justify-start" data-testid="button-notifications-mobile">
                              <Bell className="h-4 w-4 mr-2" />
                              Notifications
                              {unreadCount > 0 && (
                                <Badge className="ml-auto" data-testid="badge-notification-count-mobile">
                                  {unreadCount}
                                </Badge>
                              )}
                            </Button>
                            
                            {(user as UserType)?.userType === "supplier" && (
                              <Link href="/post-deal">
                                <Button className="w-full bg-accent hover:bg-accent/90" onClick={() => setMobileMenuOpen(false)} data-testid="button-post-deal-mobile">
                                  <Plus className="h-4 w-4 mr-2" />
                                  Post Deal
                                </Button>
                              </Link>
                            )}
                            
                            <Button variant="ghost" className="justify-start" onClick={handleLogout} data-testid="button-logout-mobile">
                              <User className="h-4 w-4 mr-2" />
                              Logout
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {!isAuthenticated && (
                      <div className="border-t pt-4 mt-6">
                        <Button
                          className="w-full"
                          onClick={() => (window.location.href = "/api/login")}
                          data-testid="button-login-mobile"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Login
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
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
