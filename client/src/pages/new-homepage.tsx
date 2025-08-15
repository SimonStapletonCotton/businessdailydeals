import { useEffect } from "react";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export default function NewHomepage() {
  useEffect(() => {
    document.title = "NEW HOMEPAGE - FEBRUARY 20TH 2026 FREE";
    
    // Add unmistakable visual proof this page loaded
    const proof = document.createElement('div');
    proof.style.cssText = `
      position: fixed; 
      top: 0; 
      left: 0; 
      right: 0; 
      background: #ff0000; 
      color: #ffffff; 
      padding: 20px; 
      text-align: center; 
      font-size: 24px; 
      font-weight: bold; 
      z-index: 10000;
      border: 5px solid yellow;
    `;
    proof.textContent = "✅ NEW HOMEPAGE LOADED - FEBRUARY 20TH 2026 FREE PROMOTION ACTIVE!";
    document.body.appendChild(proof);
    
    console.log("🎯 NEW HOMEPAGE LOADED WITH FEBRUARY 20TH 2026 DATES");
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
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Navbar />
      
      {/* Push content down to avoid overlap with fixed header */}
      <div style={{ marginTop: '100px' }}>
        
        {/* MASSIVE BANNER - IMPOSSIBLE TO MISS */}
        <div style={{
          background: '#059669',
          color: 'white',
          textAlign: 'center',
          padding: '40px',
          margin: '20px',
          border: '8px solid #fbbf24',
          borderRadius: '20px',
          fontSize: '28px',
          fontWeight: 'bold'
        }}>
          🎉 CONFIRMED: ALL DEAL POSTING IS FREE UNTIL FEBRUARY 20TH, 2026! 🎉
          <div style={{ fontSize: '20px', marginTop: '10px' }}>
            No fees, no costs - start advertising your business today!
          </div>
        </div>

        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 style={{ 
              fontSize: '4rem', 
              fontWeight: 'bold', 
              color: 'white', 
              marginBottom: '24px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
              Business Daily <span style={{ color: '#fbbf24' }}>Deals</span>
            </h1>
            
            <p style={{
              fontSize: '1.5rem',
              color: 'white',
              marginBottom: '32px',
              maxWidth: '800px',
              margin: '0 auto 32px auto'
            }}>
              South Africa's Premier B2B Marketplace - FREE PROMOTIONAL PERIOD UNTIL FEBRUARY 20TH, 2026!
            </p>
            
            {/* SECONDARY PROMOTION BANNER */}
            <div style={{
              background: '#dc2626',
              color: 'white',
              padding: '30px',
              borderRadius: '15px',
              marginBottom: '32px',
              maxWidth: '900px',
              margin: '0 auto 32px auto',
              border: '4px solid white'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '15px' }}>
                🚀 LIMITED TIME LAUNCH OFFER! 🚀
              </div>
              <div style={{ fontSize: '1.25rem' }}>
                <strong>Post unlimited business deals completely FREE until February 20th, 2026!</strong>
              </div>
              <div style={{ fontSize: '1rem', marginTop: '10px', opacity: '0.9' }}>
                Build your customer base during our promotional launch period
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link href="/register-supplier">
                <Button 
                  size="lg" 
                  style={{
                    background: '#059669',
                    color: 'white',
                    padding: '16px 32px',
                    fontSize: '1.25rem',
                    fontWeight: 'bold'
                  }}
                >
                  Start Selling FREE Today
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Link href="/hot-deals">
                <Button 
                  size="lg" 
                  variant="outline" 
                  style={{
                    borderColor: '#fbbf24',
                    color: '#fbbf24',
                    padding: '16px 32px',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    background: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <Flame className="mr-3 h-6 w-6" />
                  Browse Hot Deals
                </Button>
              </Link>
            </div>
          </div>

          {/* Business Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <Card style={{ background: 'rgba(255, 255, 255, 0.95)', textAlign: 'center' }}>
              <CardHeader className="pb-4">
                <CardTitle style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#059669' }}>
                  {(stats as any)?.activeSuppliers || "1"}
                </CardTitle>
                <CardDescription style={{ color: '#374151', fontWeight: '600' }}>Active Suppliers</CardDescription>
              </CardHeader>
            </Card>
            <Card style={{ background: 'rgba(255, 255, 255, 0.95)', textAlign: 'center' }}>
              <CardHeader className="pb-4">
                <CardTitle style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#059669' }}>
                  {(stats as any)?.totalDeals || "13"}
                </CardTitle>
                <CardDescription style={{ color: '#374151', fontWeight: '600' }}>Total Deals</CardDescription>
              </CardHeader>
            </Card>
            <Card style={{ background: 'rgba(255, 255, 255, 0.95)', textAlign: 'center' }}>
              <CardHeader className="pb-4">
                <CardTitle style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#059669' }}>
                  {(stats as any)?.successfulConnections || "01"}
                </CardTitle>
                <CardDescription style={{ color: '#374151', fontWeight: '600' }}>Successful Connections</CardDescription>
              </CardHeader>
            </Card>
            <Card style={{ background: 'rgba(255, 255, 255, 0.95)', textAlign: 'center' }}>
              <CardHeader className="pb-4">
                <CardTitle style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#059669' }}>
                  R{(stats as any)?.totalSavings?.toLocaleString() || '10,023'}
                </CardTitle>
                <CardDescription style={{ color: '#374151', fontWeight: '600' }}>Total Savings</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Featured Hot Deals */}
          {hotDeals && Array.isArray(hotDeals) && hotDeals.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: 'bold', 
                  color: 'white',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}>
                  <Flame className="h-10 w-10 text-yellow-400 inline mr-3" />
                  Featured Hot Deals
                </h2>
                <Link href="/hot-deals">
                  <Button 
                    variant="outline" 
                    style={{
                      borderColor: '#fbbf24',
                      color: '#fbbf24',
                      background: 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    View All Deals
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {hotDeals.slice(0, 6).map((deal: any) => (
                  <Card key={deal.id} style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge style={{ background: '#059669', color: 'white' }}>HOT DEAL</Badge>
                        <Badge variant="outline" style={{ borderColor: '#059669', color: '#059669' }}>
                          Save R{deal.savings?.toLocaleString() || '0'}
                        </Badge>
                      </div>
                      <CardTitle style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#374151' }}>
                        {deal.title}
                      </CardTitle>
                      <CardDescription style={{ color: '#6b7280', fontWeight: '500' }}>
                        {deal.companyName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                        {deal.description}
                      </p>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
                            R{deal.price}
                          </span>
                          {deal.originalPrice && (
                            <span style={{ fontSize: '1rem', color: '#9ca3af', textDecoration: 'line-through', marginLeft: '8px' }}>
                              R{deal.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                      <Link href={`/coupon/${deal.id}`}>
                        <Button style={{ width: '100%', background: '#059669', color: 'white' }}>
                          Get Deal
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer style={{ background: '#1f2937', color: 'white', padding: '48px 0' }}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', color: '#fbbf24' }}>
                  Business Daily Deals
                </h3>
                <p style={{ color: '#d1d5db', lineHeight: '1.6' }}>
                  South Africa's premier B2B marketplace - completely FREE during our promotional period until February 20th, 2026!
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '24px', color: '#fbbf24' }}>
                  Promotional Info
                </h4>
                <div style={{ color: '#d1d5db' }}>
                  <p>Credit System: 1 Credit = R2.50</p>
                  <p style={{ fontWeight: 'bold', color: '#fbbf24', fontSize: '1.125rem' }}>
                    FREE until February 20th, 2026!
                  </p>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '24px', color: '#fbbf24' }}>
                  Quick Links
                </h4>
                <div style={{ color: '#d1d5db' }}>
                  <Link href="/hot-deals" style={{ display: 'block', marginBottom: '8px' }}>Hot Deals</Link>
                  <Link href="/suppliers-directory" style={{ display: 'block', marginBottom: '8px' }}>Suppliers Directory</Link>
                  <Link href="/find-me-deal" style={{ display: 'block', marginBottom: '8px' }}>Find Me a Deal</Link>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '24px', color: '#fbbf24' }}>
                  Support
                </h4>
                <div style={{ color: '#d1d5db' }}>
                  <Link href="/support" style={{ display: 'block', marginBottom: '8px' }}>Help Center</Link>
                  <Link href="/contact" style={{ display: 'block', marginBottom: '8px' }}>Contact Us</Link>
                  <Link href="/terms-of-service" style={{ display: 'block', marginBottom: '8px' }}>Terms of Service</Link>
                </div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #374151', marginTop: '48px', paddingTop: '32px', textAlign: 'center', color: '#d1d5db' }}>
              <p>&copy; 2025 Business Daily Deals. FREE promotional period until February 20th, 2026!</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}