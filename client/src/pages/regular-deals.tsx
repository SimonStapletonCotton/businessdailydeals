import { useEffect } from "react";
import Navbar from "@/components/navbar";
import DealCard from "@/components/deal-card-fixed";
import { BannerAds } from "@/components/banner-ads";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { DealWithSupplier } from "@/../../server/storage";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function RegularDeals() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("latest");
  const [displayCount, setDisplayCount] = useState(50); // Show 10 rows of 5 deals each (50 deals per page)

  // Scroll to top when component mounts
  useEffect(() => {
    // Force immediate scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Also add a small delay to handle any async content loading
    const timeoutId = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Remove authentication redirect - let pages load for everyone

  const { data: deals, isLoading: dealsLoading } = useQuery<DealWithSupplier[]>({
    queryKey: ["/api/deals", "regular", searchQuery, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("type", "regular");
      if (searchQuery) params.set("search", searchQuery);
      if (selectedCategory && selectedCategory !== "All Categories") params.set("category", selectedCategory);
      
      const res = await fetch(`/api/deals?${params.toString()}`, {
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      return await res.json();
    },
    enabled: true, // Allow loading for everyone
  });

  const categories = [
    "All Categories",
    "Electronics",
    "Industrial Equipment", 
    "Office Supplies",
    "Software & Services",
    "Construction & Building",
    "Automotive & Transport",
    "Food & Beverage",
    "Healthcare & Medical",
    "Agriculture & Farming",
    "Mining",
    "General Industry",
    "Residential",
    "Textiles & Clothing",
    "Energy & Utilities",
    "Packaging & Logistics",
    "Safety & Security",
    "Cleaning & Maintenance",
    "Manufacturing & Tools",
    "Printing & Advertising",
    "Hospitality & Tourism",
    "Sports & Recreation",
    "Water",
    "Other"
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="page-regular">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Modern Header Section */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-primary/20 to-slate/20 p-3 rounded-full">
              <Package className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4" data-testid="text-page-title">
            Regular Deals
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="bg-gradient-to-r from-primary to-slate-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              Standard Marketplace
            </span>
            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
              Competitive Pricing
            </span>
          </div>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Browse our comprehensive marketplace with competitive pricing and quality products from verified suppliers
          </p>
        </div>

        {/* Modern Filter Bar */}
        <section className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search regular deals and products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base border-slate-300 focus:border-primary focus:ring-primary/20"
                  data-testid="input-search"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-52 h-12" data-testid="select-category">
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
                <SelectTrigger className="w-52 h-12" data-testid="select-sort">
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
        </section>

        {/* Deals Grid - 5 Columns Layout */}
        <section>
          {dealsLoading ? (
            <div className="grid grid-cols-5 gap-4 min-h-[800px]">{/* Fixed 5-column layout for loading */}
              {Array.from({ length: 50 }, (_, i) => (
                <Card key={i} className="animate-pulse shadow-md border-0 bg-gradient-to-br from-white to-slate-50">
                  <div className="w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 rounded-t-xl"></div>
                  <CardContent className="p-4">
                    <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded mb-3"></div>
                    <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded mb-3"></div>
                    <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded mb-3"></div>
                    <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : deals && deals.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 min-h-[800px]">{/* Responsive grid layout */}
                {deals.slice(0, displayCount).map((deal) => (
                  <DealCard 
                    key={deal.id} 
                    deal={{
                      ...deal,
                      supplier: {
                        ...deal.supplier,
                        firstName: deal.supplier.firstName || undefined,
                        lastName: deal.supplier.lastName || undefined,
                        companyName: deal.supplier.companyName || undefined,
                        email: deal.supplier.email || undefined,
                        isVerified: deal.supplier.isVerified || false,
                      }
                    }} 
                    variant="compact" 
                  />
                ))}
              </div>
              
              {/* Show More Button */}
              {deals.length > displayCount && (
                <div className="text-center mt-12">
                  <Button
                    onClick={() => setDisplayCount(prev => prev + 50)}
                    className="bg-gradient-to-r from-primary to-slate-600 hover:from-primary/90 hover:to-slate-600/90 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    data-testid="button-show-more"
                  >
                    Show More Deals ({Math.min(50, deals.length - displayCount)} more)
                  </Button>
                  <p className="text-slate-500 mt-3">
                    Showing {displayCount} of {deals.length} regular deals
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="bg-gradient-to-br from-primary/10 to-slate/10 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Package className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3" data-testid="text-no-deals">
                No Regular Deals Available
              </h3>
              <p className="text-slate-600 text-lg max-w-md mx-auto" data-testid="text-no-deals-description">
                {searchQuery || selectedCategory !== "All Categories"
                  ? "Try adjusting your search or filter criteria to find more deals"
                  : "Check back soon for new deals from our verified suppliers"}
              </p>
            </div>
          )}
        </section>
        
        {/* Bottom Advertisement Banner */}
        <div className="mt-12 mb-8">
          <BannerAds position="footer" className="w-full" />
        </div>
        </main>
      </div>
    </div>
  );
}
