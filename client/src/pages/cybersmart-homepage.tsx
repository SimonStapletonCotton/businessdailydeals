import { useEffect } from "react";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, ArrowRight, TrendingUp, Users, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export default function CybersmartHomepage() {
  useEffect(() => {
    document.title = "Business Daily Deals - FREE UNTIL FEBRUARY 20TH 2026";
    
    console.log("🎯 CYBERSMART HOMEPAGE LOADED WITH FEBRUARY 20TH 2026 DATES");
    console.log("📅 Current timestamp:", Date.now());
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
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #ffcc80 0%, #ffb74d 25%, #c8b8a0 75%, #8fa3b8 100%)'
    }}>
      <Navbar />
      
      {/* Casino 7's Container - Contained spinning area near top */}
      <div style={{
        background: 'rgba(0,0,0,0.8)',
        margin: '20px auto',
        maxWidth: '600px',
        padding: '30px',
        borderRadius: '20px',
        border: '4px solid #d4af37',
        boxShadow: '0 0 30px rgba(212, 175, 55, 0.8)',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '40px',
          marginBottom: '20px'
        }}>
          <span style={{ 
            color: '#ff0000', 
            fontSize: '6rem', 
            fontWeight: 'bold',
            animation: 'spin 3s linear infinite',
            textShadow: '0 0 20px #ff0000'
          }}>7</span>
          <span style={{ 
            color: '#ff0000', 
            fontSize: '6rem', 
            fontWeight: 'bold',
            animation: 'spin 3s linear infinite 1s',
            textShadow: '0 0 20px #ff0000'
          }}>7</span>
          <span style={{ 
            color: '#ff0000', 
            fontSize: '6rem', 
            fontWeight: 'bold',
            animation: 'spin 3s linear infinite 2s',
            textShadow: '0 0 20px #ff0000'
          }}>7</span>
        </div>
        <div style={{
          color: '#d4af37',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
        }}>
          🎰 JACKPOT LAUNCH! 🎰
        </div>
      </div>

      {/* FREE Promotional Banner */}
      <div style={{
        background: 'linear-gradient(45deg, #ff6b00, #ff8f00, #ff6b00)',
        color: 'white',
        textAlign: 'center',
        padding: '40px 20px',
        margin: '20px',
        border: '4px solid #d4af37',
        borderRadius: '15px',
        boxShadow: '0 0 25px rgba(255, 107, 0, 0.6)',
        animation: 'pulse 2s infinite'
      }}>
        <div style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold',
          marginBottom: '15px',
          textShadow: '3px 3px 6px rgba(0,0,0,0.5)'
        }}>
          🎉 FREE PROMOTIONAL PERIOD ACTIVE! 🎉
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          ALL DEAL POSTING IS FREE UNTIL FEBRUARY 20TH, 2026!
        </div>
        <div style={{ 
          fontSize: '1.25rem', 
          marginTop: '15px',
          background: '#d4af37',
          color: '#000',
          padding: '10px 20px',
          borderRadius: '25px',
          display: 'inline-block',
          fontWeight: 'bold'
        }}>
          NO COST • NO FEES • START TODAY!
        </div>
      </div>

      {/* Main Title */}
      <div className="text-center mb-8">
        <h1 style={{
          fontSize: '6rem',
          fontWeight: 'bold',
          color: '#4a5568',
          marginBottom: '20px',
          textShadow: '4px 4px 8px rgba(255,255,255,0.8)'
        }}>
          Business Daily <span style={{ color: '#ff6b00' }}>Deals</span>
        </h1>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <p style={{
            fontSize: '2rem',
            color: '#4a5568',
            marginBottom: '32px',
            maxWidth: '900px',
            margin: '0 auto 32px auto',
            fontWeight: '600',
            textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
          }}>
            South Africa's Premier B2B Marketplace - COMPLETELY FREE UNTIL FEBRUARY 20TH, 2026!
          </p>
          
          {/* Casino-style jackpot banner */}
          <div style={{
            background: 'linear-gradient(45deg, #ff0000, #dc143c, #ff0000)',
            color: 'white',
            padding: '30px',
            borderRadius: '20px',
            marginBottom: '32px',
            maxWidth: '1000px',
            margin: '0 auto 32px auto',
            border: '6px solid #d4af37',
            boxShadow: '0 0 40px rgba(255,0,0,0.5)',
            animation: 'glow 2s ease-in-out infinite alternate'
          }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '15px' }}>
              🎰 JACKPOT LAUNCH OFFER! 🎰
            </div>
            <div style={{ fontSize: '1.5rem' }}>
              <strong>Hit the jackpot with unlimited FREE deal posting until February 20th, 2026!</strong>
            </div>
            <div style={{ fontSize: '1rem', marginTop: '15px', opacity: '0.95' }}>
              Build your business network during our grand opening celebration
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link href="/supplier-registration">
              <Button size="lg" style={{
                background: 'linear-gradient(45deg, #ff6b00, #ff8f00)',
                color: 'white',
                padding: '20px 40px',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                border: '3px solid #d4af37',
                borderRadius: '15px',
                boxShadow: '0 6px 20px rgba(255,107,0,0.4)',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}>
                <Flame className="mr-2 h-6 w-6" />
                Start Selling FREE
              </Button>
            </Link>
            <Link href="/buyer-registration">
              <Button variant="outline" size="lg" style={{
                background: 'rgba(255,255,255,0.9)',
                color: '#4a5568',
                padding: '20px 40px',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                border: '3px solid #4a5568',
                borderRadius: '15px',
                boxShadow: '0 6px 20px rgba(74,85,104,0.2)'
              }}>
                <ArrowRight className="mr-2 h-6 w-6" />
                Find Deals
              </Button>
            </Link>
          </div>
        </div>

        {/* Business Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card style={{
            background: 'rgba(255,255,255,0.95)',
            border: '2px solid #d4af37',
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(212,175,55,0.3)'
          }}>
            <CardContent className="p-6 text-center">
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ff6b00' }}>
                {stats?.activeSuppliers || 127}
              </div>
              <div style={{ fontSize: '1.1rem', color: '#4a5568', fontWeight: '600' }}>
                Active Suppliers
              </div>
            </CardContent>
          </Card>
          
          <Card style={{
            background: 'rgba(255,255,255,0.95)',
            border: '2px solid #d4af37',
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(212,175,55,0.3)'
          }}>
            <CardContent className="p-6 text-center">
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ff6b00' }}>
                {stats?.totalDeals || 13}
              </div>
              <div style={{ fontSize: '1.1rem', color: '#4a5568', fontWeight: '600' }}>
                Active Deals
              </div>
            </CardContent>
          </Card>
          
          <Card style={{
            background: 'rgba(255,255,255,0.95)',
            border: '2px solid #d4af37',
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(212,175,55,0.3)'
          }}>
            <CardContent className="p-6 text-center">
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ff6b00' }}>
                {stats?.successfulConnections || 89}
              </div>
              <div style={{ fontSize: '1.1rem', color: '#4a5568', fontWeight: '600' }}>
                Successful Connections
              </div>
            </CardContent>
          </Card>
          
          <Card style={{
            background: 'rgba(255,255,255,0.95)',
            border: '2px solid #d4af37',
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(212,175,55,0.3)'
          }}>
            <CardContent className="p-6 text-center">
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ff6b00' }}>
                R{(stats?.calculatedSavings || 75650).toLocaleString()}
              </div>
              <div style={{ fontSize: '1.1rem', color: '#4a5568', fontWeight: '600' }}>
                Total Savings
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hot Deals Preview */}
        {hotDeals && hotDeals.length > 0 && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: '#4a5568',
                marginBottom: '16px',
                textShadow: '3px 3px 6px rgba(255,255,255,0.8)'
              }}>
                🔥 Featured Hot Deals
              </h2>
              <p style={{
                fontSize: '1.25rem',
                color: '#6b7280',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Premium deals with priority homepage placement
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {hotDeals.slice(0, 6).map((deal: any) => (
                <Card key={deal.id} style={{
                  background: 'rgba(255,255,255,0.95)',
                  border: '2px solid #ff6b00',
                  borderRadius: '15px',
                  boxShadow: '0 8px 25px rgba(255,107,0,0.2)',
                  transition: 'all 0.3s ease'
                }}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge style={{
                        background: 'linear-gradient(45deg, #ff0000, #dc143c)',
                        color: 'white',
                        fontWeight: 'bold'
                      }}>
                        🔥 HOT
                      </Badge>
                      <span style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: '#059669'
                      }}>
                        R{deal.price}
                      </span>
                    </div>
                    <CardTitle style={{ color: '#4a5568' }}>{deal.title}</CardTitle>
                    <CardDescription>{deal.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {deal.imageUrl && (
                      <img 
                        src={deal.imageUrl} 
                        alt={deal.title}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '10px',
                          marginBottom: '16px'
                        }}
                      />
                    )}
                    <Button style={{
                      background: 'linear-gradient(45deg, #ff6b00, #ff8f00)',
                      color: 'white',
                      width: '100%',
                      fontWeight: 'bold'
                    }}>
                      View Deal
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Link href="/hot-deals">
                <Button size="lg" style={{
                  background: 'linear-gradient(45deg, #ff0000, #dc143c)',
                  color: 'white',
                  padding: '15px 30px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  border: '2px solid #d4af37',
                  borderRadius: '12px'
                }}>
                  View All Hot Deals <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="text-center mb-12">
          <h2 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#4a5568',
            marginBottom: '48px',
            textShadow: '3px 3px 6px rgba(255,255,255,0.8)'
          }}>
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card style={{
              background: 'rgba(255,255,255,0.95)',
              border: '2px solid #d4af37',
              borderRadius: '15px',
              boxShadow: '0 8px 25px rgba(212,175,55,0.3)'
            }}>
              <CardContent className="p-8 text-center">
                <Users style={{ 
                  width: '4rem', 
                  height: '4rem', 
                  color: '#ff6b00', 
                  margin: '0 auto 24px auto' 
                }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4a5568', marginBottom: '16px' }}>
                  1. Register FREE
                </h3>
                <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                  Sign up as a supplier or buyer. No fees during our promotional period until February 20th, 2026!
                </p>
              </CardContent>
            </Card>
            
            <Card style={{
              background: 'rgba(255,255,255,0.95)',
              border: '2px solid #d4af37',
              borderRadius: '15px',
              boxShadow: '0 8px 25px rgba(212,175,55,0.3)'
            }}>
              <CardContent className="p-8 text-center">
                <TrendingUp style={{ 
                  width: '4rem', 
                  height: '4rem', 
                  color: '#ff6b00', 
                  margin: '0 auto 24px auto' 
                }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4a5568', marginBottom: '16px' }}>
                  2. Post & Browse Deals
                </h3>
                <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                  Suppliers post deals, buyers browse and discover opportunities. Smart notifications keep you updated.
                </p>
              </CardContent>
            </Card>
            
            <Card style={{
              background: 'rgba(255,255,255,0.95)',
              border: '2px solid #d4af37',
              borderRadius: '15px',
              boxShadow: '0 8px 25px rgba(212,175,55,0.3)'
            }}>
              <CardContent className="p-8 text-center">
                <ShieldCheck style={{ 
                  width: '4rem', 
                  height: '4rem', 
                  color: '#ff6b00', 
                  margin: '0 auto 24px auto' 
                }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4a5568', marginBottom: '16px' }}>
                  3. Connect & Save
                </h3>
                <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                  Make direct contact, negotiate deals, and grow your business network with verified partners.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final Call to Action */}
        <div style={{
          background: 'linear-gradient(45deg, #4a5568, #2d3748)',
          color: 'white',
          padding: '50px 30px',
          borderRadius: '20px',
          textAlign: 'center',
          border: '4px solid #d4af37',
          boxShadow: '0 0 40px rgba(212,175,55,0.4)'
        }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '24px' }}>
            Join South Africa's Premier B2B Marketplace
          </h2>
          <p style={{ fontSize: '1.5rem', marginBottom: '32px', opacity: '0.95' }}>
            Start growing your business today - completely FREE until February 20th, 2026!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/supplier-registration">
              <Button size="lg" style={{
                background: 'linear-gradient(45deg, #ff6b00, #ff8f00)',
                color: 'white',
                padding: '20px 40px',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                border: '3px solid #d4af37'
              }}>
                Become a Supplier
              </Button>
            </Link>
            <Link href="/buyer-registration">
              <Button size="lg" style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                padding: '20px 40px',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                border: '3px solid white'
              }}>
                Start as Buyer
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        @keyframes glow {
          from { box-shadow: 0 0 40px rgba(255,0,0,0.5); }
          to { box-shadow: 0 0 60px rgba(255,0,0,0.8); }
        }
      `}</style>
    </div>
  );
}