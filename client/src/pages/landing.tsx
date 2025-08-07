import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import KeywordNotifications from "@/components/keyword-notifications";
import SupplierOnboarding from "@/components/supplier-onboarding";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-primary" data-testid="text-logo">
              Business Deals
            </h1>
            <Button
              onClick={() => (window.location.href = "/api/login")}
              data-testid="button-login"
            >
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-hero text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-hero-title">
            B2B Marketplace for Exclusive Deals
          </h2>
          <p className="text-xl mb-8 opacity-90" data-testid="text-hero-description">
            Connect suppliers with buyers through targeted notifications and special pricing
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-3 text-lg"
              onClick={() => (window.location.href = "/api/login")}
              data-testid="button-start-buying"
            >
              Start Buying
            </Button>
            <Button
              variant="secondary"
              className="bg-white text-primary hover:bg-slate-100 px-8 py-3 text-lg"
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
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Business Deals Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
