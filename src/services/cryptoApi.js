import { COIN_ID_MAP, COIN_SYMBOL_MAP } from '../config/coingecko';

/**
 * Get current price for multiple coins
 * @param {string[]} tradingPairs - Array of trading pairs (e.g. ['BTC/USDT', 'ETH/USDT'])
 * @returns {Promise<Object>} Price data for requested coins
 */
export const getCurrentPrices = async (tradingPairs) => {
  try {
    const ids = tradingPairs.map(pair => COIN_ID_MAP[pair]).filter(Boolean).join(',');
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=inr&include_24hr_change=true`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch current prices');
    }

    const data = await response.json();
    
    // Transform CoinGecko response to match our app's expected format
    const prices = {};
    tradingPairs.forEach(pair => {
      const id = COIN_ID_MAP[pair];
      const symbol = COIN_SYMBOL_MAP[pair];
      if (id && data[id]) {
        prices[symbol] = {
          usd: data[id].inr,
          usd_24h_change: data[id].inr_24h_change
        };
      }
    });

    return prices;
  } catch (error) {
    console.error('Error fetching current prices:', error);
    throw error;
  }
};

/**
 * Get historical market data for a specific coin
 * @param {string} tradingPair - Trading pair (e.g. 'BTC/USDT')
 * @param {number} days - Number of days of data to retrieve
 * @returns {Promise<Object>} Historical price data
 */
export const getHistoricalData = async (tradingPair, days = 7) => {
  try {
    const id = COIN_ID_MAP[tradingPair];
    if (!id) throw new Error(`Unsupported trading pair: ${tradingPair}`);

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=inr&days=${days}&interval=daily`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch historical data');
    }

    const data = await response.json();
    
    // Transform the data to match our app's expected format
    return data.prices.map(([timestamp, price]) => ({
      x: new Date(timestamp).toISOString(),
      y: price
    }));
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
};

/**
 * Get detailed market data for multiple coins
 * @param {string[]} tradingPairs - Array of trading pairs
 * @returns {Promise<Object>} Detailed market data for requested coins
 */
export const getMarketData = async (tradingPairs) => {
  try {
    const ids = tradingPairs.map(pair => COIN_ID_MAP[pair]).filter(Boolean).join(',');
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${ids}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch market data');
    }

    const data = await response.json();
    
    // Transform the response to match our needs
    return data.map(coin => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      total_volume: coin.total_volume,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      circulating_supply: coin.circulating_supply
    }));
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};