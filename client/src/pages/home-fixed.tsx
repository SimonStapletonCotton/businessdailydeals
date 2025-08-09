export default function HomeFixed() {
  return (
    <>
      {/* Force visible styles with high specificity */}
      <style>{`
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
          overflow-x: auto !important;
        }
        #root {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          min-height: 100vh !important;
        }
        .home-container {
          display: block !important;
          position: relative !important;
          width: 100% !important;
          min-height: 100vh !important;
          background: linear-gradient(135deg, #ff6600 0%, #cc5200 100%) !important;
          color: white !important;
          z-index: 999999999 !important;
        }
        @keyframes spinSeven {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        .spinning-seven {
          display: inline-block;
          font-weight: bold;
          text-shadow: 3px 3px 6px rgba(0,0,0,0.8);
          transform-style: preserve-3d;
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
      
      <div className="home-container">
        {/* Header */}
        <div style={{
          padding: "20px",
          textAlign: "center",
          backgroundColor: "rgba(0,0,0,0.2)",
          borderBottom: "2px solid #ff8833"
        }}>
          <h1 style={{
            fontSize: "48px",
            fontWeight: "bold",
            margin: "0",
            color: "white",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
          }}>
            🎰 BUSINESS DAILY DEALS 🎰
          </h1>
          <p style={{
            fontSize: "24px",
            margin: "10px 0 0 0",
            color: "#ffcc99"
          }}>
            South Africa's Premier B2B Marketplace
          </p>
        </div>

        {/* Main Content */}
        <div style={{
          padding: "40px 20px",
          textAlign: "center"
        }}>
          {/* Casino 7's Animation */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "30px",
            marginBottom: "40px",
            fontSize: "84px",
            fontFamily: "Georgia, serif"
          }}>
            <span className="spinning-seven seven-1">7</span>
            <span className="spinning-seven seven-2">7</span>
            <span className="spinning-seven seven-3">7</span>
          </div>

          {/* Promotional Text */}
          <div style={{
            backgroundColor: "rgba(255,255,255,0.1)",
            padding: "30px",
            borderRadius: "15px",
            marginBottom: "40px",
            border: "3px solid #ff8833"
          }}>
            <h2 style={{
              fontSize: "36px",
              margin: "0 0 20px 0",
              color: "#ffff00"
            }}>
              🎉 FREE UNTIL JANUARY 1ST, 2026! 🎉
            </h2>
            <p style={{
              fontSize: "20px",
              margin: "0",
              lineHeight: "1.6"
            }}>
              Post unlimited deals completely FREE during our launch period!<br/>
              Build your customer base with zero cost advertising.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px"
          }}>
            <a href="/hot-deals" style={{
              display: "inline-block",
              padding: "20px 40px",
              backgroundColor: "red",
              color: "white",
              textDecoration: "none",
              borderRadius: "10px",
              fontSize: "18px",
              fontWeight: "bold",
              border: "3px solid #cc0000",
              transition: "all 0.3s ease"
            }}>
              🔥 HOT DEALS
            </a>
            <a href="/regular-deals" style={{
              display: "inline-block",
              padding: "20px 40px",
              backgroundColor: "#ff8833",
              color: "white",
              textDecoration: "none",
              borderRadius: "10px",
              fontSize: "18px",
              fontWeight: "bold",
              border: "3px solid #cc6600"
            }}>
              📦 REGULAR DEALS
            </a>
            <a href="/register-supplier" style={{
              display: "inline-block",
              padding: "20px 40px",
              backgroundColor: "green",
              color: "white",
              textDecoration: "none",
              borderRadius: "10px",
              fontSize: "18px",
              fontWeight: "bold",
              border: "3px solid #006600"
            }}>
              🏭 BECOME A SUPPLIER
            </a>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}