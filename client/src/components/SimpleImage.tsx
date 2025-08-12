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

  // Create a simple image with proper error handling
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
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const parent = target.parentElement;
        if (parent) {
          parent.innerHTML = `
            <div style="
              width: 100%; 
              height: 200px; 
              background: #f97316; 
              border-radius: 8px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              font-size: 1.2rem; 
              color: white;
              text-align: center;
              padding: 10px;
              font-weight: bold;
            ">
              🎰 DEAL IMAGE<br/>
              <small style="font-size: 0.9rem; opacity: 0.9;">Loading Issue</small>
            </div>
          `;
        }
      }}
    />
  );
}