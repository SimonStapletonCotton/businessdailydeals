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

  console.log('DealImage render:', { src, imageError, imageLoaded });

  // If no src provided or image failed to load, show fallback
  if (!src || imageError) {
    console.log('Showing fallback for:', src, 'error:', imageError);
    return (
      <div className={`bg-slate-100 flex items-center justify-center ${className} ${fallbackClassName}`}>
        <Package className="h-12 w-12 text-slate-400" />
      </div>
    );
  }

  return (
    <div className="relative">
      <img
        src={src}
        alt={alt}
        className={className}
        onLoad={() => {
          console.log('Image onLoad triggered for:', src);
          setImageLoaded(true);
        }}
        onError={(e) => {
          console.error('Image onError triggered for:', src);
          setImageError(true);
        }}
      />
      {!imageLoaded && !imageError && (
        <div className={`absolute inset-0 bg-slate-100 flex items-center justify-center ${className}`}>
          <div className="animate-spin w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full"></div>
        </div>
      )}
    </div>
  );
}