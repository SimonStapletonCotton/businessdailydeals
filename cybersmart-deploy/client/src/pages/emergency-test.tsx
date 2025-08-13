export default function EmergencyTest() {
  // Use raw HTML to bypass all CSS issues
  const rawHtml = `
    <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 99999; 
                background: linear-gradient(135deg, #ff6600 0%, #cc5200 100%); 
                color: white; padding: 50px; font-family: Arial, sans-serif;">
      <h1 style="font-size: 48px; margin: 0 0 20px 0; text-align: center;">
        🎰 BUSINESS DAILY DEALS 🎰
      </h1>
      <p style="font-size: 24px; text-align: center; margin: 20px 0;">
        Emergency Test Page - Orange Background Working!
      </p>
      <div style="text-align: center; margin: 40px 0;">
        <button onclick="alert('Button Works!')" 
                style="padding: 20px 40px; font-size: 20px; background: red; color: white; 
                       border: none; border-radius: 10px; cursor: pointer;">
          TEST BUTTON
        </button>
      </div>
      <div style="text-align: center;">
        <a href="/hot-deals" style="display: inline-block; padding: 15px 30px; 
                                    background: green; color: white; text-decoration: none; 
                                    border-radius: 8px; margin: 10px;">
          Hot Deals
        </a>
        <a href="/regular-deals" style="display: inline-block; padding: 15px 30px; 
                                        background: blue; color: white; text-decoration: none; 
                                        border-radius: 8px; margin: 10px;">
          Regular Deals  
        </a>
      </div>
    </div>
  `;

  return <div dangerouslySetInnerHTML={{ __html: rawHtml }} />;
}