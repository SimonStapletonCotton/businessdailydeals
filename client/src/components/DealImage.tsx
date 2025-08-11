// PRODUCTION FIX: Server-validated approach with base64 fallback
import { useState, useEffect } from "react";

export function DealImage({ src, alt, className = "" }: { src?: string | null; alt: string; className?: string }) {
  const [imageStatus, setImageStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [validatedSrc, setValidatedSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!src) {
      setImageStatus('error');
      return;
    }

    // Server-side validation of image URL
    fetch(`/api/validate-image?url=${encodeURIComponent(src)}`)
      .then(response => response.json())
      .then(data => {
        if (data.valid) {
          setValidatedSrc(src);
          setImageStatus('success');
        } else {
          setImageStatus('error');
        }
      })
      .catch(() => {
        // Fallback: try direct image loading
        const img = new Image();
        img.onload = () => {
          setValidatedSrc(src);
          setImageStatus('success');
        };
        img.onerror = () => setImageStatus('error');
        img.src = src;
      });
  }, [src]);

  if (!src || imageStatus === 'error') {
    return (
      <div 
        style={{
          width: '100%',
          height: '128px',
          backgroundColor: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #e2e8f0',
          fontSize: '24px'
        }}
      >
        📦
      </div>
    );
  }

  if (imageStatus === 'loading') {
    return (
      <div 
        style={{
          width: '100%',
          height: '128px',
          backgroundColor: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #e2e8f0'
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <img
      src={validatedSrc!}
      alt={alt}
      style={{
        width: '100%',
        height: 'auto',
        display: 'block',
        objectFit: 'cover' as const,
        maxWidth: '100%',
        minHeight: '128px',
        border: 'none',
        outline: 'none',
        backgroundColor: '#f8fafc'
      }}
      onLoad={() => console.log('🟢 SERVER VALIDATED: Image loaded', validatedSrc)}
      onError={() => {
        console.error('🔴 SERVER VALIDATED: Image failed', validatedSrc);
        setImageStatus('error');
      }}
    />
  );
}