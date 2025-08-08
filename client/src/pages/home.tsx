import Navbar from "@/components/navbar";
import DealCard from "@/components/deal-card";
import KeywordNotifications from "@/components/keyword-notifications";
import SupplierOnboarding from "@/components/supplier-onboarding";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowRight, Flame, TrendingUp, Users, Zap, Shield, Globe, Star, AlertTriangle, MessageCircle, Share2, UserCheck, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { DealWithSupplier } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("latest");

  // Search deals query that updates based on search input
  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ["/api/deals", "search", searchQuery, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (selectedCategory !== "All Categories") params.append('category', selectedCategory);
      
      const response = await fetch(`/api/deals?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch search results');
      return response.json();
    },
    enabled: !!searchQuery.trim() && isAuthenticated,
  });

  const { data: hotDeals, isLoading: hotDealsLoading } = useQuery({
    queryKey: ["/api/deals", "hot"],
    queryFn: async () => {
      const response = await fetch('/api/deals?type=hot');
      if (!response.ok) throw new Error('Failed to fetch hot deals');
      return response.json();
    },
    enabled: (!searchQuery.trim() && isAuthenticated) || !isAuthenticated,
  });

  const categories = [
    "All Categories",
    "Agriculture & Farming",
    "Automotive & Transportation",
    "Construction & Building",
    "Electronics & Technology",
    "Energy & Utilities",
    "Finance & Banking",
    "Food & Beverages",
    "Healthcare & Medical",
    "Hospitality & Tourism",
    "Industrial Equipment",
    "Manufacturing",
    "Mining & Resources",
    "Office & Business Supplies",
    "Professional Services",
    "Real Estate & Property",
    "Retail & Wholesale",
    "Software & IT Services",
    "Telecommunications",
    "Textiles & Apparel",
    "Water",
    "Other"
  ];

  // Filter and sort results
  const displayedHotDeals = Array.isArray(hotDeals) ? hotDeals.slice(0, 6) : [];

  // Sort search results
  const sortedSearchResults = Array.isArray(searchResults) ? [...searchResults].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'expiry':
        return new Date(a.expiresAt || '').getTime() - new Date(b.expiresAt || '').getTime();
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  }) : [];

  const isSearching = !!searchQuery.trim();
  const showLoading = isSearching ? searchLoading : hotDealsLoading;

  return (
    <div className="min-h-screen page-home">
      <Navbar />

      {/* Modern Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-accent via-primary to-slate-700 text-white">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
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
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed" data-testid="text-hero-description">
              Connect with premium suppliers and discover exclusive daily deals that transform your business procurement
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/hot-deals">
                <Button size="lg" className="bg-white text-primary hover:bg-stone-50 px-8 py-3 text-lg font-semibold shadow-lg">
                  <Flame className="w-5 h-5 mr-2" />
                  Browse Hot Deals
                </Button>
              </Link>
              <Link href="/regular-deals">
                <Button size="lg" className="bg-white text-primary hover:bg-stone-50 px-8 py-3 text-lg font-semibold shadow-lg" data-testid="button-browse-regular-deals">
                  Browse Regular Deals
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-sm"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-sm"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-purple-300/20 rounded-full blur-sm"></div>
      </section>

      {/* Enhanced Search Bar - Only show for authenticated users */}
      {isAuthenticated && (
        <section className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 py-6 -mt-6 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 p-6">
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                <div className="flex-1">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search thousands of products and services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-4 py-4 text-lg border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                      data-testid="input-search"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-60 py-4 rounded-xl border-slate-300" data-testid="select-category">
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
                    <SelectTrigger className="w-60 py-4 rounded-xl border-slate-300" data-testid="select-sort">
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
          </div>
        </section>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Results Section - Only show for authenticated users */}
        {isAuthenticated && isSearching && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 flex items-center" data-testid="text-search-results-title">
                  <Search className="text-primary mr-3" />
                  Search Results
                  {!searchLoading && (
                    <span className="ml-3 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                      {sortedSearchResults.length} found
                    </span>
                  )}
                </h3>
                <p className="text-muted-foreground mt-1">
                  Results for "{searchQuery}"
                </p>
              </div>
              {sortedSearchResults.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery("")}
                  data-testid="button-clear-search"
                >
                  Clear Search
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchLoading ? (
                <div className="col-span-full flex items-center justify-center py-12">
                  <p className="text-muted-foreground" data-testid="text-loading-search">
                    Searching products...
                  </p>
                </div>
              ) : sortedSearchResults.length > 0 ? (
                sortedSearchResults.map((deal: DealWithSupplier) => (
                  <DealCard 
                    key={deal.id} 
                    deal={deal} 
                    variant={deal.dealType === 'hot' ? 'hot' : 'regular'}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">No products found</h4>
                  <p className="text-muted-foreground mb-4">
                    Try searching with different keywords or check the spelling
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 text-sm">
                    <span className="text-muted-foreground">Popular searches:</span>
                    {["laptops", "office supplies", "software", "equipment"].map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="text-primary hover:underline"
                        data-testid={`button-popular-search-${term}`}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Hot Deals Section - Only show for authenticated users when not searching */}
        {(isAuthenticated && !isSearching) && (
          <section className="mb-16">
            <div className="text-center mb-12">
              <Badge variant="destructive" className="mb-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2">
                <Flame className="w-4 h-4 mr-2" />
                Premium Hot Deals
              </Badge>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4" data-testid="text-hot-deals-title">
                Trending Business Deals
              </h3>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Exclusive time-limited offers with premium placement and maximum visibility
              </p>
            </div>
            <div className="flex justify-end mb-6">
              <Link href="/hot-deals">
                <Button variant="outline" className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200 text-red-700 hover:from-red-100 hover:to-orange-100" data-testid="button-view-all-hot">
                  View All Hot Deals <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotDealsLoading ? (
                Array.from({ length: 6 }, (_, i) => (
                  <Card key={i} className="animate-pulse overflow-hidden shadow-lg">
                    <div className="w-full h-48 bg-gradient-to-r from-slate-200 to-slate-300"></div>
                    <CardContent className="p-6">
                      <div className="h-4 bg-slate-200 rounded mb-4"></div>
                      <div className="h-6 bg-slate-200 rounded mb-2"></div>
                      <div className="h-4 bg-slate-200 rounded mb-4"></div>
                      <div className="h-10 bg-slate-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))
              ) : displayedHotDeals.length > 0 ? (
                displayedHotDeals.map((deal: DealWithSupplier) => (
                  <DealCard key={deal.id} deal={deal} variant="hot" />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Flame className="mx-auto h-16 w-16 text-red-300 mb-4" />
                  <h4 className="text-xl font-semibold text-slate-900 mb-2">No Hot Deals Available</h4>
                  <p className="text-muted-foreground mb-6">
                    Check back soon for exclusive premium deals from verified suppliers
                  </p>
                  <Link href="/regular-deals">
                    <Button variant="outline">
                      Browse Regular Deals <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Notification Section - Only show for authenticated users */}
        {isAuthenticated && (
          <section className="mb-12">
            <KeywordNotifications />
          </section>
        )}

        {/* Supplier Section - Only show for authenticated users */}
        {isAuthenticated && (
          <section className="mb-12">
            <SupplierOnboarding />
          </section>
        )}

        {/* Features Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose Business Daily Deals?
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transform your procurement process with South Africa's most trusted B2B marketplace
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-xl transition-all duration-300">
              <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Verified Suppliers</h4>
              <p className="text-muted-foreground">
                All suppliers are thoroughly vetted and verified for quality and reliability
              </p>
            </Card>
            <Card className="text-center p-8 border-2 border-slate-200 bg-gradient-to-br from-stone-50 to-slate-50 hover:shadow-xl transition-all duration-300">
              <div className="bg-slate-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-slate-700" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Instant Connections</h4>
              <p className="text-muted-foreground">
                Connect directly with suppliers and get quotes within hours, not days
              </p>
            </Card>
            <Card className="text-center p-8 border-2 border-stone-200 bg-gradient-to-br from-stone-100 to-stone-50 hover:shadow-xl transition-all duration-300">
              <div className="bg-stone-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="h-8 w-8 text-stone-700" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Local Focus</h4>
              <p className="text-muted-foreground">
                Designed specifically for South African businesses with local insights
              </p>
            </Card>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-to-r from-slate-900 to-stone-900 rounded-3xl p-8 md:p-12 text-white mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Thousands</h3>
            <p className="text-xl opacity-90">Real results from real businesses across South Africa</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Users className="h-12 w-12 text-primary/70 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2" data-testid="text-stat-suppliers">
                2,150+
              </div>
              <div className="text-stone-200 text-sm">Active Suppliers</div>
            </div>
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-primary/70 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2" data-testid="text-stat-deals">
                15,340+
              </div>
              <div className="text-stone-200 text-sm">Deals Posted</div>
            </div>
            <div className="text-center">
              <Zap className="h-12 w-12 text-stone-300 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2" data-testid="text-stat-connections">
                89,250+
              </div>
              <div className="text-stone-200 text-sm">Successful Connections</div>
            </div>
            <div className="text-center">
              <Globe className="h-12 w-12 text-stone-400 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2" data-testid="text-stat-savings">
                R12.4M+
              </div>
              <div className="text-stone-200 text-sm">Total Savings</div>
            </div>
          </div>
        </section>

        {/* Bottom Features Section */}
        <section className="bg-gradient-to-br from-slate-50 to-stone-100 dark:from-slate-800 dark:to-slate-700 rounded-3xl p-8 md:p-12 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Community & Support
            </h3>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Additional resources and tools to help you get the most from our marketplace
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* View Expired Deals */}
            <Card className="text-center p-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 hover:shadow-xl transition-all duration-300">
              <div className="bg-orange-100 dark:bg-orange-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">View Expired Deals</h4>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Browse deals that have expired to see what you might have missed
              </p>
              <Button 
                variant="outline" 
                className="w-full border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                data-testid="button-expired-deals"
              >
                View Expired Deals
              </Button>
            </Card>

            {/* Report Bad Deals */}
            <Card className="text-center p-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 hover:shadow-xl transition-all duration-300">
              <div className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Report Bad Deals</h4>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Help keep our marketplace clean by reporting suspicious or fraudulent deals
              </p>
              <Button 
                variant="outline" 
                className="w-full border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                data-testid="button-report-deals"
              >
                Report Bad Deal
              </Button>
            </Card>

            {/* Comment on Site */}
            <Card className="text-center p-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 hover:shadow-xl transition-all duration-300">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Comment on Site</h4>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Share your feedback and suggestions to help us improve the platform
              </p>
              <Button 
                variant="outline" 
                className="w-full border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                data-testid="button-comment-site"
              >
                Leave Feedback
              </Button>
            </Card>

            {/* Share on Social Media */}
            <Card className="text-center p-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 hover:shadow-xl transition-all duration-300">
              <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Share2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Share & Earn Credits</h4>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Share our platform on social media and earn advertising credits
              </p>
              <Button 
                variant="outline" 
                className="w-full border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                data-testid="button-share-credits"
              >
                Share & Earn
              </Button>
            </Card>

            {/* Membership Counters */}
            <Card className="text-center p-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 hover:shadow-xl transition-all duration-300">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserCheck className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Membership Stats</h4>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-300">Suppliers:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100" data-testid="text-supplier-count">2,150</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-300">Buyers:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100" data-testid="text-buyer-count">8,430</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                data-testid="button-membership-stats"
              >
                View Full Stats
              </Button>
            </Card>

            {/* Products Listed Counter */}
            <Card className="text-center p-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 hover:shadow-xl transition-all duration-300">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Products Listed</h4>
              <div className="mb-6">
                <div className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2" data-testid="text-products-count">
                  15,340
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  Active product listings from verified suppliers
                </p>
              </div>
              <Link href="/directory">
                <Button 
                  variant="outline" 
                  className="w-full border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                  data-testid="button-browse-products"
                >
                  Browse All Products
                </Button>
              </Link>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Business Daily Deals</h3>
              <p className="text-slate-300 mb-6 max-w-md">
                South Africa's premier B2B marketplace connecting suppliers with buyers through exclusive daily deals and innovative procurement solutions.
              </p>
              <div className="flex space-x-4">
                <div className="bg-slate-800 p-3 rounded-lg">
                  <Globe className="h-6 w-6" />
                </div>
                <div className="bg-slate-800 p-3 rounded-lg">
                  <Shield className="h-6 w-6" />
                </div>
                <div className="bg-slate-800 p-3 rounded-lg">
                  <Zap className="h-6 w-6" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Marketplace</h4>
              <ul className="space-y-2 text-slate-300">
                <li><Link href="/hot-deals" className="hover:text-white transition-colors">Hot Deals</Link></li>
                <li><Link href="/regular-deals" className="hover:text-white transition-colors">Regular Deals</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Categories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Suppliers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 mt-8 text-center text-slate-400">
            <p>&copy; 2025 Business Daily Deals. All rights reserved. | www.businessdailydeals.com.za</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
