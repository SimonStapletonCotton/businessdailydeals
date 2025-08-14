export function DealImage({ src, alt, className = "" }: { src?: string | null; alt: string; className?: string }) {
  // If no image, show simple placeholder
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

  // Simple image display with fallback
  return (
    <img 
      src={src} 
      alt={alt} 
      style={{
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '8px',
        display: 'block'
      }}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        target.style.visibility = 'hidden';
      }}
    />
  );
}