import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { forceHomeRoute, clearRouteCache } from "@/utils/forceHomeRoute";
import Landing from "@/pages/landing";
import Home from "@/pages/home-comprehensive";
import HotDeals from "@/pages/hot-deals";
import RegularDeals from "@/pages/regular-deals";
import FindMeDeal from "@/pages/find-me-deal";
import SupplierDashboard from "@/pages/supplier-dashboard";
import PostDeal from "@/pages/post-deal";
import MyCoupons from "@/pages/my-coupons";
import CouponPage from "@/pages/coupon";
import Pricing from "@/pages/pricing";
import RatesManagement from "@/pages/rates-management";
import Rates from "@/pages/rates";
import SearchPage from "@/pages/search";
import CreditsPage from "@/pages/credits";
import ProductDirectoryPage from "@/pages/product-directory";
import ContactPage from "@/pages/contact";
import AboutPage from "@/pages/about";
import BuyerRegistration from "@/pages/buyer-registration";
import SupplierRegistration from "@/pages/supplier-registration";
import ManageKeywords from "@/pages/manage-keywords";
import SupplierAnalytics from "@/pages/supplier-analytics";
import BuyerDashboard from "@/pages/buyer-dashboard";
import SuppliersDirectory from "@/pages/suppliers-directory";
import Support from "@/pages/support";
import TermsOfService from "@/pages/terms-of-service";
import PrivacyPolicy from "@/pages/privacy-policy";
import ColorSwatches from "@/pages/color-swatches";
import LiveCoupons from "@/pages/live-coupons";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  // AGGRESSIVE HOME ROUTE ENFORCEMENT 
  useEffect(() => {
    const currentPath = window.location.pathname;
    
    // Force home on any refresh or direct access to hot-deals
    if (currentPath === '/hot-deals' || (currentPath === '/' && location === '/hot-deals')) {
      console.log('FORCED HOME: Redirecting from', currentPath, 'to home');
      window.history.replaceState({}, '', '/');
      setLocation('/');
      clearRouteCache();
    }
    
    forceHomeRoute();
    console.log('Router state - Location:', location, 'URL:', window.location.pathname);
  }, [location, setLocation]);

  // Monitor for refresh attempts to hot deals
  useEffect(() => {
    const handleBeforeUnload = () => {
      // If user is on hot-deals and refreshes, force home next time
      if (location === '/hot-deals') {
        localStorage.setItem('force-home-on-load', 'true');
      }
    };

    const handleLoad = () => {
      // Check if we should force home
      if (localStorage.getItem('force-home-on-load') === 'true') {
        localStorage.removeItem('force-home-on-load');
        window.history.replaceState({}, '', '/');
        setLocation('/');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', handleLoad);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
    };
  }, [location, setLocation]);

  return (
    <Switch>
      {/* Public routes available to everyone */}
      <Route path="/rates-management" component={Rates} />
      <Route path="/regular-deals" component={RegularDeals} />
      <Route path="/find-me-deal" component={FindMeDeal} />
      <Route path="/search" component={SearchPage} />
      <Route path="/directory" component={ProductDirectoryPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/support" component={Support} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/color-swatches" component={ColorSwatches} />
      <Route path="/register-buyer" component={BuyerRegistration} />
      <Route path="/register-supplier" component={SupplierRegistration} />
      <Route path="/manage-keywords" component={ManageKeywords} />
      <Route path="/suppliers-directory" component={SuppliersDirectory} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/credits" component={CreditsPage} />
      <Route path="/coupon/:code" component={CouponPage} />
      <Route path="/live-coupons" component={LiveCoupons} />
      
      {/* Make core pages accessible to everyone - ensure home is first */}
      <Route path="/" component={Home} />
      <Route path="/home" component={Home} />
      <Route path="/hot-deals" component={HotDeals} />
      
      {/* Keep some features auth-protected */}
      {isAuthenticated && (
        <>
          <Route path="/supplier-dashboard" component={SupplierDashboard} />
          <Route path="/buyer-dashboard" component={BuyerDashboard} />
          <Route path="/supplier-analytics" component={SupplierAnalytics} />
          <Route path="/post-deal" component={PostDeal} />
          <Route path="/my-coupons" component={MyCoupons} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background overflow-x-auto" style={{ width: '100%', maxWidth: 'none' }}>
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
