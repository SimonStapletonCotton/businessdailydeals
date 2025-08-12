import { useState, useEffect } from 'react';

export function SimpleImage({ src, alt, className = "" }: { src?: string | null; alt: string; className?: string }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Show placeholder for missing images
  if (!src) {
    return (
      <div 
        style={{
          width: '100%',
          height: '200px',
          backgroundColor: '#e2e8f0',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3rem',
          color: '#64748b'
        }}
        className={className}
      >
        📦
      </div>
    );
  }

  useEffect(() => {
    // Fetch image data directly to bypass browser path resolution issues
    const fetchImage = async () => {
      setLoading(true);
      setError(false);
      
      try {
        console.log('🔄 Fetching image:', src);
        // Remove cache busting for fetch to avoid query parameter issues
        const cleanSrc = src.split('?')[0];
        console.log('🔄 Clean URL:', cleanSrc);
        const response = await fetch(cleanSrc);
        console.log('🔄 Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setImageSrc(objectUrl);
        console.log('✅ Image loaded successfully:', cleanSrc);
        
      } catch (err) {
        console.log('❌ Image fetch failed:', cleanSrc, err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();

    // Cleanup object URL on unmount
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [src]);

  if (loading) {
    return (
      <div 
        style={{
          width: '100%',
          height: '200px',
          backgroundColor: '#f1f5f9',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          color: '#64748b'
        }}
        className={className}
      >
        🔄
      </div>
    );
  }

  if (error || !imageSrc) {
    return (
      <div 
        style={{
          width: '100%',
          height: '200px',
          background: '#fca5a5',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          color: '#991b1b',
          textAlign: 'center',
          padding: '10px'
        }}
        className={className}
      >
        ⚠️<br/>Image Loading Error<br/>
        <small style={{ fontSize: '0.8rem' }}>{src?.split('/').pop()}</small>
      </div>
    );
  }
  
  return (
    <img 
      src={imageSrc} 
      alt={alt} 
      style={{
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '8px'
      }}
      className={className}
    />
  );
}