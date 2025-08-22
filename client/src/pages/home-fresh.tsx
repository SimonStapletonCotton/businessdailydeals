import { useEffect } from "react";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, ArrowRight, TrendingUp, Users, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

// FRESH HOMEPAGE - NO CACHE - FEBRUARY 20TH 2026
const FRESH_TIMESTAMP = Date.now();
console.log("🆕 FRESH HOMEPAGE LOADED - FEBRUARY 20TH 2026:", FRESH_TIMESTAMP);

export default function HomeFresh() {
  useEffect(() => {
    document.title = "Business Daily Deals - FREE UNTIL FEBRUARY 20TH 2026";
    console.log("🎯 FRESH HOMEPAGE: February 20th, 2026 promotional period CONFIRMED ACTIVE");
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-slate-200">
      <Navbar />
      
      {/* MEGA BANNER - IMPOSSIBLE TO MISS */}
      <div className="bg-red-600 text-white text-center py-8 mb-8 border-8 border-yellow-400" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
        🎉 CONFIRMED: FREE DEAL POSTING UNTIL FEBRUARY 20TH, 2026! 🎉
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight">
            Business Daily <span className="text-orange-600">Deals</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            South Africa's Premier B2B Marketplace - Connecting Suppliers and Buyers with Exceptional Deals
          </p>
          
          {/* PROMOTIONAL BANNER - FEBRUARY 20TH 2026 */}
          <div className="bg-green-600 text-white p-6 rounded-xl mb-8 max-w-4xl mx-auto shadow-2xl border-4 border-green-700">
            <div className="text-3xl font-bold mb-2">🎉 FREE PROMOTIONAL PERIOD! 🎉</div>
            <div className="text-xl">
              <strong>All deal posting is completely FREE until February 20th, 2026!</strong>
            </div>
            <div className="text-lg mt-2 opacity-90">
              Start advertising your business today at no cost - Limited time offer!
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register-supplier">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200">
                Start Selling Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/hot-deals">
              <Button size="lg" variant="outline" className="border-orange-600 text-orange-700 hover:bg-orange-50 px-8 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200">
                <Flame className="mr-2 h-5 w-5" />
                Browse Hot Deals
              </Button>
            </Link>
          </div>
        </div>

        {/* Business Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card className="text-center bg-white/90 backdrop-blur-sm shadow-xl border-orange-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl font-bold text-orange-600">
                {(stats as any)?.activeSuppliers || "1"}
              </CardTitle>
              <CardDescription className="text-slate-600 font-medium">Active Suppliers</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center bg-white/90 backdrop-blur-sm shadow-xl border-orange-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl font-bold text-orange-600">
                {(stats as any)?.totalDeals || "13"}
              </CardTitle>
              <CardDescription className="text-slate-600 font-medium">Total Deals</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center bg-white/90 backdrop-blur-sm shadow-xl border-orange-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl font-bold text-orange-600">
                {(stats as any)?.successfulConnections || "01"}
              </CardTitle>
              <CardDescription className="text-slate-600 font-medium">Successful Connections</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center bg-white/90 backdrop-blur-sm shadow-xl border-orange-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl font-bold text-orange-600">
                R{(stats as any)?.totalSavings?.toLocaleString() || '10,023'}
              </CardTitle>
              <CardDescription className="text-slate-600 font-medium">Total Savings</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Featured Hot Deals */}
        {hotDeals && Array.isArray(hotDeals) && hotDeals.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <Flame className="h-8 w-8 text-orange-600" />
                Featured Hot Deals
              </h2>
              <Link href="/hot-deals">
                <Button variant="outline" className="border-orange-600 text-orange-700 hover:bg-orange-50">
                  View All Deals
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotDeals.slice(0, 6).map((deal: any) => (
                <Card key={deal.id} className="bg-white/90 backdrop-blur-sm shadow-xl border-orange-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className="bg-orange-600 text-white font-semibold">HOT DEAL</Badge>
                      <Badge variant="outline" className="border-green-600 text-green-700">
                        Save R{deal.savings?.toLocaleString() || '0'}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-800 line-clamp-2">
                      {deal.title}
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      {deal.companyName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 line-clamp-2 mb-4">
                      {deal.description}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-2xl font-bold text-orange-600">R{deal.price}</span>
                        {deal.originalPrice && (
                          <span className="text-lg text-slate-500 line-through ml-2">R{deal.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    <Link href={`/coupon/${deal.id}`}>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700">
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
      <footer className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-orange-400">Business Daily Deals</h3>
              <p className="text-slate-300 leading-relaxed">
                South Africa's premier B2B marketplace connecting suppliers and buyers with exceptional deals and lasting partnerships.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-orange-400">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/hot-deals" className="block text-slate-300 hover:text-orange-400 transition-colors">Hot Deals</Link>
                <Link href="/suppliers-directory" className="block text-slate-300 hover:text-orange-400 transition-colors">Suppliers Directory</Link>
                <Link href="/find-me-deal" className="block text-slate-300 hover:text-orange-400 transition-colors">Find Me a Deal</Link>
                <Link href="/pricing" className="block text-slate-300 hover:text-orange-400 transition-colors">Pricing</Link>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-orange-400">Support</h4>
              <div className="space-y-2">
                <Link href="/support" className="block text-slate-300 hover:text-orange-400 transition-colors">Help Center</Link>
                <Link href="/contact" className="block text-slate-300 hover:text-orange-400 transition-colors">Contact Us</Link>
                <Link href="/about" className="block text-slate-300 hover:text-orange-400 transition-colors">About Us</Link>
                <Link href="/terms-of-service" className="block text-slate-300 hover:text-orange-400 transition-colors">Terms of Service</Link>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-orange-400">Business Info</h4>
              <div className="space-y-2 text-slate-300">
                <p>South African B2B Marketplace</p>
                <p>Credit System: 1 Credit = R2.50</p>
                <p className="font-bold text-yellow-400">FREE until February 20th, 2026!</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-600 mt-8 pt-8 text-center text-slate-300">
            <p>&copy; 2025 Business Daily Deals. All rights reserved. Serving South African B2B businesses with pride.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}