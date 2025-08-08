import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package, Search, Filter, TrendingUp, Building2, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Deal, Company } from "@shared/schema";

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const categories = [
  'All', 'Agriculture', 'Automotive', 'Construction', 'Electronics', 'Fashion',
  'Food & Beverage', 'Healthcare', 'Industrial', 'IT & Software', 'Manufacturing',
  'Mining', 'Office Supplies', 'Retail', 'Security', 'Tourism', 'Transport', 
  'Utilities', 'Water', 'Other'
];

export default function ProductDirectoryPage() {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewType, setViewType] = useState<"products" | "companies">("products");

  // Get all products/deals for directory
  const { data: directoryData, isLoading } = useQuery({
    queryKey: ['/api/directory', viewType, selectedLetter, selectedCategory, searchQuery],
  });

  // Get featured products
  const { data: featuredProducts } = useQuery({
    queryKey: ['/api/directory/featured'],
  });

  const filteredAlphabet = alphabet.filter(letter => 
    directoryData?.some((item: any) => 
      item.title?.toUpperCase().startsWith(letter) || 
      item.name?.toUpperCase().startsWith(letter)
    )
  );

  return (
    <div className="min-h-screen page-directory">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900" data-testid="text-directory-title">
                Product & Company Directory
              </h1>
            </div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Browse our comprehensive alphabetical directory of products and companies. 
              Find exactly what you're looking for with hot deals and regular offerings.
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex justify-center mb-6">
            <Tabs value={viewType} onValueChange={(value: any) => setViewType(value)} className="w-full max-w-md">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="products" data-testid="tab-products">
                  <Package className="h-4 w-4 mr-2" />
                  Products
                </TabsTrigger>
                <TabsTrigger value="companies" data-testid="tab-companies">
                  <Building2 className="h-4 w-4 mr-2" />
                  Companies
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder={`Search ${viewType}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-directory-search"
                />
              </div>
              <div className="w-full md:w-48">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger data-testid="select-directory-category">
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
            </div>
          </div>

          {/* Alphabetical Navigation */}
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <Button
                variant={selectedLetter === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLetter(null)}
                data-testid="button-letter-all"
              >
                All
              </Button>
              {filteredAlphabet.map((letter) => (
                <Button
                  key={letter}
                  variant={selectedLetter === letter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLetter(letter)}
                  className="w-10 h-10"
                  data-testid={`button-letter-${letter}`}
                >
                  {letter}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Section */}
        {!searchQuery && !selectedLetter && featuredProducts && featuredProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Star className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-slate-900">Featured Today</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((item: Deal) => (
                <Card key={item.id} className="group hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </CardTitle>
                      <Badge variant={item.dealType === 'hot' ? 'default' : 'secondary'}>
                        {item.dealType === 'hot' ? 'HOT' : 'REGULAR'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-xl font-bold text-primary">R{item.price}</p>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Eye className="h-4 w-4" />
                        <span>{item.viewCount || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Directory Content */}
        <Tabs value={viewType} className="w-full">
          <TabsContent value="products">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-slate-600">Loading products...</p>
              </div>
            ) : directoryData && directoryData.length > 0 ? (
              <div className="space-y-8">
                {/* Group by first letter */}
                {selectedLetter ? (
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <span className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl">
                        {selectedLetter}
                      </span>
                      Products starting with "{selectedLetter}"
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {directoryData
                        .filter((item: Deal) => item.title.toUpperCase().startsWith(selectedLetter))
                        .map((product: Deal) => (
                          <Card key={product.id} className="hover:shadow-lg transition-all duration-200" data-testid={`card-product-${product.id}`}>
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
                                <Badge variant={product.dealType === 'hot' ? 'default' : 'secondary'}>
                                  {product.dealType === 'hot' ? 'HOT' : 'REGULAR'}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-slate-600 mb-3 line-clamp-2">{product.description}</p>
                              <Badge variant="outline" className="mb-3">{product.category}</Badge>
                              <div className="flex justify-between items-center">
                                <p className="text-xl font-bold text-primary">R{product.price}</p>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                  <Eye className="h-4 w-4" />
                                  <span>{product.viewCount || 0}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      }
                    </div>
                  </div>
                ) : (
                  alphabet.map((letter) => {
                    const letterProducts = directoryData.filter((item: Deal) => 
                      item.title.toUpperCase().startsWith(letter)
                    );
                    
                    if (letterProducts.length === 0) return null;
                    
                    return (
                      <div key={letter}>
                        <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                          <span className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl">
                            {letter}
                          </span>
                          {letterProducts.length} product{letterProducts.length !== 1 ? 's' : ''}
                        </h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                          {letterProducts.slice(0, 8).map((product: Deal) => (
                            <Card key={product.id} className="hover:shadow-lg transition-all duration-200">
                              <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                  <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
                                  <Badge variant={product.dealType === 'hot' ? 'default' : 'secondary'}>
                                    {product.dealType === 'hot' ? 'HOT' : 'REGULAR'}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{product.description}</p>
                                <Badge variant="outline" className="mb-3">{product.category}</Badge>
                                <div className="flex justify-between items-center">
                                  <p className="text-xl font-bold text-primary">R{product.price}</p>
                                  <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Eye className="h-4 w-4" />
                                    <span>{product.viewCount || 0}</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        {letterProducts.length > 8 && (
                          <div className="text-center mb-8">
                            <Button 
                              variant="outline" 
                              onClick={() => setSelectedLetter(letter)}
                              data-testid={`button-view-all-${letter}`}
                            >
                              View all {letterProducts.length} products starting with "{letter}"
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">
                  {searchQuery || selectedLetter 
                    ? "No products found matching your criteria"
                    : "No products available"
                  }
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="companies">
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">Company directory coming soon</p>
              <p className="text-sm text-slate-500 mt-2">We're building a comprehensive directory of all registered companies</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}