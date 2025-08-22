import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, Star, TrendingUp, Users, ShoppingBag, ArrowRight, Target, Building2, Package } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/navbar";

export default function HomeFebruary() {
  console.log("🔥 FEBRUARY PAGE LOADED - This should show February 20th!");
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="page-home">

      {/* Hero Section with Casino Animation */}
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            
            <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
              <Star className="w-4 h-4 mr-2" />
              South Africa's #1 B2B Marketplace
            </Badge>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight uppercase" data-testid="text-hero-title">
              BUSINESS DAILY
              <span className="block bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                DEALS - FEB 2026!
              </span>
            </h1>
            <div className="bg-slate-600 px-6 py-3 rounded-lg mb-4 inline-block shadow-lg">
              <p className="text-lg md:text-xl font-semibold text-white uppercase tracking-wide">
                A Dedicated Website That Connects Buyers to Suppliers
              </p>
              <p className="text-sm md:text-base text-white/90 mt-1 normal-case">
                A user friendly, essential tool for all South African SMME's
              </p>
            </div>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed" data-testid="text-hero-description">
              Connect with premium suppliers and discover exclusive daily deals that transform your business procurement
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/hot-deals">
                <Button 
                  size="lg" 
                  className="bg-orange-500 text-white hover:bg-orange-600 px-8 py-3 text-lg font-semibold shadow-lg"
                >
                  <Flame className="w-5 h-5 mr-2" />
                  Browse Hot Deals
                </Button>
              </Link>
              <Link href="/regular-deals">
                <Button size="lg" className="bg-orange-500 text-white hover:bg-orange-600 px-8 py-3 text-lg font-semibold shadow-lg" data-testid="button-browse-regular-deals">
                  Browse Regular Deals
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            
            {/* Call to Action */}
            <p className="text-white/80 text-lg mt-6">
              Use the menu above to register as a buyer or supplier
            </p>
          </div>
        </div>
      </section>

      {/* MEGA PROMOTIONAL BANNER - FEBRUARY 20TH 2026 - CACHE BREAKER */}
      <section className="bg-red-600 py-8 relative z-10 border-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-2">
            <div className="flex items-center">
              <Flame className="h-5 w-5 mr-2 text-orange-200" />
              <p className="text-lg sm:text-xl font-bold">
                🚨 URGENT: ALL DEALS FREE UNTIL FEBRUARY 20TH, 2026! 🚨
              </p>
              <Flame className="h-5 w-5 ml-2 text-orange-200" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm sm:text-base opacity-90">
              Register as a supplier and post unlimited HOT & REGULAR deals at no cost
            </p>
            <p className="text-xs sm:text-sm opacity-80">
              Save R125 per HOT deal • R50 per REGULAR deal • No setup fees
            </p>
          </div>
        </div>
      </section>

      {/* Business Statistics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Suppliers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">1</div>
              <div className="flex items-center justify-center mt-2">
                <Users className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-gray-500">Verified Partners</span>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">13</div>
              <div className="flex items-center justify-center mt-2">
                <ShoppingBag className="h-4 w-4 text-blue-600 mr-1" />
                <span className="text-sm text-gray-500">Live Offers</span>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Connections Made</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">01</div>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="h-4 w-4 text-purple-600 mr-1" />
                <span className="text-sm text-gray-500">This Month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">R10,023</div>
              <div className="flex items-center justify-center mt-2">
                <Star className="h-4 w-4 text-orange-600 mr-1" />
                <span className="text-sm text-gray-500">Customer Value</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-slate-900 mb-12">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">1</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Register Your Business</h4>
              <p className="text-gray-600">Join as a supplier to offer deals or as a buyer to discover opportunities</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">2</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Post or Browse Deals</h4>
              <p className="text-gray-600">Suppliers post hot and regular deals while buyers discover great offers</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">3</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Connect & Save</h4>
              <p className="text-gray-600">Direct communication leads to successful transactions and business growth</p>
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-800 py-16 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-8">Why Choose Business Daily Deals?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Package className="h-12 w-12 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">For Suppliers</h4>
              <p>Reach targeted buyers, showcase your best deals, and grow your business with zero upfront costs during our promotional period.</p>
            </div>
            <div>
              <Target className="h-12 w-12 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">For Buyers</h4>
              <p>Access exclusive deals, connect directly with suppliers, and streamline your procurement process with smart notifications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Business Daily Deals</h4>
              <p className="text-gray-400 mb-4">South Africa's premier B2B marketplace connecting suppliers and buyers.</p>
              <div className="bg-green-600 px-4 py-2 rounded-lg mb-2">
                <p className="text-sm font-semibold text-white">🎉 FREE PROMOTION ACTIVE</p>
              </div>
              <p className="text-xs text-slate-500">
                FEBRUARY 20TH, 2026 PROMO ACTIVE - Post deals FREE!
              </p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">For Suppliers</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/register-supplier" className="hover:text-white">Register as Supplier</Link></li>
                <li><Link href="/supplier-dashboard" className="hover:text-white">Supplier Dashboard</Link></li>
                <li><Link href="/rates" className="hover:text-white">Advertising Rates</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">For Buyers</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/register-buyer" className="hover:text-white">Register as Buyer</Link></li>
                <li><Link href="/hot-deals" className="hover:text-white">Browse Hot Deals</Link></li>
                <li><Link href="/find-me-deal" className="hover:text-white">Find Me a Deal</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/support" className="hover:text-white">Support Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Business Daily Deals. All rights reserved.</p>
          </div>
        </div>
      </footer>

      </div>
    </div>
  );
}