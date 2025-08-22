export default function TestSimple() {
  return (
    <div style={{ padding: "20px", backgroundColor: "orange", minHeight: "100vh" }}>
      <h1 style={{ color: "white", fontSize: "48px", textAlign: "center" }}>
        TEST PAGE - WORKING
      </h1>
      <p style={{ color: "white", fontSize: "24px", textAlign: "center" }}>
        This is a completely minimal test page. If you can see this, React is working.
      </p>
      <div style={{ marginTop: "50px", textAlign: "center" }}>
        <button style={{ padding: "20px", fontSize: "18px", backgroundColor: "red", color: "white", border: "none", borderRadius: "5px" }}>
          Test Button
        </button>
      </div>
    </div>
  );
}