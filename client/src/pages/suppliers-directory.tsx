import { useState } from "react";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Package, 
  TrendingUp,
  Filter,
  Users,
  Star,
  Calendar
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface SupplierWithStats {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  businessDescription?: string;
  industry?: string;
  province?: string;
  city?: string;
  phone?: string;
  website?: string;
  activeDealsCount: number;
  totalDealsCount: number;
  joinedDate: string;
  lastActive: string;
  averageRating?: number;
  totalViews?: number;
}

export default function SuppliersDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProvince, setFilterProvince] = useState("all");
  const [filterIndustry, setFilterIndustry] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { data: suppliers, isLoading } = useQuery<SupplierWithStats[]>({
    queryKey: ["/api/suppliers/directory"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter and sort suppliers
  const filteredSuppliers = suppliers?.filter(supplier => {
    const matchesSearch = 
      (supplier.companyName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (supplier.firstName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (supplier.lastName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (supplier.businessDescription?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesProvince = filterProvince === "all" || supplier.province === filterProvince;
    const matchesIndustry = filterIndustry === "all" || supplier.industry === filterIndustry;
    
    return matchesSearch && matchesProvince && matchesIndustry;
  }) || [];

  // Sort suppliers
  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
      case "oldest":
        return new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime();
      case "most-deals":
        return (b.totalDealsCount || 0) - (a.totalDealsCount || 0);
      case "alphabetical":
        return (a.companyName || a.firstName || "").localeCompare(b.companyName || b.firstName || "");
      case "rating":
        return (b.averageRating || 0) - (a.averageRating || 0);
      default:
        return 0;
    }
  });

  // Get unique provinces and industries for filters
  const provinces = [...new Set(suppliers?.map(s => s.province).filter(Boolean))] || [];
  const industries = [...new Set(suppliers?.map(s => s.industry).filter(Boolean))] || [];

  const getSupplierName = (supplier: SupplierWithStats) => {
    return supplier.companyName || `${supplier.firstName || ""} ${supplier.lastName || ""}`.trim() || "Supplier";
  };

  const getStatusBadge = (supplier: SupplierWithStats) => {
    const lastActiveDate = new Date(supplier.lastActive);
    const daysSinceActive = Math.floor((Date.now() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceActive <= 7) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    } else if (daysSinceActive <= 30) {
      return <Badge className="bg-yellow-100 text-yellow-800">Recent</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
    }
  };

  return (
    <div className="min-h-screen page-suppliers-directory">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-accent/20 to-primary/20 p-4 rounded-full">
              <Building2 className="h-10 w-10 text-accent" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4" data-testid="text-page-title">
            Suppliers Directory
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Discover and connect with verified suppliers across South Africa. Find the right business partners for your needs.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-full w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                <Users className="h-7 w-7 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1" data-testid="text-total-suppliers">
                {suppliers?.length || 0}
              </div>
              <div className="text-sm text-slate-600">Total Suppliers</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-green-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-full w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1" data-testid="text-active-suppliers">
                {suppliers?.filter(s => {
                  const daysSinceActive = Math.floor((Date.now() - new Date(s.lastActive).getTime()) / (1000 * 60 * 60 * 24));
                  return daysSinceActive <= 7;
                }).length || 0}
              </div>
              <div className="text-sm text-slate-600">Active This Week</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-full w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                <Package className="h-7 w-7 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1" data-testid="text-total-deals">
                {suppliers?.reduce((sum, s) => sum + (s.totalDealsCount || 0), 0) || 0}
              </div>
              <div className="text-sm text-slate-600">Total Deals Posted</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-orange-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-3 rounded-full w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                <MapPin className="h-7 w-7 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1" data-testid="text-provinces">
                {provinces.length}
              </div>
              <div className="text-sm text-slate-600">Provinces Covered</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter Suppliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-suppliers"
                />
              </div>
              
              <Select value={filterProvince} onValueChange={setFilterProvince}>
                <SelectTrigger data-testid="select-filter-province">
                  <SelectValue placeholder="Filter by province" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Provinces</SelectItem>
                  {provinces.map(province => (
                    <SelectItem key={province} value={province}>{province}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterIndustry} onValueChange={setFilterIndustry}>
                <SelectTrigger data-testid="select-filter-industry">
                  <SelectValue placeholder="Filter by industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger data-testid="select-sort-by">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="most-deals">Most Deals</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedSuppliers.map((supplier) => (
            <Card key={supplier.id} className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-lg hover:shadow-xl transition-shadow" data-testid={`card-supplier-${supplier.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-slate-900 mb-2" data-testid={`text-supplier-name-${supplier.id}`}>
                      {getSupplierName(supplier)}
                    </CardTitle>
                    <div className="flex gap-2 mb-2">
                      {getStatusBadge(supplier)}
                      {supplier.averageRating && supplier.averageRating > 0 && (
                        <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {supplier.averageRating.toFixed(1)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-primary/10 to-primary/20 p-3 rounded-full">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Business Description */}
                {supplier.businessDescription && (
                  <p className="text-slate-600 text-sm line-clamp-2" title={supplier.businessDescription}>
                    {supplier.businessDescription}
                  </p>
                )}

                {/* Industry & Location */}
                <div className="space-y-2">
                  {supplier.industry && (
                    <div className="flex items-center text-slate-600 text-sm">
                      <Package className="h-4 w-4 mr-2 text-slate-400" />
                      {supplier.industry}
                    </div>
                  )}
                  {supplier.province && (
                    <div className="flex items-center text-slate-600 text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                      {supplier.province}
                      {supplier.city && `, ${supplier.city}`}
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  {supplier.email && (
                    <div className="flex items-center text-slate-600 text-sm">
                      <Mail className="h-4 w-4 mr-2 text-slate-400" />
                      <span className="truncate">{supplier.email}</span>
                    </div>
                  )}
                  {supplier.phone && (
                    <div className="flex items-center text-slate-600 text-sm">
                      <Phone className="h-4 w-4 mr-2 text-slate-400" />
                      {supplier.phone}
                    </div>
                  )}
                  {supplier.website && (
                    <div className="flex items-center text-slate-600 text-sm">
                      <Globe className="h-4 w-4 mr-2 text-slate-400" />
                      <a 
                        href={supplier.website.startsWith('http') ? supplier.website : `https://${supplier.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate"
                      >
                        {supplier.website}
                      </a>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200">
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-900">{supplier.activeDealsCount || 0}</div>
                    <div className="text-xs text-slate-600">Active Deals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-900">{supplier.totalDealsCount || 0}</div>
                    <div className="text-xs text-slate-600">Total Deals</div>
                  </div>
                </div>

                {/* Member Since */}
                <div className="flex items-center justify-center text-slate-500 text-xs pt-2 border-t border-slate-200">
                  <Calendar className="h-3 w-3 mr-1" />
                  Member since {new Date(supplier.joinedDate).toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' })}
                </div>

                {/* Contact Button */}
                <Button 
                  className="w-full bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90"
                  data-testid={`button-contact-${supplier.id}`}
                >
                  Contact Supplier
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {sortedSuppliers.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No suppliers found</h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Try adjusting your search criteria or filters to find more suppliers.
            </p>
          </div>
        )}

        {/* Results Summary */}
        {sortedSuppliers.length > 0 && (
          <div className="mt-8 text-center text-slate-600">
            Showing {sortedSuppliers.length} of {suppliers?.length || 0} suppliers
          </div>
        )}
      </main>
    </div>
  );
}