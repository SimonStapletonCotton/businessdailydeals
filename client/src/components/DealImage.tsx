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

  // Use simple approach - just show the image without complex error handling
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
        // Replace with placeholder on error
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        target.parentElement!.innerHTML = `<div style="width: 100%; height: 200px; background: #e2e8f0; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: #64748b;">📷</div>`;
      }}
    />
  );
}