function App() {
  console.log("App component rendering...");
  return (
    <div style={{ 
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      padding: "50px", 
      backgroundColor: "#ff6600", 
      color: "white", 
      fontSize: "24px", 
      zIndex: 9999,
      overflow: "auto"
    }}>
      <h1 style={{ margin: "0 0 20px 0" }}>MINIMAL APP - WORKING!</h1>
      <p style={{ margin: "0 0 20px 0" }}>If you can see this orange page, React is working properly.</p>
      <button style={{ 
        padding: "15px", 
        fontSize: "18px", 
        backgroundColor: "red", 
        color: "white", 
        border: "none", 
        borderRadius: "5px", 
        cursor: "pointer"
      }}>
        Test Button
      </button>
    </div>
  );
}

export default App;