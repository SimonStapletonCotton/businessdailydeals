// ULTIMATE PRODUCTION FIX: Bypass React entirely with native DOM manipulation
import { useEffect, useRef } from "react";

export function DealImage({ src, alt, className = "" }: { src?: string | null; alt: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !src) {
      if (containerRef.current) {
        containerRef.current.innerHTML = '<div style="width:100%;height:128px;background-color:#f1f5f9;display:flex;align-items:center;justify-content:center;border:1px solid #e2e8f0;font-size:24px;">📦</div>';
      }
      return;
    }

    // Show loading state first
    containerRef.current.innerHTML = '<div style="width:100%;height:128px;background-color:#f8fafc;display:flex;align-items:center;justify-content:center;border:1px solid #e2e8f0;">Loading...</div>';

    // Create native image element completely outside React
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.cssText = 'width:100% !important;height:200px !important;display:block !important;object-fit:cover !important;max-width:100% !important;border:3px solid blue !important;outline:none !important;background-color:#f8fafc !important;visibility:visible !important;opacity:1 !important;position:relative !important;z-index:999 !important;';
    
    img.onload = () => {
      console.log('🟢 NATIVE DOM: Image loaded successfully', src);
      console.log('🔍 IMAGE DIMENSIONS:', img.naturalWidth, 'x', img.naturalHeight);
      console.log('🔍 IMAGE SRC:', img.src);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        containerRef.current.style.cssText = 'width:100% !important;height:200px !important;display:block !important;visibility:visible !important;opacity:1 !important;position:relative !important;overflow:visible !important;background-color:#f0f0f0 !important;border:2px solid green !important;';
        containerRef.current.appendChild(img);
        console.log('🔍 CONTAINER AFTER APPEND:', containerRef.current.innerHTML.length, 'chars');
      }
    };
    
    img.onerror = () => {
      console.error('🔴 NATIVE DOM: Image failed to load', src);
      if (containerRef.current) {
        containerRef.current.innerHTML = '<div style="width:100%;height:128px;background-color:#f1f5f9;display:flex;align-items:center;justify-content:center;border:1px solid #e2e8f0;font-size:24px;">📦</div>';
      }
    };

    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, alt]);

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
        overflow: 'visible',
        backgroundColor: '#f8fafc',
        border: '2px solid red' // DEBUG: Make container visible
      }}
    />
  );
}