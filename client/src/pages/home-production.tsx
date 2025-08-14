import { useEffect } from "react";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, ArrowRight, TrendingUp, Users, ShieldCheck, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

// PRODUCTION CACHE BUSTER - February 20th, 2026
const PRODUCTION_TIMESTAMP = Date.now();
console.log("🚀 PRODUCTION HOMEPAGE LOADED - February 20th, 2026:", PRODUCTION_TIMESTAMP);

export default function HomeProduction() {
  useEffect(() => {
    document.title = "Business Daily Deals - South African B2B Marketplace";
    console.log("✅ PRODUCTION: February 20th, 2026 promotional period active");
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
      
      {/* SUCCESS CONFIRMATION - REMOVE AFTER CONFIRMING */}

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight">
            Business Daily <span className="text-orange-600">Deals</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            South Africa's Premier B2B Marketplace - Connecting Suppliers and Buyers with Exceptional Deals
          </p>
          
          {/* PROMOTIONAL BANNER - FEBRUARY 2026 */}
          <div className="bg-green-600 text-white p-6 rounded-xl mb-8 max-w-4xl mx-auto shadow-2xl border-4 border-green-700">
            <div className="text-3xl font-bold mb-2">🎉 SPECIAL LAUNCH PROMOTION! 🎉</div>
            <div className="text-xl">
              <strong>FREE Deal Posting until February 20th, 2026!</strong>
            </div>
            <div className="text-lg mt-2 opacity-90">
              Build your supplier network during our promotional period - then start earning with our credit system
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register-supplier">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200" data-testid="button-start-selling">
                Start Selling Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/hot-deals">
              <Button size="lg" variant="outline" className="border-orange-600 text-orange-700 hover:bg-orange-50 px-8 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200" data-testid="button-browse-deals">
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
              <CardTitle className="text-3xl font-bold text-orange-600" data-testid="text-active-suppliers">
                {stats?.activeSuppliers || 0}
              </CardTitle>
              <CardDescription className="text-slate-600 font-medium">Active Suppliers</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center bg-white/90 backdrop-blur-sm shadow-xl border-orange-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl font-bold text-orange-600" data-testid="text-total-deals">
                {stats?.totalDeals || 0}
              </CardTitle>
              <CardDescription className="text-slate-600 font-medium">Total Deals</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center bg-white/90 backdrop-blur-sm shadow-xl border-orange-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl font-bold text-orange-600" data-testid="text-successful-connections">
                {stats?.successfulConnections || 0}
              </CardTitle>
              <CardDescription className="text-slate-600 font-medium">Successful Connections</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center bg-white/90 backdrop-blur-sm shadow-xl border-orange-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl font-bold text-orange-600" data-testid="text-total-savings">
                R{stats?.totalSavings?.toLocaleString() || '0'}
              </CardTitle>
              <CardDescription className="text-slate-600 font-medium">Total Savings</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Featured Hot Deals */}
        {hotDeals && hotDeals.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <Flame className="h-8 w-8 text-orange-600" />
                Featured Hot Deals
              </h2>
              <Link href="/hot-deals">
                <Button variant="outline" className="border-orange-600 text-orange-700 hover:bg-orange-50" data-testid="button-view-all-deals">
                  View All Deals
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotDeals.slice(0, 6).map((deal: any) => (
                <Card key={deal.id} className="bg-white/90 backdrop-blur-sm shadow-xl border-orange-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105" data-testid={`card-deal-${deal.id}`}>
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className="bg-orange-600 text-white font-semibold">HOT DEAL</Badge>
                      <Badge variant="outline" className="border-green-600 text-green-700">
                        Save R{deal.savings?.toLocaleString() || '0'}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-800 line-clamp-2" data-testid={`text-deal-title-${deal.id}`}>
                      {deal.title}
                    </CardTitle>
                    <CardDescription className="text-slate-600" data-testid={`text-deal-company-${deal.id}`}>
                      {deal.companyName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 line-clamp-2 mb-4" data-testid={`text-deal-description-${deal.id}`}>
                      {deal.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-slate-500">
                        Expires: {new Date(deal.expiryDate).toLocaleDateString()}
                      </div>
                      <Link href={`/coupon/${deal.id}`}>
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white" data-testid={`button-get-coupon-${deal.id}`}>
                          Get Coupon
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Register Your Business</h3>
              <p className="text-slate-600 leading-relaxed">
                Join as a supplier to showcase your products and services, or as a buyer to discover great deals from verified South African businesses.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Post or Browse Deals</h3>
              <p className="text-slate-600 leading-relaxed">
                Suppliers can post hot deals and regular offers. Buyers can browse categories, search products, and set up keyword notifications for relevant deals.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Connect & Save</h3>
              <p className="text-slate-600 leading-relaxed">
                Make direct contact through our inquiry system, generate coupons for deals, and build lasting business relationships while saving money.
              </p>
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-16 border border-orange-200">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">Why Choose Business Daily Deals?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <TrendingUp className="h-8 w-8 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Boost Your Sales</h3>
                <p className="text-slate-600">Reach thousands of potential buyers across South Africa with targeted deal placements and premium visibility options.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Users className="h-8 w-8 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Verified Network</h3>
                <p className="text-slate-600">Connect with legitimate South African businesses through our verification system and build trusted partnerships.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <ShieldCheck className="h-8 w-8 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Secure Platform</h3>
                <p className="text-slate-600">Enterprise-grade security with secure transactions, verified suppliers, and protected business communications.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-2xl shadow-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join South Africa's fastest-growing B2B marketplace and start connecting with serious business partners today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register-supplier">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-slate-50 px-8 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200" data-testid="button-register-supplier">
                Register as Supplier
              </Button>
            </Link>
            <Link href="/register-buyer">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200" data-testid="button-register-buyer">
                Register as Buyer
              </Button>
            </Link>
          </div>
        </div>
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
                <p className="font-semibold text-green-400">FREE until February 20th, 2026!</p>
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