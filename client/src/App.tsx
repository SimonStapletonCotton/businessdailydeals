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
import BuyerDashboard from "@/pages/buyer-dashboard";
import PostDeal from "@/pages/post-deal";
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
          <Route path="/buyer-dashboard" component={BuyerDashboard} />
          <Route path="/post-deal" component={PostDeal} />
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
