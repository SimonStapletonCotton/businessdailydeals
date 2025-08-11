// SIMPLE, RELIABLE IMAGE DISPLAY
import { useState, useEffect, useRef } from "react";
import { imageMonitor } from "@/utils/imageMonitor";

export function DealImage({ src, alt, className = "" }: { src?: string | null; alt: string; className?: string }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const maxRetries = 2;

  // Reset states when src changes
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
    setRetryCount(0);
  }, [src]);

  // Retry mechanism for failed images
  useEffect(() => {
    if (imageError && retryCount < maxRetries && src) {
      const timer = setTimeout(() => {
        console.log(`🔄 Retrying image load (attempt ${retryCount + 1}):`, src);
        setImageError(false);
        setRetryCount(prev => prev + 1);
        // Force reload by updating the src with cache buster
        if (imgRef.current) {
          const cacheBuster = `?retry=${retryCount + 1}&t=${Date.now()}`;
          imgRef.current.src = src + cacheBuster;
        }
      }, 1000 * (retryCount + 1)); // Progressive delay: 1s, 2s, 3s

      return () => clearTimeout(timer);
    }
  }, [imageError, retryCount, src]);

  if (!src) {
    return (
      <div className={`w-full h-[200px] bg-slate-100 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-4xl">📦</span>
      </div>
    );
  }

  if (imageError && retryCount >= maxRetries) {
    return (
      <div className={`w-full h-[200px] bg-slate-100 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-4xl">📦</span>
      </div>
    );
  }

  return (
    <div className={`w-full h-[200px] bg-slate-100 rounded-lg overflow-hidden ${className}`}>
      {!imageLoaded && (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-gray-500">
            {retryCount > 0 ? `Retrying... (${retryCount}/${maxRetries})` : 'Loading...'}
          </span>
        </div>
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${imageLoaded ? 'block' : 'hidden'}`}
        loading="lazy"
        onLoad={() => {
          setImageLoaded(true);
          imageMonitor.recordSuccess(src);
          console.log('✅ Image loaded:', src, retryCount > 0 ? `(after ${retryCount} retries)` : '');
        }}
        onError={() => {
          setImageError(true);
          imageMonitor.recordFailure(src);
          console.error('❌ Image failed:', src, `(attempt ${retryCount + 1})`);
        }}
      />
    </div>
  );
}