import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import KeywordNotifications from "@/components/keyword-notifications";
import SupplierOnboarding from "@/components/supplier-onboarding";
import Navbar from "@/components/navbar";

export default function Landing() {
  return (
    <div className="min-h-screen page-landing">
      <Navbar />
      
      {/* Landing-specific login section */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-slate-200/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Button
            onClick={() => (window.location.href = "/api/login")}
            className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white px-8 py-3 shadow-lg text-lg"
            data-testid="button-login"
          >
            Login to Access Deals
          </Button>
        </div>
      </div>

      {/* Modern Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-primary to-slate-700 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight" data-testid="text-hero-title">
              Business Daily
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Deals
              </span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed" data-testid="text-hero-description">
              South Africa's premier B2B marketplace connecting suppliers with buyers through exclusive daily deals and competitive pricing
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              className="bg-white text-accent hover:bg-slate-100 px-10 py-4 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all"
              onClick={() => (window.location.href = "/api/login")}
              data-testid="button-start-buying"
            >
              Start Buying
            </Button>
            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-accent px-10 py-4 text-xl font-semibold backdrop-blur-sm"
              onClick={() => (window.location.href = "/api/login")}
              data-testid="button-become-supplier"
            >
              Become a Supplier
            </Button>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Notification Section */}
        <KeywordNotifications />

        {/* Supplier Section */}
        <SupplierOnboarding />

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2" data-testid="text-stat-suppliers">
                2,150+
              </div>
              <div className="text-muted-foreground text-sm">Active Suppliers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-accent mb-2" data-testid="text-stat-deals">
                15,340+
              </div>
              <div className="text-muted-foreground text-sm">Deals Posted</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-success mb-2" data-testid="text-stat-connections">
                89,250+
              </div>
              <div className="text-muted-foreground text-sm">Successful Connections</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-secondary mb-2" data-testid="text-stat-savings">
                $12.4M+
              </div>
              <div className="text-muted-foreground text-sm">Total Savings</div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Business Deals</h3>
              <p className="text-slate-400 mb-4">
                The premier B2B marketplace connecting suppliers and buyers through targeted deal notifications.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Buyers</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Browse Deals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Set Notifications</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Suppliers</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Post Deals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Supplier Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing Plans</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/support" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 Business Daily Deals. All rights reserved. | www.businessdailydeals.co.za</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
