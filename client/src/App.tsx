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
import SupplierDashboard from "@/pages/supplier-dashboard";
import PostDeal from "@/pages/post-deal";
import MyCoupons from "@/pages/my-coupons";
import Pricing from "@/pages/pricing";
import RatesManagement from "@/pages/rates-management";
import SearchPage from "@/pages/search";
import CreditsPage from "@/pages/credits";
import ProductDirectoryPage from "@/pages/product-directory";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/hot-deals" component={HotDeals} />
          <Route path="/regular-deals" component={RegularDeals} />
          <Route path="/supplier-dashboard" component={SupplierDashboard} />
          <Route path="/post-deal" component={PostDeal} />
          <Route path="/my-coupons" component={MyCoupons} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/rates-management" component={RatesManagement} />
          <Route path="/search" component={SearchPage} />
          <Route path="/credits" component={CreditsPage} />
          <Route path="/directory" component={ProductDirectoryPage} />
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
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
