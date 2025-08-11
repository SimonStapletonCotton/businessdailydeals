// EMERGENCY PRODUCTION FIX: Zero dependencies, cannot fail
export function DealImage({ src, alt, className = "" }: { src?: string | null; alt: string; className?: string }) {
  // No state, no useEffect, no external dependencies - just direct rendering
  if (!src) {
    return (
      <div 
        style={{
          width: '100%', 
          height: '128px',
          backgroundColor: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #e2e8f0'
        }}
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
        height: 'auto',
        display: 'block',
        objectFit: 'cover' as const,
        maxWidth: '100%',
        minHeight: '128px',
        border: 'none',
        outline: 'none',
        backgroundColor: '#f8fafc'
      }}
      onLoad={() => console.log('🟢 EMERGENCY FIX: Image loaded', src)}
      onError={(e) => {
        console.error('🔴 EMERGENCY FIX: Image failed', src);
        // Replace with fallback on error
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  );
}