import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Users, ShoppingBag, Search, Eye, Flame, Package } from "lucide-react";
import { Link } from "wouter";

export default function WorkingHome() {
  const [stats] = useState({
    activeSuppliers: "1",
    totalDeals: "13", 
    successfulConnections: "01",
    totalSavings: 10023
  });

  const [hotDeals] = useState([
    { id: "1", title: "Professional Business Consulting", category: "Services", price: "R2,500", originalPrice: "R3,000", imageUrl: "/api/image-proxy/business-1.jpg" },
    { id: "2", title: "Industrial Equipment Package", category: "Manufacturing", price: "R15,000", originalPrice: "R18,000", imageUrl: "/api/image-proxy/business-2.jpg" },
    { id: "3", title: "Software Development Bundle", category: "Technology", price: "R8,500", originalPrice: "R12,000", imageUrl: "/api/image-proxy/business-3.jpg" }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-slate-600 shadow-sm border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Business Daily Deals</h1>
              <Badge variant="secondary">South Africa's B2B Marketplace</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/test-dashboard" className="text-orange-200 hover:text-white">Test Dashboard</Link>
              <Link href="/hot-deals" className="text-orange-200 hover:text-white">Hot Deals</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            South Africa's Premier B2B Marketplace
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect suppliers with buyers through exclusive daily deals and special pricing
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/test-dashboard">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                <Package className="h-5 w-5 mr-2" />
                View Dashboard
              </Button>
            </Link>
            <Link href="/hot-deals">
              <Button size="lg" variant="outline">
                <Flame className="h-5 w-5 mr-2" />
                Browse Hot Deals
              </Button>
            </Link>
          </div>
        </div>

        {/* Business Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Suppliers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.activeSuppliers}</div>
              <div className="flex items-center justify-center mt-2">
                <Users className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-gray-500">Verified Partners</span>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalDeals}</div>
              <div className="flex items-center justify-center mt-2">
                <ShoppingBag className="h-4 w-4 text-blue-600 mr-1" />
                <span className="text-sm text-gray-500">Live Offers</span>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Connections Made</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.successfulConnections}</div>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="h-4 w-4 text-purple-600 mr-1" />
                <span className="text-sm text-gray-500">This Month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">R{stats.totalSavings?.toLocaleString()}</div>
              <div className="flex items-center justify-center mt-2">
                <Star className="h-4 w-4 text-orange-600 mr-1" />
                <span className="text-sm text-gray-500">Customer Value</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hot Deals Preview */}
        <Card className="mb-12">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Flame className="h-6 w-6 text-red-500" />
                <CardTitle className="text-2xl">Featured Hot Deals</CardTitle>
              </div>
              <Link href="/hot-deals">
                <Button variant="outline">View All Deals</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hotDeals.map((deal) => (
                <Card key={deal.id} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 relative">
                    <img 
                      src={deal.imageUrl} 
                      alt={deal.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-red-600">Hot Deal</Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{deal.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{deal.category}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xl font-bold text-green-600">{deal.price}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">{deal.originalPrice}</span>
                      </div>
                      <Button size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">How Business Daily Deals Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">1. Suppliers Post Deals</h3>
                <p className="text-gray-600">Verified suppliers list their products and services with special pricing</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">2. Buyers Discover</h3>
                <p className="text-gray-600">Buyers browse deals, search categories, and get keyword notifications</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">3. Business Grows</h3>
                <p className="text-gray-600">Direct connections lead to successful transactions and partnerships</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/test-dashboard">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Package className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Supplier Dashboard</h3>
                <p className="text-sm text-gray-600">Manage deals and track performance</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/hot-deals">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Flame className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Hot Deals</h3>
                <p className="text-sm text-gray-600">Premium deals with priority placement</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/regular-deals">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <ShoppingBag className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Regular Deals</h3>
                <p className="text-sm text-gray-600">Browse all available deals</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/search">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Search className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Search</h3>
                <p className="text-sm text-gray-600">Find specific products and services</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}