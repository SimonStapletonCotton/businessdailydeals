import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HomeCasino() {
  return (
    <>
      <style>{`
        body {
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #ff6600 0%, #cc4400 100%) !important;
          min-height: 100vh !important;
        }
        
        .casino-container {
          background: linear-gradient(135deg, #ff6600 0%, #cc4400 100%) !important;
          min-height: 100vh !important;
          width: 100% !important;
          padding: 20px !important;
          color: white !important;
        }
        
        .casino-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .casino-title {
          font-size: 48px !important;
          font-weight: bold !important;
          color: white !important;
          text-shadow: 3px 3px 6px rgba(0,0,0,0.8) !important;
          margin: 20px 0 !important;
        }
        
        .casino-subtitle {
          font-size: 24px !important;
          color: #ffcc99 !important;
          margin: 10px 0 !important;
        }
        
        @keyframes spinSeven {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        
        .sevens-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 40px;
          margin: 40px 0;
        }
        
        .spinning-seven {
          font-size: 100px !important;
          font-weight: bold !important;
          font-family: Georgia, serif !important;
          text-shadow: 4px 4px 8px rgba(0,0,0,0.8) !important;
          display: inline-block;
          transform-style: preserve-3d;
        }
        
        .seven-1 {
          color: #ff0000 !important;
          animation: spinSeven 2s linear infinite;
        }
        
        .seven-2 {
          color: #cc0000 !important;
          animation: spinSeven 2.5s linear infinite;
        }
        
        .seven-3 {
          color: #ff3333 !important;
          animation: spinSeven 3s linear infinite;
        }
        
        .promo-banner {
          background: rgba(255, 255, 255, 0.2) !important;
          backdrop-filter: blur(10px) !important;
          border: 4px solid #ffdd00 !important;
          border-radius: 20px !important;
          padding: 30px !important;
          margin: 40px auto !important;
          max-width: 600px !important;
          text-align: center !important;
        }
        
        .promo-title {
          font-size: 36px !important;
          font-weight: bold !important;
          color: #ffdd00 !important;
          margin-bottom: 20px !important;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.8) !important;
        }
        
        .promo-text {
          font-size: 20px !important;
          color: white !important;
          line-height: 1.6 !important;
        }
        
        .nav-buttons {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
          margin-top: 40px;
        }
        
        .nav-button {
          padding: 20px 40px !important;
          font-size: 18px !important;
          font-weight: bold !important;
          border-radius: 15px !important;
          text-decoration: none !important;
          color: white !important;
          text-align: center !important;
          display: inline-block !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3) !important;
        }
        
        .nav-button:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 12px rgba(0,0,0,0.4) !important;
        }
        
        .hot-deals {
          background-color: #cc0000 !important;
          border: 3px solid #990000 !important;
        }
        
        .regular-deals {
          background-color: #ff8800 !important;
          border: 3px solid #cc6600 !important;
        }
        
        .supplier-btn {
          background-color: #00aa00 !important;
          border: 3px solid #007700 !important;
        }
      `}</style>
      
      <div className="casino-container">
        <div className="casino-header">
          <div>🎰 🎰 🎰</div>
          <h1 className="casino-title">BUSINESS DAILY DEALS</h1>
          <p className="casino-subtitle">South Africa's Premier B2B Marketplace</p>
        </div>
        
        <div className="sevens-container">
          <span className="spinning-seven seven-1">7</span>
          <span className="spinning-seven seven-2">7</span>
          <span className="spinning-seven seven-3">7</span>
        </div>
        
        <div className="promo-banner">
          <div className="promo-title">🎉 FREE UNTIL FEBRUARY 20TH, 2026! 🎉</div>
          <div className="promo-text">
            Post unlimited deals completely <strong>FREE</strong> during our launch period!<br/>
            Build your customer base with zero cost advertising.
          </div>
        </div>
        
        <div className="nav-buttons">
          <a href="/hot-deals" className="nav-button hot-deals">
            🔥 HOT DEALS
          </a>
          <a href="/regular-deals" className="nav-button regular-deals">
            📦 REGULAR DEALS
          </a>
          <a href="/register-supplier" className="nav-button supplier-btn">
            🏭 BECOME A SUPPLIER
          </a>
        </div>
        
        <div className="nav-buttons" style={{ marginTop: "20px" }}>
          <a href="/register-buyer" className="nav-button" style={{ backgroundColor: "#4444cc", border: "3px solid #333399" }}>
            👥 REGISTER AS BUYER
          </a>
          <a href="/find-me-deal" className="nav-button" style={{ backgroundColor: "#8800cc", border: "3px solid #660099" }}>
            🔍 FIND ME A DEAL
          </a>
        </div>
      </div>
    </>
  );
}