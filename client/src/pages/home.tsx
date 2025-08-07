import Navbar from "@/components/navbar";
import DealCard from "@/components/deal-card";
import KeywordNotifications from "@/components/keyword-notifications";
import SupplierOnboarding from "@/components/supplier-onboarding";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ArrowRight, Flame } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { DealWithSupplier } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("latest");

  const { data: hotDeals, isLoading: hotDealsLoading } = useQuery({
    queryKey: ["/api/deals", { type: "hot" }],
  });

  const { data: regularDeals, isLoading: regularDealsLoading } = useQuery({
    queryKey: ["/api/deals", { type: "regular" }],
  });

  const categories = [
    "All Categories",
    "Electronics",
    "Industrial Equipment", 
    "Office Supplies",
    "Software & Services"
  ];

  const displayedHotDeals = Array.isArray(hotDeals) ? hotDeals.slice(0, 3) : [];
  const displayedRegularDeals = Array.isArray(regularDeals) ? regularDeals.slice(0, 4) : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="gradient-hero text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-hero-title">
            B2B Marketplace for Exclusive Deals
          </h2>
          <p className="text-xl mb-8 opacity-90" data-testid="text-hero-description">
            Connect suppliers with buyers through targeted notifications and special pricing
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-white border-b border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search deals by keyword, category, or supplier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48" data-testid="select-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48" data-testid="select-sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Sort by: Latest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="expiry">Expiry Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hot Deals Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 flex items-center" data-testid="text-hot-deals-title">
                <Flame className="text-red-500 mr-3" />
                Hot Deals
                <span className="ml-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  Premium
                </span>
              </h3>
              <p className="text-muted-foreground mt-1">Limited time offers with premium visibility</p>
            </div>
            <Link href="/hot-deals">
              <Button variant="ghost" className="text-primary hover:text-blue-700" data-testid="button-view-all-hot">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotDealsLoading ? (
              Array.from({ length: 3 }, (_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="w-full h-48 bg-muted rounded-t-xl"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-4"></div>
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded mb-4"></div>
                    <div className="h-10 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              displayedHotDeals.map((deal: DealWithSupplier) => (
                <DealCard key={deal.id} deal={deal} variant="hot" />
              ))
            )}
          </div>
        </section>

        {/* Regular Deals Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900" data-testid="text-regular-deals-title">
                Regular Deals
              </h3>
              <p className="text-muted-foreground mt-1">Standard marketplace listings with competitive pricing</p>
            </div>
            <Link href="/regular-deals">
              <Button variant="ghost" className="text-primary hover:text-blue-700" data-testid="button-view-all-regular">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {regularDealsLoading ? (
              Array.from({ length: 4 }, (_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="w-full h-32 bg-muted rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-3 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded mb-3"></div>
                    <div className="h-8 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              displayedRegularDeals.map((deal: DealWithSupplier) => (
                <DealCard key={deal.id} deal={deal} variant="regular" />
              ))
            )}
          </div>
        </section>

        {/* Notification Section */}
        <section className="mb-12">
          <KeywordNotifications />
        </section>

        {/* Supplier Section */}
        <section className="mb-12">
          <SupplierOnboarding />
        </section>

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
    </div>
  );
}
