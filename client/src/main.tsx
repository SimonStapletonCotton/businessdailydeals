import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Override Replit environment styling that might interfere
const injectOverrideStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    /* Force visibility over Replit dev environment */
    #root {
      position: relative !important;
      z-index: 999999999 !important;
      width: 100vw !important;
      min-height: 100vh !important;
      background: transparent !important;
    }
    
    /* Disable any Replit overlays that might block content */
    .beacon-highlighter,
    .beacon-hover-highlighter,
    .beacon-selected-highlighter {
      display: none !important;
      opacity: 0 !important;
    }
  `;
  document.head.appendChild(style);
};

// Inject override styles immediately
injectOverrideStyles();

console.log("main.tsx loading...");
const rootElement = document.getElementById("root");
console.log("Root element found:", rootElement);

if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log("React mounted successfully");
  } catch (error) {
    console.error("React mount failed:", error);
  }
} else {
  console.error("Root element not found!");
}
