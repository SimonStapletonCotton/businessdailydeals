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

  // Create a full URL with cache busting to completely avoid relative path issues
  const fullUrl = `${window.location.origin}${src.startsWith('/') ? src : `/${src}`}?t=${Date.now()}`;
  console.log('SimpleImage: src =', src, 'fullUrl =', fullUrl);
  
  return (
    <img 
      src={fullUrl} 
      alt={alt} 
      style={{
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '8px'
      }}
      className={className}
      onLoad={() => console.log('✅ SimpleImage loaded:', fullUrl)}
      onError={(e) => {
        console.log('❌ SimpleImage failed:', fullUrl);
        console.log('❌ Error event details:', e);
        const target = e.target as HTMLImageElement;
        console.log('❌ Image element src when failed:', target.src);
        target.style.display = 'none';
        const parent = target.parentElement;
        if (parent) {
          parent.innerHTML = `<div style="width: 100%; height: 200px; background: #fca5a5; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1rem; color: #991b1b; text-align: center; padding: 10px;">⚠️<br/>Image Loading Error<br/><small style="font-size: 0.8rem;">${fullUrl.split('/').pop()}</small></div>`;
        }
      }}
    />
  );
}