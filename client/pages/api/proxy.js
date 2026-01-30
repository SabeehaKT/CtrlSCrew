// Next.js API route that proxies requests to FastAPI backend
// This eliminates CORS issues

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export default async function handler(req, res) {
  const { endpoint } = req.query;
  
  if (!endpoint) {
    return res.status(400).json({ detail: 'Endpoint is required' });
  }

  try {
    // Get authorization header from request
    const authHeader = req.headers.authorization;
    
    // Build headers for backend request
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Build fetch options
    const fetchOptions = {
      method: req.method,
      headers,
    };

    // Add body for POST/PUT/PATCH requests
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = JSON.stringify(req.body);
    }

    // Make request to backend
    const backendUrl = `${BACKEND_URL}${endpoint}`;
    console.log('Proxying request to:', backendUrl);
    
    const response = await fetch(backendUrl, fetchOptions);

    // Get response data
    const data = await response.json().catch(() => ({}));

    // Return response with same status code
    return res.status(response.status).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error.message);
    return res.status(500).json({ 
      detail: `Backend connection failed: ${error.message}. Make sure backend is running on port 8000.`
    });
  }
}
