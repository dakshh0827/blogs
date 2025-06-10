const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side
    return '';
  }
  
  // Server-side
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // Fallback
  return '';
};

export { getBaseUrl };