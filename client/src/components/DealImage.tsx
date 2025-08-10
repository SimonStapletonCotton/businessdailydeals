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

  console.log('DealImage debug - src:', src, 'imageError:', imageError, 'imageLoaded:', imageLoaded);

  // If no src provided or image failed to load, show fallback
  if (!src || imageError) {
    console.log('DealImage showing fallback - src:', src, 'error:', imageError);
    return (
      <div className={`bg-slate-100 flex items-center justify-center ${className} ${fallbackClassName}`}>
        <Package className="h-12 w-12 text-slate-400" />
      </div>
    );
  }

  // CRITICAL FIX: Complete style override to force visibility
  return (
    <div 
      className="relative bg-yellow-100 border-2 border-yellow-500" 
      style={{ 
        position: 'relative', 
        minHeight: '200px',
        width: '100%',
        backgroundColor: 'yellow !important'
      }}
    >
      {/* Debug overlay */}
      <div className="absolute top-0 left-0 bg-red-500 text-white text-xs p-1 z-50">
        IMG: {imageLoaded ? 'LOADED' : 'LOADING'} | SRC: {src?.substring(src.lastIndexOf('/') + 1)}
      </div>
      
      <img
        src={src}
        alt={alt}
        className=""
        onLoad={(e) => {
          console.log('Image successfully loaded:', src);
          console.log('Image element dimensions:', e.target.naturalWidth, 'x', e.target.naturalHeight);
          setImageLoaded(true);
        }}
        onError={(e) => {
          console.error('Image failed to load:', src, e);
          setImageError(true);
        }}
        style={{ 
          display: 'block',
          visibility: 'visible',
          opacity: '1',
          width: '100%',
          height: 'auto',
          position: 'relative',
          zIndex: 10,
          border: '3px solid red',
          backgroundColor: 'white'
        }}
      />
      
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-blue-200 flex items-center justify-center">
          <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          <span className="ml-2 text-blue-800">Loading...</span>
        </div>
      )}
    </div>
  );
}