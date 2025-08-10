import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #ff6600 0%, #cc4400 100%)" }}>
      {/* Header */}
      <div className="text-center pt-8 pb-4 px-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-4xl">🎰</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            BUSINESS DAILY DEALS
          </h1>
          <span className="text-4xl">🎰</span>
        </div>
        <p className="text-xl md:text-2xl text-orange-100">
          South Africa's Premier B2B Marketplace
        </p>
      </div>

      {/* Casino 7's Animation */}
      <div className="flex justify-center items-center gap-8 py-8">
        <style>{`
          @keyframes spinSeven {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(360deg); }
          }
          .spinning-seven {
            display: inline-block;
            font-weight: bold;
            text-shadow: 3px 3px 6px rgba(0,0,0,0.8);
            transform-style: preserve-3d;
            font-family: Georgia, serif;
          }
          .seven-1 {
            animation: spinSeven 2s linear infinite;
            color: #ff0000 !important;
          }
          .seven-2 {
            animation: spinSeven 2.5s linear infinite;
            color: #cc0000 !important;
          }
          .seven-3 {
            animation: spinSeven 3s linear infinite;
            color: #ff3333 !important;
          }
        `}</style>
        <span className="text-7xl md:text-8xl spinning-seven seven-1">7</span>
        <span className="text-7xl md:text-8xl spinning-seven seven-2">7</span>
        <span className="text-7xl md:text-8xl spinning-seven seven-3">7</span>
      </div>

      {/* Promotional Banner */}
      <div className="max-w-4xl mx-auto px-6 pb-8">
        <div className="rounded-2xl p-8 border-4 border-yellow-400 text-center" style={{ backgroundColor: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(10px)" }}>
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-300 mb-4 flex items-center justify-center gap-2">
            <span>🎉</span>
            <span>FREE UNTIL JANUARY 1ST, 2026!</span>
            <span>🎉</span>
          </h2>
          <p className="text-lg md:text-xl text-white leading-relaxed">
            Post unlimited deals completely <strong>FREE</strong> during our launch period!<br/>
            Build your customer base with zero cost advertising.
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/hot-deals">
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white border-2 border-orange-700 px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              data-testid="button-hot-deals"
            >
              🔥 HOT DEALS
            </Button>
          </Link>
          
          <Link href="/regular-deals">
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white border-2 border-orange-700 px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              data-testid="button-regular-deals"
            >
              📦 REGULAR DEALS
            </Button>
          </Link>
          
          <Link href="/post-deal">
            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700 text-white border-2 border-red-800 px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              data-testid="button-post-deal"
            >
              ➕ POST DEAL
            </Button>
          </Link>
          
          <Link href="/register-supplier">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white border-2 border-green-800 px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              data-testid="button-register-supplier"
            >
              🏭 BECOME A SUPPLIER
            </Button>
          </Link>
        </div>

        {/* Secondary Buttons Row */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Link href="/register-buyer">
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 px-6 py-3 rounded-lg font-semibold backdrop-blur-sm transition-all"
              data-testid="button-register-buyer"
            >
              👥 REGISTER AS BUYER
            </Button>
          </Link>
          
          <Link href="/find-me-deal">
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 px-6 py-3 rounded-lg font-semibold backdrop-blur-sm transition-all"
              data-testid="button-find-deal"
            >
              🔍 FIND ME A DEAL
            </Button>
          </Link>
          
          <Link href="/suppliers-directory">
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 px-6 py-3 rounded-lg font-semibold backdrop-blur-sm transition-all"
              data-testid="button-suppliers-directory"
            >
              📋 SUPPLIERS DIRECTORY
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}