import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Star, TrendingUp, Users, ShoppingBag, ArrowRight, Target, Building2, Package } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/navbar";

export default function HomeUltimate() {
  console.log("🎯 ULTIMATE HOMEPAGE LOADED - FEBRUARY 20TH 2026 CONFIRMED!");
  
  const [currentTime, setCurrentTime] = useState(new Date().toISOString());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toISOString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section with Casino Theme */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-400 via-orange-500 to-slate-600 min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-300/80 via-orange-400/70 to-slate-500/60"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
              <Star className="w-4 h-4 mr-2" />
              South Africa's #1 B2B Marketplace - FEBRUARY 2026 PROMO!
            </Badge>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight uppercase" data-testid="text-hero-title">
              BUSINESS DAILY
              <span className="block bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                DEALS - ULTIMATE 2026!
              </span>
            </h1>
            <div className="flex flex-col items-center mb-6">
              <div className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold text-lg mb-2">
                CACHE TIMESTAMP: {currentTime}
              </div>
              <p className="text-lg font-semibold opacity-95">
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

      {/* ULTIMATE PROMOTIONAL BANNER - FEBRUARY 20TH 2026 */}
      <section className="bg-red-600 py-12 relative z-10 border-8 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="bg-yellow-400 text-black p-6 rounded-lg mb-4 border-4 border-red-800">
            <div className="text-3xl font-bold mb-2">🚨 ULTIMATE PROMO ALERT 🚨</div>
            <div className="text-2xl font-bold">
              ALL DEALS ABSOLUTELY FREE UNTIL FEBRUARY 20TH, 2026!
            </div>
            <div className="text-lg mt-2">
              This is the ULTIMATE homepage - Cache timestamp: {new Date().toLocaleTimeString()}
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-lg font-bold opacity-95">
              Register as a supplier and post unlimited HOT & REGULAR deals at no cost
            </p>
            <p className="text-base opacity-90">
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
                <span className="text-sm text-gray-500">Hot & Regular</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Successful Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">0</div>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="h-4 w-4 text-purple-600 mr-1" />
                <span className="text-sm text-gray-500">Growing Daily</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Calculated Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">R0</div>
              <div className="flex items-center justify-center mt-2">
                <Star className="h-4 w-4 text-orange-600 mr-1" />
                <span className="text-sm text-gray-500">Building Value</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Access Features */}
      <section className="py-16 bg-slate-100 border-t border-orange-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-slate-900 mb-12">Quick Access Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/find-me-deal">
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-2 hover:border-orange-300">
                <CardContent className="p-6 text-center">
                  <Target className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Find Me a Deal</h4>
                  <p className="text-sm text-gray-600">Tell us what you need and we'll find suppliers for you</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/suppliers-directory">
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-2 hover:border-orange-300">
                <CardContent className="p-6 text-center">
                  <Building2 className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Suppliers Directory</h4>
                  <p className="text-sm text-gray-600">Browse verified suppliers by category and location</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/directory">
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-2 hover:border-orange-300">
                <CardContent className="p-6 text-center">
                  <Package className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Product Directory</h4>
                  <p className="text-sm text-gray-600">Search products and services across all categories</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/rates-management">
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-2 hover:border-orange-300">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Advertising Rates</h4>
                  <p className="text-sm text-gray-600">View pricing for deal placements and premium features</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-slate-900 mb-12">How Business Daily Deals Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h4 className="text-xl font-semibold mb-3 text-slate-900">Register & Browse</h4>
              <p className="text-gray-600">Sign up as a buyer or supplier. Browse hot deals, regular deals, and connect with verified business partners.</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h4 className="text-xl font-semibold mb-3 text-slate-900">Connect & Negotiate</h4>
              <p className="text-gray-600">Send inquiries, negotiate terms, and establish business relationships with suppliers across South Africa.</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h4 className="text-xl font-semibold mb-3 text-slate-900">Secure & Save</h4>
              <p className="text-gray-600">Complete transactions with verified suppliers and save money through our exclusive B2B marketplace deals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Business Daily Deals</h3>
              <p className="text-slate-400 text-sm">South Africa's premier B2B marketplace connecting suppliers and buyers.</p>
              <div className="bg-green-600 px-4 py-2 rounded-lg mb-2 mt-4">
                <p className="text-sm font-semibold text-white">🎉 FREE PROMOTION ACTIVE</p>
              </div>
              <p className="text-xs text-slate-500">
                FEBRUARY 20TH, 2026 PROMO ACTIVE - Post deals FREE!
              </p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">For Suppliers</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/register-supplier" className="text-slate-400 hover:text-white">Register as Supplier</Link></li>
                <li><Link href="/post-deal" className="text-slate-400 hover:text-white">Post Hot Deal</Link></li>
                <li><Link href="/rates-management" className="text-slate-400 hover:text-white">View Pricing</Link></li>
                <li><Link href="/supplier-dashboard" className="text-slate-400 hover:text-white">Supplier Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">For Buyers</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/register-buyer" className="text-slate-400 hover:text-white">Register as Buyer</Link></li>
                <li><Link href="/hot-deals" className="text-slate-400 hover:text-white">Browse Hot Deals</Link></li>
                <li><Link href="/regular-deals" className="text-slate-400 hover:text-white">Browse Regular Deals</Link></li>
                <li><Link href="/find-me-deal" className="text-slate-400 hover:text-white">Find Me a Deal</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/support" className="text-slate-400 hover:text-white">Support Center</Link></li>
                <li><Link href="/contact" className="text-slate-400 hover:text-white">Contact Us</Link></li>
                <li><Link href="/terms-of-service" className="text-slate-400 hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy-policy" className="text-slate-400 hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center">
            <p className="text-slate-400 text-sm">© 2024 Business Daily Deals. All rights reserved. South African B2B Marketplace.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}