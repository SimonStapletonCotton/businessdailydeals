import { useEffect } from "react";
import Navbar from "@/components/navbar";
import DealCard from "@/components/deal-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Flame } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { DealWithSupplier } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function HotDeals() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("latest");
  const [displayCount, setDisplayCount] = useState(50); // Show 10 rows of 5 deals each (50 deals per page)

  // Remove authentication redirect - let pages load for everyone

  const { data: deals, isLoading: dealsLoading, error } = useQuery<DealWithSupplier[]>({
    queryKey: ["/api/deals", "hot", searchQuery, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("type", "hot");
      if (searchQuery) params.set("search", searchQuery);
      if (selectedCategory && selectedCategory !== "All Categories") params.set("category", selectedCategory);
      
      console.log("Fetching hot deals with params:", params.toString());
      
      const res = await fetch(`/api/deals?${params.toString()}`, {
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("Hot deals data received:", data);
      return data;
    },
    enabled: true, // Allow loading for everyone
  });

  console.log("Hot deals state:", { deals, dealsLoading, error });

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
      <div className="page-deals">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Modern Header Section */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-accent/20 to-primary/20 p-3 rounded-full">
              <Flame className="h-8 w-8 text-accent" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4" data-testid="text-page-title">
            Hot Deals
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="bg-gradient-to-r from-accent to-primary text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              Premium Marketplace
            </span>
            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
              Featured Listings
            </span>
          </div>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Limited time offers with premium visibility and exclusive pricing
          </p>
        </div>

        {/* Filter Bar */}
        <section className="bg-white border border-slate-200 rounded-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search hot deals..."
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
        </section>

        {/* Deals Grid - 5 Columns Layout */}
        <section>
          {dealsLoading ? (
            <div className="grid grid-cols-5 gap-4 min-h-[800px]">{/* Fixed 5-column layout for loading */}
              {Array.from({ length: 50 }, (_, i) => (
                <Card key={i} className="animate-pulse shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
                  <div className="w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 rounded-t-xl"></div>
                  <CardContent className="p-4">
                    <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded mb-3"></div>
                    <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded mb-2"></div>
                    <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded mb-3"></div>
                    <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : deals && deals.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-slate-600 bg-yellow-100 p-2 rounded">
                DEBUG: Showing {deals.length} hot deal{deals.length === 1 ? '' : 's'} - {JSON.stringify(deals.map(d => d.title))}
              </div>
              <div className="grid grid-cols-5 gap-4 min-h-[800px]">{/* Fixed 5-column layout, 10 rows = 50 deals */}
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
                    variant="hot" 
                  />
                ))}
              </div>
              
              {/* Show More Button */}
              {deals.length > displayCount && (
                <div className="text-center mt-12">
                  <Button
                    onClick={() => setDisplayCount(prev => prev + 50)}
                    className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    data-testid="button-show-more"
                  >
                    Show More Deals ({Math.min(50, deals.length - displayCount)} more)
                  </Button>
                  <p className="text-slate-500 mt-3">
                    Showing {displayCount} of {deals.length} hot deals
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="bg-red-100 p-4 rounded mb-4">
                DEBUG: No deals found. Loading: {dealsLoading.toString()}, Error: {error?.message || 'none'}, Deals: {JSON.stringify(deals)}
              </div>
              <div className="bg-gradient-to-br from-accent/10 to-primary/10 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Flame className="h-12 w-12 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3" data-testid="text-no-deals">
                No Hot Deals Available
              </h3>
              <p className="text-slate-600 text-lg max-w-md mx-auto" data-testid="text-no-deals-description">
                {searchQuery || selectedCategory !== "All Categories"
                  ? "Try adjusting your search or filter criteria to find more deals"
                  : "Check back soon for exclusive hot deals from our premium suppliers"}
              </p>
            </div>
          )}
        </section>
        </main>
      </div>
    </div>
  );
}
