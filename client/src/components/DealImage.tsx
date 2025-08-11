// BULLETPROOF IMAGE DISPLAY - FORCE IMMEDIATE LOADING
import { useState, useEffect, useRef } from "react";

export function DealImage({ src, alt, className = "" }: { src?: string | null; alt: string; className?: string }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Force immediate image loading on mount and src change
  useEffect(() => {
    if (!src) return;
    
    setImageLoaded(false);
    setImageError(false);
    
    // Create a new image to preload
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    const handleLoad = () => {
      setImageLoaded(true);
      setImageError(false);
      console.log('✅ Image preloaded successfully:', src);
      
      // Force update the actual img element
      if (imgRef.current) {
        imgRef.current.src = src;
        imgRef.current.style.display = 'block';
        imgRef.current.style.opacity = '1';
      }
    };
    
    const handleError = () => {
      console.error('❌ Image preload failed:', src);
      // Try again with cache buster
      const cacheBuster = `?t=${Date.now()}&cb=${Math.random()}`;
      const retryImg = new Image();
      retryImg.crossOrigin = "anonymous";
      retryImg.onload = handleLoad;
      retryImg.onerror = () => {
        setImageError(true);
        console.error('❌ Image retry failed:', src);
      };
      retryImg.src = src + cacheBuster;
    };
    
    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = src;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  if (!src || imageError) {
    return (
      <div className={`w-full h-[200px] bg-slate-100 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-4xl">📦</span>
      </div>
    );
  }

  return (
    <div className={`w-full h-[200px] bg-slate-100 rounded-lg overflow-hidden ${className}`}>
      {!imageLoaded && (
        <div className="w-full h-full flex items-center justify-center absolute z-10">
          <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
        </div>
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{ 
          display: imageLoaded ? 'block' : 'none',
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 0.2s ease-in-out'
        }}
        onLoad={() => {
          setImageLoaded(true);
          console.log('✅ Final image display confirmed:', src);
        }}
        onError={() => {
          setImageError(true);
          console.error('❌ Final image display failed:', src);
        }}
      />
    </div>
  );
}