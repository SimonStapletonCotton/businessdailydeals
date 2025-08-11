// SIMPLE DIRECT IMAGE DISPLAY
export function DealImage({ src, alt, className = "" }: { src?: string | null; alt: string; className?: string }) {
  if (!src) {
    return (
      <div className={`w-full h-[200px] bg-slate-100 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-4xl">📦</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={`w-full h-[200px] object-cover rounded-lg ${className}`}
      onLoad={() => console.log('✅ Simple IMG loaded:', src)}
      onError={() => console.error('❌ Simple IMG failed:', src)}
    />
  );
}