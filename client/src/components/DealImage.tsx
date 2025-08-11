// SIMPLE, RELIABLE IMAGE DISPLAY
import { useState } from "react";

export function DealImage({ src, alt, className = "" }: { src?: string | null; alt: string; className?: string }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!src) {
    return (
      <div className={`w-full h-[200px] bg-slate-100 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-4xl">📦</span>
      </div>
    );
  }

  if (imageError) {
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
          <span className="text-gray-500">Loading...</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${imageLoaded ? 'block' : 'hidden'}`}
        onLoad={() => {
          setImageLoaded(true);
          console.log('✅ Image loaded:', src);
        }}
        onError={() => {
          setImageError(true);
          console.error('❌ Image failed:', src);
        }}
      />
    </div>
  );
}