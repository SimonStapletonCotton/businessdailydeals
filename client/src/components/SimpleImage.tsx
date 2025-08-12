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
      onError={(e) => {
        console.log('❌ Image failed:', src);
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const parent = target.parentElement;
        if (parent) {
          parent.innerHTML = `
            <div style="
              width: 100%; 
              height: 200px; 
              background: linear-gradient(135deg, #f97316, #ea580c); 
              border-radius: 8px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              font-size: 1.2rem; 
              color: white;
              text-align: center;
              padding: 10px;
              font-weight: bold;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            ">
              🎰 DEAL IMAGE<br/>
              <small style="font-size: 0.8rem; opacity: 0.9; margin-top: 4px; display: block;">Casino Loading...</small>
            </div>
          `;
        }
      }}
    />
  );
}