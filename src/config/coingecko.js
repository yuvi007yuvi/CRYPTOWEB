// CoinGecko API Configuration
export const COINGECKO_CONFIG = {
  BASE_URL: 'https://api.coingecko.com/api/v3'
};

// Map our trading pairs to CoinGecko IDs
export const COIN_ID_MAP = {
  'BTC/USDT': 'bitcoin',
  'ETH/USDT': 'ethereum',
  'BNB/USDT': 'binancecoin'
};

// Map our trading pairs to CoinGecko symbols (for market data)
export const COIN_SYMBOL_MAP = {
  'BTC/USDT': 'btc',
  'ETH/USDT': 'eth',
  'BNB/USDT': 'bnb'
};