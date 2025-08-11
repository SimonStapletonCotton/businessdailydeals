// FORCE DISPLAY WITH MULTIPLE FALLBACK METHODS
export function DealImage({ src, alt, className = "" }: { src?: string | null; alt: string; className?: string }) {
  if (!src) {
    return (
      <div className={`w-full h-[200px] bg-slate-100 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-4xl">📦</span>
      </div>
    );
  }

  // Use both background-image AND img element for maximum compatibility
  return (
    <div 
      className={`w-full h-[200px] bg-slate-100 rounded-lg overflow-hidden relative ${className}`}
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover absolute inset-0 opacity-100"
        style={{
          display: 'block !important',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          visibility: 'visible !important',
          opacity: '1 !important'
        }}
        onLoad={(e) => {
          console.log('✅ IMG loaded successfully:', src);
          e.currentTarget.style.opacity = '1';
        }}
        onError={(e) => {
          console.error('❌ IMG failed, falling back to background:', src);
          e.currentTarget.style.display = 'none';
        }}
        loading="eager"
        crossOrigin="anonymous"
      />
    </div>
  );
}