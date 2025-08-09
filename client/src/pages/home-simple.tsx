import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowRight, Flame, Star, Users, TrendingUp, Zap, Globe, Building2, CreditCard } from "lucide-react";
import { Link } from "wouter";

export default function HomeSimple() {
  return (
    <div className="min-h-screen page-home-container" style={{
      background: 'linear-gradient(135deg, #fff7ed 0%, #fef3c7 50%, #fefce8 100%)',
      minHeight: '100vh'
    }}>
      <Navbar />

      {/* Modern Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-gray-700 text-white">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            {/* Animated One-Armed Bandit */}
            <div className="flex justify-center items-center mb-6" data-testid="slot-machine">
              <div className="flex items-center bg-gray-800 rounded-lg p-4 border-2 border-yellow-400 shadow-lg">
                <div className="flex space-x-3">
                  {/* Slot Reel 1 */}
                  <div className="relative w-16 h-14 bg-white rounded-sm border-2 border-gray-500 overflow-hidden shadow-lg">
                    <div className="absolute inset-0 flex flex-col justify-center items-center animate-spin-vertical-slow bg-gradient-to-b from-gray-50 to-white">
                      <div className="casino-seven">7</div>
                    </div>
                  </div>
                  {/* Slot Reel 2 */}
                  <div className="relative w-16 h-14 bg-white rounded-sm border-2 border-gray-500 overflow-hidden shadow-lg">
                    <div className="absolute inset-0 flex flex-col justify-center items-center animate-spin-vertical-medium bg-gradient-to-b from-gray-50 to-white">
                      <div className="casino-seven">7</div>
                    </div>
                  </div>
                  {/* Slot Reel 3 */}
                  <div className="relative w-16 h-14 bg-white rounded-sm border-2 border-gray-500 overflow-hidden shadow-lg">
                    <div className="absolute inset-0 flex flex-col justify-center items-center animate-spin-vertical-fast bg-gradient-to-b from-gray-50 to-white">
                      <div className="casino-seven">7</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
              <Star className="w-4 h-4 mr-2" />
              South Africa's #1 B2B Marketplace
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight" data-testid="text-hero-title">
              Business Daily
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Deals
              </span>
            </h1>
            <div className="bg-red-600 px-4 py-2 rounded-lg mb-2 inline-block">
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* Always show buttons */}
              <Link href="/hot-deals">
                <Button size="lg" className="bg-white text-slate-600 hover:bg-stone-50 px-8 py-3 text-lg font-semibold shadow-lg">
                  <Flame className="w-5 h-5 mr-2" />
                  Browse Hot Deals
                </Button>
              </Link>
              <Link href="/regular-deals">
                <Button size="lg" className="bg-white text-slate-600 hover:bg-stone-50 px-8 py-3 text-lg font-semibold shadow-lg" data-testid="button-browse-regular-deals">
                  Browse Regular Deals
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/register-buyer">
                <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-slate-600 px-8 py-3 text-lg font-semibold">
                  Register as Buyer
                </Button>
              </Link>
              <Link href="/register-supplier">
                <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-slate-600 px-8 py-3 text-lg font-semibold" data-testid="button-register-supplier">
                  Register as Supplier
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FREE Promotional Banner */}
      <section className="bg-gradient-to-r from-green-500 to-emerald-600 py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-2">
            <div className="flex items-center">
              <Flame className="h-5 w-5 mr-2 text-orange-200" />
              <p className="text-lg sm:text-xl font-bold">
                🎉 SUPPLIERS: POST DEALS FOR FREE UNTIL 1ST JANUARY 2026!
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <section className="mb-16">
          <div className="text-center py-12 bg-white rounded-xl border-2 border-orange-200 shadow-lg">
            <Flame className="mx-auto h-16 w-16 text-orange-500 mb-4" />
            <h4 className="text-2xl font-semibold text-slate-900 mb-4">Welcome to Business Daily Deals</h4>
            <p className="text-slate-600 mb-6 max-w-md mx-auto text-lg">
              Your premier B2B marketplace. Discover exclusive deals from verified suppliers.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/hot-deals">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2">
                  Browse Hot Deals
                </Button>
              </Link>
              <Link href="/regular-deals">
                <Button variant="outline" className="px-6 py-2">
                  Browse Regular Deals
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <Card className="text-center p-6">
            <Users className="h-8 w-8 text-orange-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-slate-900 mb-2" data-testid="text-stat-suppliers">
              2,150+
            </div>
            <div className="text-slate-600 text-sm">Active Suppliers</div>
          </Card>
          <Card className="text-center p-6">
            <TrendingUp className="h-8 w-8 text-orange-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-slate-900 mb-2" data-testid="text-stat-deals">
              15,340+
            </div>
            <div className="text-slate-600 text-sm">Deals Posted</div>
          </Card>
          <Card className="text-center p-6">
            <Zap className="h-8 w-8 text-orange-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-slate-900 mb-2" data-testid="text-stat-connections">
              89,250+
            </div>
            <div className="text-slate-600 text-sm">Successful Connections</div>
          </Card>
          <Card className="text-center p-6">
            <Globe className="h-8 w-8 text-orange-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-slate-900 mb-2" data-testid="text-stat-savings">
              R12.4M+
            </div>
            <div className="text-slate-600 text-sm">Total Savings</div>
          </Card>
        </section>
      </main>

      {/* Quick Access Buttons Section */}
      <section className="py-16 bg-white border-t border-orange-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-slate-900 mb-12">Quick Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/find-me-deal">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <Search className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Find Me a Deal</h4>
                  <p className="text-sm text-slate-600">Tell us what you need and we'll find suppliers for you</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/directory">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Product Directory</h4>
                  <p className="text-sm text-slate-600">Browse products by category and supplier</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/suppliers-directory">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <Building2 className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Supplier Directory</h4>
                  <p className="text-sm text-slate-600">Find verified suppliers by industry and location</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/rates-management">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <CreditCard className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Advertising Rates</h4>
                  <p className="text-sm text-slate-600">View pricing for posting deals and advertisements</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-yellow-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-slate-900 mb-12">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
              <h4 className="text-xl font-semibold mb-3">Suppliers Post Deals</h4>
              <p className="text-slate-600">Companies post HOT deals (premium) or REGULAR deals with special pricing and offers</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
              <h4 className="text-xl font-semibold mb-3">Buyers Browse & Connect</h4>
              <p className="text-slate-600">Buyers search deals, set keyword alerts, and connect directly with suppliers</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
              <h4 className="text-xl font-semibold mb-3">Business Growth</h4>
              <p className="text-slate-600">Successful connections lead to business deals, partnerships, and growth</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Business Daily Deals</h3>
              <p className="text-slate-300 mb-4">
                South Africa's premier B2B marketplace connecting suppliers with buyers through targeted deal notifications.
              </p>
              <div className="text-sm text-slate-400">
                <p>📧 admin@businessdailydeals.co.za</p>
                <p>🌍 www.businessdailydeals.co.za</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">For Suppliers</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/register-supplier" className="text-slate-300 hover:text-white">Register as Supplier</Link></li>
                <li><Link href="/rates-management" className="text-slate-300 hover:text-white">View Pricing</Link></li>
                <li><Link href="/post-deal" className="text-slate-300 hover:text-white">Post a Deal</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">For Buyers</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/register-buyer" className="text-slate-300 hover:text-white">Register as Buyer</Link></li>
                <li><Link href="/find-me-deal" className="text-slate-300 hover:text-white">Find Me a Deal</Link></li>
                <li><Link href="/directory" className="text-slate-300 hover:text-white">Product Directory</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center">
            <p className="text-slate-400 text-sm">
              © 2025 Business Daily Deals. All rights reserved. | 
              <Link href="/terms-of-service" className="hover:text-white ml-2">Terms</Link> | 
              <Link href="/privacy-policy" className="hover:text-white ml-2">Privacy</Link> | 
              <Link href="/support" className="hover:text-white ml-2">Support</Link>
            </p>
            <p className="text-xs text-slate-500 mt-2">
              🎉 FREE deal posting for suppliers until January 1st, 2026!
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}