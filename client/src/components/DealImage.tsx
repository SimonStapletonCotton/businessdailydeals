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
    img.style.cssText = 'width:100%;height:auto;display:block;object-fit:cover;max-width:100%;min-height:128px;border:none;outline:none;background-color:#f8fafc;';
    
    img.onload = () => {
      console.log('🟢 NATIVE DOM: Image loaded successfully', src);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(img);
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

  return <div ref={containerRef} className={className} />;
}