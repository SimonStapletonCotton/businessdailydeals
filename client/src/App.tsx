import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import HotDeals from "@/pages/hot-deals";
import RegularDeals from "@/pages/regular-deals";
import FindMeDeal from "@/pages/find-me-deal";
import SupplierDashboard from "@/pages/supplier-dashboard";
import PostDeal from "@/pages/post-deal";
import MyCoupons from "@/pages/my-coupons";
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
import SupplierAnalytics from "@/pages/supplier-analytics";
import SuppliersDirectory from "@/pages/suppliers-directory";
import Support from "@/pages/support";
import TermsOfService from "@/pages/terms-of-service";
import PrivacyPolicy from "@/pages/privacy-policy";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

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
      <Route path="/register-buyer" component={BuyerRegistration} />
      <Route path="/register-supplier" component={SupplierRegistration} />
      <Route path="/suppliers-directory" component={SuppliersDirectory} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/credits" component={CreditsPage} />
      
      {/* Authentication-based routing */}
      {isLoading ? (
        <Route path="/" component={Landing} />
      ) : isAuthenticated ? (
        <>
          <Route path="/" component={Home} />
          <Route path="/hot-deals" component={HotDeals} />
          <Route path="/supplier-dashboard" component={SupplierDashboard} />
          <Route path="/supplier-analytics" component={SupplierAnalytics} />
          <Route path="/post-deal" component={PostDeal} />
          <Route path="/my-coupons" component={MyCoupons} />
          <Route path="/credits" component={CreditsPage} />
        </>
      ) : (
        <Route path="/" component={Landing} />
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
