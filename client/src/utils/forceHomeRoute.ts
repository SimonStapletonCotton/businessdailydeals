// Force home page routing utility
export function forceHomeRoute() {
  // Clear any cached routes
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    
    // If we're on root or home, ensure we stay on home
    if (currentPath === '/' || currentPath === '/home') {
      // Force home page in history
      window.history.replaceState({}, '', '/');
      console.log('Force home route: replaced history state');
      return true;
    }
    
    // If we somehow ended up on hot-deals from root, redirect
    if (currentPath === '/hot-deals' && document.referrer === '') {
      window.history.replaceState({}, '', '/');
      window.location.reload();
      console.log('Force home route: redirected from hot-deals to home');
      return true;
    }
  }
  
  return false;
}

// Clear browser cache for this domain
export function clearRouteCache() {
  if (typeof window !== 'undefined') {
    // Clear session storage
    sessionStorage.clear();
    
    // Force cache reload
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => registration.unregister());
      });
    }
    
    console.log('Route cache cleared');
  }
}