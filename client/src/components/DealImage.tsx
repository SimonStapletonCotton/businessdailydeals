// DIRECT IMAGE TESTING WITH ABSOLUTE PATHS
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

  // Use relative path since CSP is fixed
  console.log('✅ Rendering image with src:', src);

  // Remove cache busting for now to test base functionality
  const cacheBustedSrc = src;
  
  return (
    <img 
      src={cacheBustedSrc} 
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
      onLoad={() => console.log('✅ IMAGE LOADED SUCCESSFULLY:', cacheBustedSrc)}
      onError={(e) => {
        console.error('❌ IMAGE FAILED TO LOAD:', cacheBustedSrc, e);
        // Show placeholder on error
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  );
}