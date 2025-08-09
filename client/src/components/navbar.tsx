import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, User, Menu, Ticket, Search, CreditCard, Building2, Home, UserPlus, ShoppingBag, HelpCircle, Mail, Coins, BarChart3 } from "lucide-react";
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

  const handleLogout = async () => {
    try {
      // Call logout endpoint
      const response = await fetch("/api/logout", {
        method: "GET",
        credentials: "include"
      });
      
      // Force refresh to clear all client-side state
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: try direct redirect
      window.location.href = "/api/logout";
    }
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      <Link href="/">
        <Button
          variant={location === "/" ? "secondary" : "ghost"}
          className={mobile ? "w-full justify-start" : "text-sm font-medium text-white hover:text-slate-900 hover:bg-white/20"}
          data-testid="link-home"
          onClick={mobile ? () => setMobileMenuOpen(false) : undefined}
        >
          <Home className="h-4 w-4 mr-2" />
          Home/HOT deals
        </Button>
      </Link>

      <Link href="/register-supplier">
        <Button
          variant="ghost"
          className={mobile ? "w-full justify-start" : "text-sm font-medium text-white hover:text-slate-900 hover:bg-white/20"}
          data-testid="link-register-supplier"
          onClick={mobile ? () => setMobileMenuOpen(false) : undefined}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Register as SUPPLIER
        </Button>
      </Link>
      <Link href="/register-buyer">
        <Button
          variant="ghost"
          className={mobile ? "w-full justify-start" : "text-sm font-medium text-white hover:text-slate-900 hover:bg-white/20"}
          data-testid="link-register-buyer"
          onClick={mobile ? () => setMobileMenuOpen(false) : undefined}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Register as BUYER
        </Button>
      </Link>
      
      <Link href="/regular-deals">
        <Button
          variant={location === "/regular-deals" ? "secondary" : "ghost"}
          className={mobile ? "w-full justify-start" : "text-sm font-medium text-white hover:text-slate-900 hover:bg-white/20 whitespace-nowrap flex-shrink-0"}
          data-testid="link-regular-deals"
          onClick={mobile ? () => setMobileMenuOpen(false) : undefined}
        >
          <Ticket className="h-4 w-4 mr-2" />
          REGULAR deals
        </Button>
      </Link>

      {isAuthenticated && (user as UserType)?.userType === "supplier" && (
        <>
          <Link href="/supplier-dashboard">
            <Button
              variant={location === "/supplier-dashboard" ? "secondary" : "ghost"}
              className={mobile ? "w-full justify-start" : "text-sm font-medium text-white hover:text-slate-900 hover:bg-white/20"}
              data-testid="link-supplier-dashboard"
              onClick={mobile ? () => setMobileMenuOpen(false) : undefined}
            >
              <Building2 className="h-4 w-4 mr-2" />
              Supplier dashboard
            </Button>
          </Link>
          <Link href="/supplier-analytics">
            <Button
              variant={location === "/supplier-analytics" ? "secondary" : "ghost"}
              className={mobile ? "w-full justify-start" : "text-sm font-medium text-white hover:text-slate-900 hover:bg-white/20"}
              data-testid="link-supplier-analytics"
              onClick={mobile ? () => setMobileMenuOpen(false) : undefined}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics & Reports
            </Button>
          </Link>
        </>
      )}

      <Link href="/suppliers-directory">
        <Button
          variant={location === "/suppliers-directory" ? "secondary" : "ghost"}
          className={mobile ? "w-full justify-start" : "text-sm font-medium text-white hover:text-slate-900 hover:bg-white/20"}
          data-testid="link-suppliers-directory"
          onClick={mobile ? () => setMobileMenuOpen(false) : undefined}
        >
          <Building2 className="h-4 w-4 mr-2" />
          Suppliers Directory
        </Button>
      </Link>
      
      <Link href="/about">
        <Button
          variant={location === "/about" ? "secondary" : "ghost"}
          className={mobile ? "w-full justify-start" : "text-sm font-medium text-white hover:text-slate-900 hover:bg-white/20"}
          data-testid="link-about"
          onClick={mobile ? () => setMobileMenuOpen(false) : undefined}
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          About Us
        </Button>
      </Link>
      
      <Link href="/rates-management">
        <Button
          variant={location === "/rates-management" ? "secondary" : "ghost"}
          className={mobile ? "w-full justify-start" : "text-sm font-medium text-white hover:text-slate-900 hover:bg-white/20"}
          data-testid="link-rates"
          onClick={mobile ? () => setMobileMenuOpen(false) : undefined}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Rates per Advert
        </Button>
      </Link>
      
      {isAuthenticated && (user as UserType)?.userType === "supplier" && (
        <Link href="/credits">
          <Button
            variant={location === "/credits" ? "secondary" : "ghost"}
            className={mobile ? "w-full justify-start" : "text-sm font-medium text-white hover:text-slate-900 hover:bg-white/20"}
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
            variant={location === "/my-coupons" ? "secondary" : "ghost"}
            className={mobile ? "w-full justify-start" : "text-sm font-medium text-white hover:text-slate-900 hover:bg-white/20"}
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
          variant={location === "/contact" ? "secondary" : "ghost"}
          className={mobile ? "w-full justify-start" : "text-sm font-medium text-white hover:text-slate-900 hover:bg-white/20"}
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
    <header 
      className="bg-slate-600 shadow-lg border-b border-slate-800"
      style={{
        width: '100%',
        minWidth: '100%',
        position: 'relative'
      }}
    >
      <div className="px-4 sm:px-6 lg:px-8" style={{ width: '100%', overflowX: 'auto' }}>
        <div className="flex justify-between items-center h-16" style={{ minWidth: '1200px' }}>
            <div className="flex items-center space-x-4 flex-1">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-xl md:text-2xl font-bold text-white cursor-pointer whitespace-nowrap" data-testid="text-logo">
                Business Daily Deals
              </h1>
            </Link>
            <nav className="hidden md:flex space-x-2 flex-1 justify-start ml-8">
              <div className="flex space-x-2 whitespace-nowrap">
                <NavLinks />
              </div>
            </nav>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:text-slate-900 hover:bg-white/20" data-testid="button-mobile-menu">
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
                    <SelectTrigger className="w-40 lg:w-48 bg-white/10 border-white/20 text-white hover:bg-white/20" data-testid="select-user-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buyer">Switch to Buyer</SelectItem>
                      <SelectItem value="supplier">Switch to Supplier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="ghost" size="icon" className="relative text-white hover:text-slate-900 hover:bg-white/20" data-testid="button-notifications">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="notification-badge" data-testid="badge-notification-count">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>

                {(user as UserType)?.userType === "supplier" && (
                  <Link href="/post-deal">
                    <Button className="bg-white text-slate-600 hover:bg-white/90 hover:text-slate-700 font-medium" data-testid="button-post-deal">
                      <Plus className="h-4 w-4 mr-2" />
                      Post Deal
                    </Button>
                  </Link>
                )}

                <Button 
                  variant="ghost" 
                  className="text-white hover:text-slate-900 hover:bg-white/20 px-3" 
                  onClick={handleLogout} 
                  data-testid="button-logout"
                  title="Logout"
                >
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden lg:inline">Logout</span>
                </Button>
              </>
            )}

            {!isAuthenticated && (
              <Button
                className="bg-white text-slate-600 hover:bg-white/90 hover:text-slate-700 font-medium"
                onClick={() => (window.location.href = "/api/login")}
                data-testid="button-login"
              >
                <User className="h-4 w-4 mr-2" />
                Login to Access Deals
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
