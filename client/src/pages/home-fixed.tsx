import React, { useEffect } from "react";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, ArrowRight, TrendingUp, Users, ShieldCheck, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

// Cache issue resolved - keeping February 2026 content
console.log("✅ Homepage loaded with February 20th, 2026 promotional period");

export default function HomeFixed() {
  useEffect(() => {
    document.title = "Business Daily Deals - South African B2B Marketplace";
  }, []);

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    staleTime: 0,
  });

  const { data: hotDeals } = useQuery({
    queryKey: ["/api/deals", "hot"],
    staleTime: 0,
  });



  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-slate-200">
      <Navbar />
      
      {/* Cache fix successful - remove debug banner */}

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Business Daily Deals
          </h1>
          <h2 className="text-3xl text-gray-700 mb-8">
            South Africa's Premier B2B Marketplace
          </h2>
          
          {/* PROMOTIONAL BANNER - February 20th, 2026 */}
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-2xl mb-12 mx-auto max-w-4xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 mr-3" />
                <span className="text-3xl font-bold">LIMITED TIME OFFER</span>
              </div>
              <h3 className="text-5xl font-extrabold mb-4">
                🎉 100% FREE DEAL POSTING 🎉
              </h3>
              <p className="text-xl mb-6">
                No charges for suppliers until <strong>February 20th, 2026</strong>
              </p>
              <div className="bg-white/20 rounded-lg p-4 text-center">
                <p className="text-lg">
                  Build your customer base during our promotional launch period!
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 text-xl shadow-lg transform hover:scale-105 transition-all"
                data-testid="button-start-selling"
              >
                <Flame className="h-6 w-6 mr-2" />
                Start Selling Today - FREE!
              </Button>
            </Link>
            <Link to="/hot-deals">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-4 text-xl shadow-lg transform hover:scale-105 transition-all"
                data-testid="button-browse-deals"
              >
                <ArrowRight className="h-6 w-6 mr-2" />
                Browse Hot Deals
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        {stats && (stats as any).totalDeals && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center bg-white/80 backdrop-blur shadow-xl">
              <CardContent className="p-8">
                <TrendingUp className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{(stats as any).totalDeals}</h3>
                <p className="text-gray-600 text-lg">Active Deals</p>
              </CardContent>
            </Card>
            <Card className="text-center bg-white/80 backdrop-blur shadow-xl">
              <CardContent className="p-8">
                <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{(stats as any).activeSuppliers}</h3>
                <p className="text-gray-600 text-lg">Active Suppliers</p>
              </CardContent>
            </Card>
            <Card className="text-center bg-white/80 backdrop-blur shadow-xl">
              <CardContent className="p-8">
                <ShieldCheck className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-800 mb-2">R{(stats as any).totalSavings?.toLocaleString()}</h3>
                <p className="text-gray-600 text-lg">Total Savings</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/80 backdrop-blur shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="bg-orange-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold mb-4">Suppliers Post Deals</h3>
                <p className="text-gray-600">
                  List your products and services with special pricing for the B2B market.
                  <strong> 100% FREE until February 20th, 2026!</strong>
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold mb-4">Buyers Discover</h3>
                <p className="text-gray-600">
                  Search and browse deals, set up keyword notifications for relevant opportunities.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold mb-4">Connect & Save</h3>
                <p className="text-gray-600">
                  Direct inquiries between buyers and suppliers, with secure coupon system for tracking.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Featured Hot Deals */}
        {hotDeals && Array.isArray(hotDeals) && hotDeals.length > 0 && (
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">Featured Hot Deals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotDeals.slice(0, 3).map((deal: any) => (
                <Card key={deal.id} className="bg-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
                  <CardContent className="p-6">
                    {deal.imageUrl && (
                      <img 
                        src={deal.imageUrl} 
                        alt={deal.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="flex items-center mb-2">
                      <Flame className="h-5 w-5 text-red-500 mr-2" />
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-semibold">
                        HOT DEAL
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{deal.title}</h3>
                    <p className="text-gray-600 mb-4">{deal.description?.substring(0, 100)}...</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-green-600">R{deal.price}</span>
                        {deal.originalPrice && (
                          <span className="text-gray-500 line-through ml-2">R{deal.originalPrice}</span>
                        )}
                      </div>
                      <Link to={`/deals/${deal.id}`}>
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                          View Deal
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-slate-800 to-slate-900 text-white border-0 shadow-2xl">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold mb-6">Ready to Start?</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Join South Africa's fastest-growing B2B marketplace. 
                <strong> No charges until February 20th, 2026!</strong>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button 
                    size="lg" 
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-xl"
                    data-testid="button-register-supplier"
                  >
                    Register as Supplier
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-black bg-white hover:bg-gray-100 px-8 py-4 text-xl"
                    data-testid="button-register-buyer"
                  >
                    Register as Buyer
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}