// FORCE IMAGE DISPLAY WITH BASE64 FALLBACK
import { useState, useEffect } from 'react';

export function DealImage({ src, alt, className = "" }: { src?: string | null; alt: string; className?: string }) {
  const [imageData, setImageData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      setLoading(false);
      return;
    }

    // Try to fetch the image as blob and convert to base64
    const fetchImage = async () => {
      try {
        setLoading(true);
        setError(false);
        
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const blob = await response.blob();
        const reader = new FileReader();
        
        reader.onload = () => {
          setImageData(reader.result as string);
          setLoading(false);
          console.log('✅ Image loaded as base64:', src);
        };
        
        reader.onerror = () => {
          setError(true);
          setLoading(false);
          console.error('❌ Failed to convert image to base64:', src);
        };
        
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error('❌ Failed to fetch image:', src, err);
        setError(true);
        setLoading(false);
      }
    };

    fetchImage();
  }, [src]);

  if (!src || error) {
    return (
      <div className={`w-full h-[200px] bg-slate-100 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-4xl">📦</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`w-full h-[200px] bg-slate-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <img 
      src={imageData || src} 
      alt={alt} 
      className={`w-full h-[200px] object-cover rounded-lg ${className}`}
    />
  );
}