import { useEffect } from "react";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, ArrowRight, TrendingUp, Users, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

// FINAL HOMEPAGE - CLEAR VISUAL DISTINCTION
const FINAL_VERSION = "HOMEPAGE-FINAL-" + Date.now();
console.log("🎯 FINAL HOMEPAGE VERSION LOADING:", FINAL_VERSION);

export default function HomepageFinal() {
  useEffect(() => {
    document.title = "FEBRUARY 20TH 2026 FREE PROMO - Business Daily Deals";
    console.log("🚀 FINAL HOMEPAGE: February 20th, 2026 promotional period IS ACTIVE");
    console.log("🎯 HOMEPAGE THEME: Purple/Pink - should be unmistakable");
    
    // Add visual debug info to page
    const debugDiv = document.createElement('div');
    debugDiv.style.cssText = 'position:fixed;top:0;right:0;background:red;color:white;padding:10px;z-index:9999;font-size:14px;';
    debugDiv.textContent = `FINAL HOMEPAGE LOADED: ${new Date().toLocaleTimeString()}`;
    document.body.appendChild(debugDiv);
    
    // Clear browser cache aggressively
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
  }, []);

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    staleTime: 0,
  });

  const { data: hotDeals } = useQuery({
    queryKey: ["/api/deals", "hot"],
    staleTime: 0,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-100 to-blue-200">
      <Navbar />
      
      {/* UNMISTAKABLE VISUAL CHANGE - PURPLE THEME */}
      <div className="bg-purple-700 text-white text-center py-12 mb-8 border-8 border-yellow-400 shadow-2xl">
        <div className="text-5xl font-bold mb-4">🎉 FREE PROMOTIONAL PERIOD ACTIVE! 🎉</div>
        <div className="text-3xl font-bold">
          ALL DEAL POSTING IS FREE UNTIL FEBRUARY 20TH, 2026!
        </div>
        <div className="text-xl mt-4 bg-yellow-400 text-purple-800 px-6 py-2 rounded-full inline-block font-bold">
          NO COST • NO FEES • START TODAY!
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-bold text-purple-800 mb-6 leading-tight">
            Business Daily <span className="text-pink-600">Deals</span>
          </h1>
          <p className="text-2xl md:text-3xl text-purple-700 mb-8 max-w-4xl mx-auto leading-relaxed">
            South Africa's Premier B2B Marketplace - COMPLETELY FREE UNTIL FEBRUARY 20TH, 2026!
          </p>
          
          {/* SECONDARY BANNER - DIFFERENT COLOR */}
          <div className="bg-pink-600 text-white p-8 rounded-xl mb-8 max-w-5xl mx-auto shadow-2xl border-4 border-pink-700">
            <div className="text-4xl font-bold mb-3">🚀 LIMITED TIME OFFER! 🚀</div>
            <div className="text-2xl">
              <strong>Post unlimited deals FREE until February 20th, 2026!</strong>
            </div>
            <div className="text-lg mt-3 opacity-90">
              Build your customer base during our promotional launch period
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link href="/register-supplier">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-5 text-xl font-bold shadow-xl transform hover:scale-105 transition-all duration-200">
                Start Selling FREE Today
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
            <Link href="/hot-deals">
              <Button size="lg" variant="outline" className="border-purple-600 text-purple-700 hover:bg-purple-50 px-10 py-5 text-xl font-bold shadow-xl transform hover:scale-105 transition-all duration-200">
                <Flame className="mr-3 h-6 w-6" />
                Browse Hot Deals
              </Button>
            </Link>
          </div>
        </div>

        {/* Business Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <Card className="text-center bg-white/95 backdrop-blur-sm shadow-2xl border-purple-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-4xl font-bold text-purple-600">
                {(stats as any)?.activeSuppliers || "1"}
              </CardTitle>
              <CardDescription className="text-purple-700 font-semibold text-lg">Active Suppliers</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center bg-white/95 backdrop-blur-sm shadow-2xl border-purple-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-4xl font-bold text-purple-600">
                {(stats as any)?.totalDeals || "13"}
              </CardTitle>
              <CardDescription className="text-purple-700 font-semibold text-lg">Total Deals</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center bg-white/95 backdrop-blur-sm shadow-2xl border-purple-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-4xl font-bold text-purple-600">
                {(stats as any)?.successfulConnections || "01"}
              </CardTitle>
              <CardDescription className="text-purple-700 font-semibold text-lg">Successful Connections</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center bg-white/95 backdrop-blur-sm shadow-2xl border-purple-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-4xl font-bold text-purple-600">
                R{(stats as any)?.totalSavings?.toLocaleString() || '10,023'}
              </CardTitle>
              <CardDescription className="text-purple-700 font-semibold text-lg">Total Savings</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Featured Hot Deals */}
        {hotDeals && Array.isArray(hotDeals) && hotDeals.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-bold text-purple-800 flex items-center gap-3">
                <Flame className="h-10 w-10 text-pink-600" />
                Featured Hot Deals
              </h2>
              <Link href="/hot-deals">
                <Button variant="outline" className="border-purple-600 text-purple-700 hover:bg-purple-50 text-lg px-6 py-3">
                  View All Deals
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotDeals.slice(0, 6).map((deal: any) => (
                <Card key={deal.id} className="bg-white/95 backdrop-blur-sm shadow-2xl border-purple-300 hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className="bg-purple-600 text-white font-semibold text-sm px-3 py-1">HOT DEAL</Badge>
                      <Badge variant="outline" className="border-green-600 text-green-700 text-sm px-3 py-1">
                        Save R{deal.savings?.toLocaleString() || '0'}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-purple-800 line-clamp-2">
                      {deal.title}
                    </CardTitle>
                    <CardDescription className="text-purple-600 font-medium">
                      {deal.companyName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-700 line-clamp-2 mb-4">
                      {deal.description}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-3xl font-bold text-purple-600">R{deal.price}</span>
                        {deal.originalPrice && (
                          <span className="text-lg text-purple-500 line-through ml-2">R{deal.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    <Link href={`/coupon/${deal.id}`}>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-3">
                        Get Deal
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-purple-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-pink-400">Business Daily Deals</h3>
              <p className="text-purple-300 leading-relaxed text-lg">
                South Africa's premier B2B marketplace - completely FREE during our promotional period until February 20th, 2026!
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-6 text-pink-400">Quick Links</h4>
              <div className="space-y-3">
                <Link href="/hot-deals" className="block text-purple-300 hover:text-pink-400 transition-colors text-lg">Hot Deals</Link>
                <Link href="/suppliers-directory" className="block text-purple-300 hover:text-pink-400 transition-colors text-lg">Suppliers Directory</Link>
                <Link href="/find-me-deal" className="block text-purple-300 hover:text-pink-400 transition-colors text-lg">Find Me a Deal</Link>
                <Link href="/pricing" className="block text-purple-300 hover:text-pink-400 transition-colors text-lg">Pricing</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-6 text-pink-400">Support</h4>
              <div className="space-y-3">
                <Link href="/support" className="block text-purple-300 hover:text-pink-400 transition-colors text-lg">Help Center</Link>
                <Link href="/contact" className="block text-purple-300 hover:text-pink-400 transition-colors text-lg">Contact Us</Link>
                <Link href="/about" className="block text-purple-300 hover:text-pink-400 transition-colors text-lg">About Us</Link>
                <Link href="/terms-of-service" className="block text-purple-300 hover:text-pink-400 transition-colors text-lg">Terms of Service</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-6 text-pink-400">Promotional Period</h4>
              <div className="space-y-3 text-purple-300">
                <p className="text-lg">South African B2B Marketplace</p>
                <p className="text-lg">Credit System: 1 Credit = R2.50</p>
                <p className="font-bold text-yellow-400 text-xl">FREE until February 20th, 2026!</p>
              </div>
            </div>
          </div>
          <div className="border-t border-purple-700 mt-12 pt-8 text-center text-purple-300">
            <p className="text-lg">&copy; 2025 Business Daily Deals. All rights reserved. FREE promotional period until February 20th, 2026!</p>
          </div>
        </div>
      </footer>
    </div>
  );
}