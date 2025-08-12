// FORCE DISPLAY WITH INLINE STYLES
export function DealImage({ src, alt, className = "" }: { src?: string | null; alt: string; className?: string }) {
  console.log('🖼️ DealImage render:', { src, alt });
  
  if (!src) {
    console.log('❌ No src provided, showing placeholder');
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

  console.log('✅ Rendering image with src:', src);

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
      onLoad={() => console.log('✅ IMAGE LOADED:', src)}
      onError={(e) => {
        console.error('❌ IMAGE FAILED:', src, e);
        // Replace with placeholder on error
        (e.target as HTMLImageElement).style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
          width: 100%;
          height: 200px;
          background-color: #f1f5f9;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        `;
        placeholder.textContent = '🚫';
        (e.target as HTMLImageElement).parentNode?.insertBefore(placeholder, e.target);
      }}
    />
  );
}