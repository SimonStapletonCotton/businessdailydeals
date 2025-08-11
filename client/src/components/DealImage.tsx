// FORCE DISPLAY WITH INLINE STYLES
export function DealImage({ src, alt, className = "" }: { src?: string | null; alt: string; className?: string }) {
  if (!src) {
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
          fontSize: '2rem'
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
        borderRadius: '8px',
        display: 'block',
        border: 'none',
        outline: 'none'
      }}
      className={className}
      onLoad={() => console.log('✅ INLINE IMG loaded:', src)}
      onError={(e) => {
        console.error('❌ INLINE IMG failed:', src);
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}