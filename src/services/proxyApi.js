import axios from 'axios';

const PROXY_BASE_URL = 'http://localhost:5000/api/crypto';

/**
 * Make API requests through our proxy server
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise<any>} Response data
 */
const makeProxyRequest = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${PROXY_BASE_URL}${endpoint}`, { params });
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    throw error;
  }
};

export const proxyApi = {
  get: makeProxyRequest
};