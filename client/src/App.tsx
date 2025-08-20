import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { forceHomeRoute, clearRouteCache } from "@/utils/forceHomeRoute";
import Landing from "@/pages/landing";
import HomeFeb from "@/pages/home-february";
import HomeUltimate from "@/pages/home-ultimate"; // Force February 2026 display
import HomeFixed from "@/pages/home-fixed"; // Cache-busting fixed homepage
import HomeProduction from "@/pages/home-production"; // Production cache-buster
import HomeFresh from "@/pages/home-fresh"; // Fresh cache-busted homepage
import HomepageFinal from "@/pages/homepage-final"; // Final visual distinct homepage
import NewHomepage from "@/pages/new-homepage"; // Brand new route to bypass all caching
import CybersmartHomepage from "@/pages/cybersmart-homepage"; // Production casino-themed homepage
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
import CouponVerification from "@/pages/coupon-verification";
import TestDashboard from "@/pages/test-dashboard";
import WorkingHome from "@/pages/working-home";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  // Simple home route preference - only on initial load
  useEffect(() => {
    // Only force home on direct refresh to hot-deals (not user navigation)
    const currentPath = window.location.pathname;
    const isDirectAccess = !document.referrer || document.referrer === window.location.origin + '/';
    
    if (currentPath === '/hot-deals' && isDirectAccess) {
      console.log('Direct access to hot-deals detected, redirecting to home');
      setLocation('/');
    } else {
      console.log('Router state - Location:', location, 'URL:', window.location.pathname);
    }
  }, [setLocation]); // Remove location dependency to prevent infinite loops

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
      <Route path="/coupon-verification" component={CouponVerification} />
      <Route path="/test-dashboard" component={TestDashboard} />
      <Route path="/working-home" component={WorkingHome} />
      <Route path="/new" component={NewHomepage} />
      
      {/* FORCE CASINO-THEMED HOMEPAGE ON ALL ROUTES - BYPASS ALL CACHING */}
      <Route path="/" component={CybersmartHomepage} />
      <Route path="/home" component={CybersmartHomepage} />
      <Route path="/home-ultimate" component={NewHomepage} />
      <Route path="/old-home" component={NewHomepage} />
      <Route path="/landing" component={NewHomepage} />
      <Route path="/home-fixed" component={NewHomepage} />
      <Route path="/index.html" component={NewHomepage} />
      <Route path="/index" component={NewHomepage} />
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
