import { useState, useEffect } from "react";
import { Package } from "lucide-react";

interface DealImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export function DealImage({ src, alt, className = "", fallbackClassName = "" }: DealImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset states when src changes
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [src]);

  // If no src provided or image failed to load, show fallback
  if (!src || imageError) {
    return (
      <div className={`bg-slate-100 flex items-center justify-center ${className} ${fallbackClassName}`}>
        <Package className="h-12 w-12 text-slate-400" />
      </div>
    );
  }

  // ULTIMATE FIX: Render direct img with zero dependencies on external CSS
  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden' }}>
      <img
        src={src}
        alt={alt}
        onLoad={() => {
          console.log('✅ Image loaded successfully:', src);
          setImageLoaded(true);
        }}
        onError={() => {
          console.error('❌ Image error:', src);
          setImageError(true);
        }}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          objectFit: 'cover' as const
        }}
      />
      {!imageLoaded && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          Loading...
        </div>
      )}
    </div>
  );
}