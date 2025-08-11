// ULTIMATE PRODUCTION FIX: Direct HTML approach - cannot be broken by React/CSS
export function DealImage({ src, alt, className = "" }: { src?: string | null; alt: string; className?: string }) {
  if (!src) {
    return (
      <div 
        dangerouslySetInnerHTML={{
          __html: `<div style="width:100%;height:128px;background-color:#f1f5f9;display:flex;align-items:center;justify-content:center;border:1px solid #e2e8f0;font-size:24px;">📦</div>`
        }}
      />
    );
  }

  // Direct HTML injection - bypasses all React/CSS framework interactions
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{
        __html: `
          <img 
            src="${src}" 
            alt="${alt}"
            style="width:100%;height:auto;display:block;object-fit:cover;max-width:100%;min-height:128px;border:none;outline:none;background-color:#f8fafc;"
            onload="console.log('🟢 DIRECT HTML: Image loaded', '${src}')"
            onerror="console.error('🔴 DIRECT HTML: Image failed', '${src}'); this.style.display='none';"
          />
        `
      }}
    />
  );
}