export function SimpleImage({ src, alt, className = "" }: { src?: string | null; alt: string; className?: string }) {
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

  // Add debugging to see what URL is being used
  console.log('SimpleImage rendering with src:', src);
  
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
      onLoad={() => console.log('✅ SimpleImage loaded:', src)}
      onError={(e) => {
        console.log('❌ SimpleImage failed:', src);
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const parent = target.parentElement;
        if (parent) {
          parent.innerHTML = '<div style="width: 100%; height: 200px; background: #fca5a5; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #991b1b; text-align: center;">⚠️<br/>Image Not Found</div>';
        }
      }}
    />
  );
}