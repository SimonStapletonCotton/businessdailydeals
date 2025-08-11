// EMERGENCY: Direct image component with ZERO framework dependencies
export function EmergencyImageFix({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: '100%',
        height: 'auto',
        display: 'block',
        objectFit: 'cover' as const,
        maxWidth: '100%',
        border: 'none',
        outline: 'none'
      }}
      onLoad={() => console.log('EMERGENCY: Image loaded', src)}
      onError={() => console.error('EMERGENCY: Image failed', src)}
    />
  );
}

// Replace DealImage with this component immediately