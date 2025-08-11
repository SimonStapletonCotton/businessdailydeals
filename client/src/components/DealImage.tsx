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

  return (
    <div className="relative overflow-hidden">
      <img
        src={src}
        alt={alt}
        className={className}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          objectFit: 'cover'
        }}
      />
      {!imageLoaded && (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
          <div className="animate-spin w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full"></div>
        </div>
      )}
    </div>
  );
}