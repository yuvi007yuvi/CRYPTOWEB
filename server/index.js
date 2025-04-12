const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for our frontend
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET']
}));

// Cache configuration
const cache = new Map();
const CACHE_DURATION = 60000; // 1 minute

// Rate limiting configuration
const RATE_LIMIT_RESET_INTERVAL = 60000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 30;
let requestCount = 0;
let lastResetTime = Date.now();

// Middleware to check rate limits
const checkRateLimit = (req, res, next) => {
  const now = Date.now();
  if (now - lastResetTime >= RATE_LIMIT_RESET_INTERVAL) {
    requestCount = 0;
    lastResetTime = now;
  }

  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
  }

  requestCount++;
  next();
};

// Proxy endpoint for CoinMarketCap API
app.get('/api/crypto/*', checkRateLimit, async (req, res) => {
  try {
    const endpoint = req.path.replace('/api/crypto', '');
    const cacheKey = `${endpoint}?${new URLSearchParams(req.query).toString()}`;
    
    // Check cache
    const cachedData = cache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return res.json(cachedData.data);
    }

    // Forward request to CoinMarketCap
    const response = await axios({
      method: 'get',
      url: `${process.env.COINMARKETCAP_BASE_URL}${endpoint}`,
      params: req.query,
      headers: {
        'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY,
        'Accept': 'application/json'
      }
    });

    // Update cache
    cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now()
    });

    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.status?.error_message || 'Internal server error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});