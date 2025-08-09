// Force home page routing utility
export function forceHomeRoute() {
  // Clear any cached routes
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    
    // AGGRESSIVE HOME ENFORCEMENT
    // Always force root to home page
    if (currentPath === '/' || currentPath === '/home' || currentPath === '') {
      window.history.replaceState({}, '', '/');
      console.log('Force home route: replaced history state');
      return true;
    }
    
    // Only redirect hot-deals if it was a direct browser access (refresh/bookmark)
    if (currentPath === '/hot-deals') {
      // Check if this was a page refresh or direct URL access
      const performance = window.performance;
      const navType = performance.getEntriesByType('navigation')[0] as any;
      const wasPageRefresh = navType && navType.type === 'reload';
      const wasDirectAccess = !document.referrer || document.referrer === '' || document.referrer === window.location.href;
      
      // Only redirect if it was a page refresh or direct access, NOT user navigation
      if (wasPageRefresh || wasDirectAccess) {
        console.log('Force home route: redirected from hot-deals (page refresh/direct access)');
        window.history.replaceState({}, '', '/');
        window.location.href = '/';
        return true;
      }
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