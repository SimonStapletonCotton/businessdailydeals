import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, TrendingUp, Users, MessageCircle, Flame } from "lucide-react";
import { Link } from "wouter";

export default function TestDashboard() {
  const [deals] = useState([
    { id: "1", title: "Professional Business Consulting Services", category: "Business Services", price: "R2,500", dealType: "hot", status: "active" },
    { id: "2", title: "Industrial Equipment Maintenance", category: "Manufacturing", price: "R1,200", dealType: "regular", status: "active" },
    { id: "3", title: "Software Development Package", category: "Technology", price: "R5,000", dealType: "hot", status: "active" }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-slate-100">
      {/* Navbar */}
      <nav className="bg-slate-600 shadow-sm border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-white">Business Daily Deals</h1>
              <Badge variant="secondary">Supplier Dashboard - Test Mode</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-orange-100">Test Supplier Account</span>
              <Link href="/" className="text-orange-100 hover:text-white">← Back to Home</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Supplier Dashboard</h1>
          <p className="text-gray-600">Manage your deals and track performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+15% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">+3 new today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credits</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">150</div>
              <p className="text-xs text-muted-foregreen">R375.00 value</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Deals Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Your Active Deals</CardTitle>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Create New Deal
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {deal.dealType === 'hot' && <Flame className="h-5 w-5 text-red-500" />}
                    <div>
                      <h3 className="font-semibold text-gray-900">{deal.title}</h3>
                      <p className="text-sm text-gray-600">{deal.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant={deal.dealType === 'hot' ? 'destructive' : 'secondary'}>
                      {deal.dealType === 'hot' ? 'Hot Deal' : 'Regular'}
                    </Badge>
                    <span className="font-semibold text-green-600">{deal.price}</span>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Post New Deal
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="h-4 w-4 mr-2" />
                View Inquiries
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>New inquiry received</span>
                  <span className="text-gray-500">2h ago</span>
                </div>
                <div className="flex justify-between">
                  <span>Deal views increased</span>
                  <span className="text-gray-500">5h ago</span>
                </div>
                <div className="flex justify-between">
                  <span>Profile updated</span>
                  <span className="text-gray-500">1d ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Conversion Rate</span>
                  <Badge variant="secondary">12%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Response Time</span>
                  <Badge variant="secondary">2.5h</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Customer Rating</span>
                  <Badge variant="secondary">4.8/5</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}