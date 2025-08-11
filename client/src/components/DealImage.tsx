// FORCE DISPLAY WITH DIRECT IMG ELEMENT
export function DealImage({ src, alt, className = "" }: { src?: string | null; alt: string; className?: string }) {
  if (!src) {
    return (
      <div className={`w-full h-[200px] bg-slate-100 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-4xl">📦</span>
      </div>
    );
  }

  return (
    <div className={`w-full h-[200px] bg-slate-100 rounded-lg overflow-hidden relative ${className}`}>
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover absolute inset-0"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
        onLoad={() => console.log('✅ Image loaded successfully:', src)}
        onError={() => console.error('❌ Image failed to load:', src)}
        loading="eager"
      />
    </div>
  );
}