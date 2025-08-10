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

  console.log('DealImage DEBUG:', { src, imageError, imageLoaded, className });

  // ABSOLUTE EMERGENCY: Return direct img element for maximum visibility
  if (!src || imageError) {
    console.log('DealImage FALLBACK MODE:', { src, imageError });
    return (
      <div 
        className="bg-red-500 text-white p-8 flex items-center justify-center"
        style={{ minHeight: '200px', backgroundColor: 'red', color: 'white' }}
      >
        <Package className="h-12 w-12 mr-2" />
        <span>NO IMAGE: {src || 'No source'}</span>
      </div>
    );
  }

  // FORCE ABSOLUTE VISIBILITY
  return (
    <div style={{ 
      backgroundColor: '#ff0000', 
      padding: '20px', 
      border: '5px solid blue',
      minHeight: '250px',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        backgroundColor: '#000000',
        color: '#ffffff',
        padding: '5px',
        zIndex: '9999',
        fontSize: '12px'
      }}>
        FORCED VISIBLE: {imageLoaded ? 'LOADED' : 'LOADING'}
      </div>
      
      <img
        src={src}
        alt={alt}
        onLoad={(e) => {
          console.log('FORCE IMAGE LOADED:', src);
          console.log('DIMENSIONS:', e.target.naturalWidth, 'x', e.target.naturalHeight);
          setImageLoaded(true);
        }}
        onError={(e) => {
          console.error('FORCE IMAGE ERROR:', src, e);
          setImageError(true);
        }}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          maxWidth: '100%',
          visibility: 'visible',
          opacity: '1',
          border: '3px solid #00ff00',
          backgroundColor: '#ffffff',
          zIndex: '100'
        }}
      />
      
      <div style={{
        position: 'absolute',
        bottom: '0',
        right: '0',
        backgroundColor: '#00ff00',
        color: '#000000',
        padding: '5px',
        fontSize: '10px'
      }}>
        SRC: {src?.split('/').pop()}
      </div>
    </div>
  );
}