// BULLETPROOF IMAGE DISPLAY: Hot-reload resistant native DOM manipulation
import { useEffect, useRef, useState } from "react";

export function DealImage({ src, alt, className = "" }: { src?: string | null; alt: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [forceReload, setForceReload] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !src) {
      if (containerRef.current) {
        containerRef.current.innerHTML = '<div style="width:100%;height:200px;background-color:#f1f5f9;display:flex;align-items:center;justify-content:center;border:1px solid #e2e8f0;font-size:24px;border-radius:8px;">📦</div>';
      }
      return;
    }

    const container = containerRef.current;
    
    // Force immediate clearing and show loading
    container.innerHTML = '<div style="width:100%;height:200px;background-color:#f8fafc;display:flex;align-items:center;justify-content:center;border:1px solid #e2e8f0;border-radius:8px;">Loading...</div>';

    // Create image with unique timestamp to prevent caching issues
    const img = document.createElement('img');
    const uniqueSrc = src.includes('?') ? `${src}&t=${Date.now()}` : `${src}?t=${Date.now()}`;
    img.src = uniqueSrc;
    img.alt = alt;
    
    // Force aggressive styling that survives any React interference
    const forceStyle = () => {
      img.style.cssText = `
        width: 100% !important;
        height: 200px !important;
        display: block !important;
        object-fit: cover !important;
        border: none !important;
        outline: none !important;
        background-color: #f8fafc !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: relative !important;
        border-radius: 8px !important;
        z-index: 1 !important;
        pointer-events: auto !important;
      `;
      
      if (container) {
        container.style.cssText = `
          width: 100% !important;
          height: 200px !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          position: relative !important;
          overflow: hidden !important;
          border-radius: 8px !important;
          background-color: #f8fafc !important;
        `;
      }
    };
    
    img.onload = () => {
      console.log('🟢 BULLETPROOF: Image loaded', src, 'Dimensions:', img.naturalWidth, 'x', img.naturalHeight);
      
      if (container && container === containerRef.current) {
        // Clear and force style application
        container.innerHTML = '';
        forceStyle();
        container.appendChild(img);
        
        // Force re-style after append to prevent React interference
        setTimeout(() => {
          if (container === containerRef.current && img.parentNode) {
            forceStyle();
            console.log('🔒 BULLETPROOF: Styles reapplied after mount');
          }
        }, 10);
        
        // Additional protection against hot reload
        setTimeout(() => {
          if (container === containerRef.current && img.parentNode) {
            forceStyle();
            console.log('🛡️ BULLETPROOF: Hot-reload protection applied');
          }
        }, 100);
      }
    };
    
    img.onerror = () => {
      console.error('🔴 BULLETPROOF: Image failed', src);
      if (container === containerRef.current) {
        container.innerHTML = '<div style="width:100%;height:200px;background-color:#f1f5f9;display:flex;align-items:center;justify-content:center;border:1px solid #e2e8f0;font-size:24px;border-radius:8px;">📦</div>';
      }
    };

    // Cleanup function
    return () => {
      img.onload = null;
      img.onerror = null;
      if (img.parentNode) {
        img.parentNode.removeChild(img);
      }
    };
  }, [src, alt, forceReload]);

  // Hot reload detector - force re-render when component updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setForceReload(prev => prev + 1);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{
        width: '100%',
        height: '200px',
        display: 'block',
        visibility: 'visible',
        opacity: 1,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f8fafc',
        borderRadius: '8px'
      }}
    />
  );
}