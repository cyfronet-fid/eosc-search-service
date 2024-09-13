export function initializeCollectionsPrefix(): () => void {
  return () => {
    const storedPrefix = localStorage.getItem('COLLECTIONS_PREFIX');
    if (!storedPrefix) {
      localStorage.setItem('COLLECTIONS_PREFIX', 'pl'); // Default to 'pl'
    }
  };
}
