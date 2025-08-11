// FORCE DISPLAY WITH BACKGROUND IMAGE
export function DealImage({ src, alt, className = "" }: { src?: string | null; alt: string; className?: string }) {
  console.log('🖼️ DealImage rendering with src:', src, 'alt:', alt);
  
  if (!src) {
    console.log('❌ No src provided, showing placeholder');
    return (
      <div className={`w-full h-[200px] bg-slate-100 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-4xl">📦</span>
      </div>
    );
  }

  console.log('✅ Rendering background image with src:', src);
  return (
    <div 
      className={`w-full h-[200px] bg-slate-100 rounded-lg overflow-hidden ${className}`}
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      title={alt}
    >
      {/* Hidden img for accessibility */}
      <img 
        src={src} 
        alt={alt} 
        className="sr-only" 
        onLoad={() => console.log('✅ Background image loaded:', src)}
        onError={() => console.error('❌ Background image failed:', src)}
      />
    </div>
  );
}