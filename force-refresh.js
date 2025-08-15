// Force complete application refresh
console.log("🔥 FORCING COMPLETE APPLICATION RESET");

// Clear all possible cache locations
if ('caches' in window) {
  caches.keys().then(names => {
    names.forEach(name => {
      caches.delete(name);
      console.log("🗑️ Deleted cache:", name);
    });
  });
}

// Clear all storage
localStorage.clear();
sessionStorage.clear();
console.log("🗑️ Cleared all browser storage");

// Clear service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister();
      console.log("🗑️ Unregistered service worker");
    });
  });
}

// Force hard reload with cache bypass
setTimeout(() => {
  const url = new URL(window.location);
  url.searchParams.set('force_refresh', Date.now());
  url.searchParams.set('cache_bust', Math.random());
  window.location.replace(url.toString());
}, 1000);

console.log("✅ Cache clearing initiated - reloading in 1 second...");