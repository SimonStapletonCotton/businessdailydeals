import { useState } from "react";
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

  // If no src provided or image failed to load, show fallback
  if (!src || imageError) {
    return (
      <div className={`bg-slate-100 flex items-center justify-center ${className} ${fallbackClassName}`}>
        <Package className="h-12 w-12 text-slate-400" />
      </div>
    );
  }

  // BULLETPROOF: Force absolute image display with inline styles only
  return (
    <div 
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%'
      }}
    >
      <img
        src={src}
        alt={alt}
        onLoad={() => {
          console.log('✅ Image loaded:', src);
          setImageLoaded(true);
        }}
        onError={() => {
          console.error('❌ Image failed:', src);
          setImageError(true);
        }}
        style={{
          display: 'block !important',
          visibility: 'visible !important',
          opacity: '1 !important',
          width: '100%',
          height: 'auto',
          objectFit: 'cover',
          maxWidth: '100%',
          border: 'none',
          outline: 'none'
        }}
        className={className}
      />
      {!imageLoaded && !imageError && (
        <div 
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div 
            style={{
              width: '24px',
              height: '24px',
              border: '2px solid #cbd5e1',
              borderTop: '2px solid #475569',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
        </div>
      )}
    </div>
  );
}