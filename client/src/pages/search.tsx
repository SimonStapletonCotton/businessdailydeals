import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import { Search, Filter, Building2, Package, TrendingUp, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Deal, Company } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = [
  'All', 'Agriculture', 'Automotive', 'Construction', 'Electronics', 'Fashion',
  'Food & Beverage', 'Healthcare', 'Industrial', 'IT & Software', 'Manufacturing',
  'Mining', 'General Industry', 'Residential', 'Office Supplies', 'Retail', 'Security', 'Tourism', 'Transport', 
  'Utilities', 'Water', 'Other'
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"deals" | "companies" | "products">("deals");
  const [category, setCategory] = useState("All");
  const [dealType, setDealType] = useState<"all" | "hot" | "regular">("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  // Search deals
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['/api/search', searchType, searchQuery, category, dealType, priceRange],
    enabled: searchQuery.length > 0,
  });

  // Get hottest deals (trending)
  const { data: hottestDeals } = useQuery({
    queryKey: ['/api/deals/hottest'],
  });

  const handleSearch = () => {
    // Trigger search with current parameters
  };

  return (
    <div className="min-h-screen page-search">
      <Navbar />
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2" data-testid="text-search-title">
              Advanced Search & Discovery
            </h1>
            <p className="text-slate-600">Find the perfect deals, products, and companies for your business needs</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Search deals, products, or companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-3 text-lg"
                  data-testid="input-search-query"
                />
              </div>
              <Button 
                onClick={handleSearch} 
                size="lg" 
                className="px-8 bg-primary hover:bg-primary/90"
                data-testid="button-search"
              >
                Search
              </Button>
            </div>

            {/* Search Tabs */}
            <Tabs value={searchType} onValueChange={(value: any) => setSearchType(value)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="deals" data-testid="tab-deals">
                  <Package className="h-4 w-4 mr-2" />
                  Deals
                </TabsTrigger>
                <TabsTrigger value="companies" data-testid="tab-companies">
                  <Building2 className="h-4 w-4 mr-2" />
                  Companies
                </TabsTrigger>
                <TabsTrigger value="products" data-testid="tab-products">
                  <Search className="h-4 w-4 mr-2" />
                  Products
                </TabsTrigger>
              </TabsList>

              {/* Filters */}
              <div className="flex flex-wrap gap-4 mt-4 p-4 bg-slate-50 rounded-lg">
                <div className="flex-1 min-w-32">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {searchType === "deals" && (
                  <div className="flex-1 min-w-32">
                    <Select value={dealType} onValueChange={(value: any) => setDealType(value)}>
                      <SelectTrigger data-testid="select-deal-type">
                        <SelectValue placeholder="Deal Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Deals</SelectItem>
                        <SelectItem value="hot">Hot Deals</SelectItem>
                        <SelectItem value="regular">Regular Deals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex gap-2">
                  <Input
                    placeholder="Min Price (ZAR)"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-32"
                    type="number"
                    data-testid="input-price-min"
                  />
                  <Input
                    placeholder="Max Price (ZAR)"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-32"
                    type="number"
                    data-testid="input-price-max"
                  />
                </div>
              </div>

              {/* Search Results */}
              <TabsContent value="deals" className="space-y-6 mt-8">
                {isSearching ? (
                  <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-slate-600">Searching deals...</p>
                  </div>
                ) : searchResults?.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map((deal: Deal) => (
                      <Card key={deal.id} className="hover:shadow-lg transition-all duration-200" data-testid={`card-deal-${deal.id}`}>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg line-clamp-2">{deal.title}</CardTitle>
                            <Badge variant={deal.dealType === 'hot' ? 'default' : 'secondary'}>
                              {deal.dealType === 'hot' ? 'HOT' : 'REGULAR'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-slate-600 mb-4 line-clamp-2">{deal.description}</p>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-2xl font-bold text-primary">R{deal.price}</p>
                              {deal.originalPrice && (
                                <p className="text-2xl text-slate-700 line-through font-medium">R{deal.originalPrice}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <Eye className="h-4 w-4" />
                              <span>{deal.viewCount || 0}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">No deals found for "{searchQuery}"</p>
                  </div>
                ) : null}
              </TabsContent>

              <TabsContent value="companies" className="space-y-6 mt-8">
                {/* Companies search results */}
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">Company directory coming soon</p>
                </div>
              </TabsContent>

              <TabsContent value="products" className="space-y-6 mt-8">
                {/* Products search results */}
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">Product search coming soon</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Hottest Deals Section */}
      {hottestDeals && hottestDeals.length > 0 && !searchQuery && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-900">Hottest Deals Right Now</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hottestDeals.slice(0, 8).map((deal: Deal) => (
              <Card key={deal.id} className="group hover:shadow-xl transition-all duration-300 border-2 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {deal.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{deal.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xl font-bold text-primary">R{deal.price}</p>
                      {deal.discount && (
                        <Badge variant="secondary" className="mt-1">
                          {deal.discount}% OFF
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Eye className="h-4 w-4" />
                      <span>{deal.viewCount || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}