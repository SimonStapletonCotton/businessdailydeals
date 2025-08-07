import { useEffect } from "react";
import Navbar from "@/components/navbar";
import DealCard from "@/components/deal-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Flame } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DealWithSupplier } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function HotDeals() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: deals, isLoading: dealsLoading } = useQuery<DealWithSupplier[]>({
    queryKey: ["/api/deals", { type: "hot", search: searchQuery, category: selectedCategory }],
    enabled: isAuthenticated,
  });

  const categories = [
    "All Categories",
    "Electronics",
    "Industrial Equipment", 
    "Office Supplies",
    "Software & Services"
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center mb-2" data-testid="text-page-title">
            <Flame className="text-red-500 mr-3" />
            Hot Deals
            <span className="ml-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
              Premium
            </span>
          </h1>
          <p className="text-muted-foreground">
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

        {/* Deals Grid */}
        <section>
          {dealsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }, (_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="w-full h-48 bg-muted rounded-t-xl"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-4"></div>
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded mb-4"></div>
                    <div className="h-10 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : deals && deals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((deal: DealWithSupplier) => (
                <DealCard key={deal.id} deal={deal} variant="hot" />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Flame className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2" data-testid="text-no-deals">
                No hot deals found
              </h3>
              <p className="text-muted-foreground" data-testid="text-no-deals-description">
                {searchQuery || selectedCategory !== "All Categories"
                  ? "Try adjusting your search or filter criteria"
                  : "Check back soon for new hot deals from our suppliers"}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
