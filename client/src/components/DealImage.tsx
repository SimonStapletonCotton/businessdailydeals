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

  // Test with absolute URL to rule out relative path issues
  const testSrc = src.startsWith('/') ? `http://localhost:5000${src}` : src;
  console.log('✅ Rendering image with ABSOLUTE src:', testSrc);

  return (
    <img 
      src={testSrc} 
      alt={alt} 
      style={{
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '8px',
        display: 'block',
        border: '2px solid red', // DEBUG: Red border to see if element renders
        outline: 'none'
      }}
      className={className}
      onLoad={() => console.log('✅ IMAGE LOADED SUCCESSFULLY:', testSrc)}
      onError={(e) => {
        console.error('❌ IMAGE FAILED TO LOAD:', testSrc, e);
        console.error('❌ ERROR EVENT:', e.type, e.target);
        // Show error state visually
        (e.target as HTMLImageElement).style.backgroundColor = '#ffcccc';
        (e.target as HTMLImageElement).style.border = '2px solid red';
      }}
    />
  );
}