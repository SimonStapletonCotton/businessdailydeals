// NATIVE DOM APPROACH - BYPASS REACT RENDERING COMPLETELY
import { useEffect, useRef } from "react";

export function DealImage({ src, alt, className = "" }: { src?: string | null; alt: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !src) return;

    const container = containerRef.current;
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Create loading state
    container.innerHTML = `
      <div class="w-full h-full flex items-center justify-center">
        <div class="animate-spin w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
      </div>
    `;
    
    // Create image element using native DOM
    const img = document.createElement('img');
    img.alt = alt;
    img.className = 'w-full h-full object-cover';
    img.style.display = 'none';
    
    const handleSuccess = () => {
      console.log('✅ Native DOM image loaded:', src);
      container.innerHTML = '';
      img.style.display = 'block';
      container.appendChild(img);
    };
    
    const handleError = () => {
      console.error('❌ Native DOM image failed:', src);
      container.innerHTML = `
        <div class="w-full h-full flex items-center justify-center">
          <span class="text-4xl">📦</span>
        </div>
      `;
    };
    
    img.onload = handleSuccess;
    img.onerror = handleError;
    img.src = src;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, alt]);

  if (!src) {
    return (
      <div className={`w-full h-[200px] bg-slate-100 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-4xl">📦</span>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`w-full h-[200px] bg-slate-100 rounded-lg overflow-hidden ${className}`}
    />
  );
}