// Clean, simple image component 
export function SimpleImage({ src, alt, className = "" }: { src?: string | null; alt: string; className?: string }) {
  console.log('SimpleImage rendering:', src);
  
  // Placeholder for missing images
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

  return (
    <img 
      src={src}
      alt={alt} 
      style={{
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '8px'
      }}
      className={className}
      onLoad={() => console.log('✅ Image loaded:', src)}
    />
  );
}