import { createRoot } from "react-dom/client";
import App from "./App-minimal";
// Temporarily remove CSS import to test
// import "./index.css";

console.log("main.tsx loading...");
const rootElement = document.getElementById("root");
console.log("Root element:", rootElement);

try {
  createRoot(rootElement!).render(<App />);
  console.log("React app mounted successfully");
} catch (error) {
  console.error("React mount error:", error);
}
