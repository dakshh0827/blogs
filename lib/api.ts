const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side
    return '';
  }
  
  // Server-side
  
  // Render platform - uses RENDER_EXTERNAL_URL
  if (process.env.RENDER_EXTERNAL_URL) {
    return process.env.RENDER_EXTERNAL_URL;
  }
  
  // Vercel platform
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Railway platform
  if (process.env.RAILWAY_STATIC_URL) {
    return process.env.RAILWAY_STATIC_URL;
  }
  
  // Heroku platform
  if (process.env.HEROKU_APP_NAME) {
    return `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`;
  }
  
  // Development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // Fallback - try to construct from PORT
  if (process.env.PORT) {
    return `http://localhost:${process.env.PORT}`;
  }
  
  // Final fallback
  return '';
};

export { getBaseUrl };