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
    
    // If we somehow ended up on hot-deals without navigation, force home
    if (currentPath === '/hot-deals') {
      const wasDirectAccess = !document.referrer || document.referrer === window.location.origin + '/';
      if (wasDirectAccess) {
        window.history.replaceState({}, '', '/');
        window.location.href = '/';
        console.log('Force home route: redirected from hot-deals to home');
        return true;
      }
    }
    
    // Additional safety check - if localStorage has home preference
    const homePreference = localStorage.getItem('bdd-home-preference');
    if (homePreference === 'force-home' && currentPath === '/hot-deals') {
      window.history.replaceState({}, '', '/');
      window.location.href = '/';
      console.log('Force home route: localStorage preference enforced');
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