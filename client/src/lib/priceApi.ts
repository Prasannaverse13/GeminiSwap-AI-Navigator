import axios from 'axios';

// Interface for coin price data
interface CoinPriceData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  last_updated: string;
}

// Mapping of our tokens to CoinGecko IDs
const coinGeckoIdMap: Record<string, string> = {
  RBTC: 'rootstock',           // Rootstock BTC
  USDC: 'usd-coin',           // USD Coin
  RETH: 'ethereum',           // Rootstock ETH (using Ethereum price)
  RUSDT: 'tether',            // Rootstock Tether (using Tether price)
};

/**
 * Fetches current prices from CoinGecko API
 * Uses the free public API with appropriate rate limiting
 */
export async function fetchCoinPrices(): Promise<Record<string, number>> {
  try {
    // Extract the coin IDs we need
    const coinIds = Object.values(coinGeckoIdMap).join(',');
    
    // Make API request to CoinGecko
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
    );
    
    // Process the response data
    const priceData: Record<string, number> = {};
    
    if (response.data && Array.isArray(response.data)) {
      // Map CoinGecko data to our token symbols
      response.data.forEach((coin: CoinPriceData) => {
        // Find which of our tokens uses this CoinGecko ID
        const ourSymbol = Object.entries(coinGeckoIdMap).find(
          ([_, geckoId]) => geckoId === coin.id
        )?.[0];
        
        if (ourSymbol) {
          priceData[ourSymbol] = coin.current_price;
        }
      });
    }
    
    return priceData;
  } catch (error) {
    console.error('Error fetching coin prices:', error);
    // Return fallback prices if API fails
    return {
      RBTC: 67500,
      USDC: 1,
      RETH: 4300,
      RUSDT: 1,
    };
  }
}

/**
 * Alternative method that uses CryptoCompare API
 * as a backup if CoinGecko is unavailable
 */
export async function fetchCryptoComparePrices(): Promise<Record<string, number>> {
  try {
    // Map our symbols to CryptoCompare symbols
    const symbolMap: Record<string, string> = {
      RBTC: 'BTC',
      USDC: 'USDC',
      RETH: 'ETH',
      RUSDT: 'USDT',
    };
    
    // Extract the symbols we need
    const symbols = Object.values(symbolMap).join(',');
    
    // Make API request to CryptoCompare
    const response = await axios.get(
      `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols}&tsyms=USD`
    );
    
    // Process the response data
    const priceData: Record<string, number> = {};
    
    if (response.data) {
      // Map CryptoCompare data to our token symbols
      Object.entries(symbolMap).forEach(([ourSymbol, compareSymbol]) => {
        if (response.data[compareSymbol] && response.data[compareSymbol].USD) {
          priceData[ourSymbol] = response.data[compareSymbol].USD;
        }
      });
    }
    
    return priceData;
  } catch (error) {
    console.error('Error fetching CryptoCompare prices:', error);
    // Return fallback prices if API fails
    return {
      RBTC: 67500,
      USDC: 1,
      RETH: 4300,
      RUSDT: 1,
    };
  }
}

/**
 * Gets pricing data from multiple sources with fallback
 */
export async function getTokenPrices(): Promise<Record<string, number>> {
  try {
    // Try CoinGecko first
    const prices = await fetchCoinPrices();
    
    // If we have prices for all our tokens, return them
    if (Object.keys(prices).length >= Object.keys(coinGeckoIdMap).length) {
      return prices;
    }
    
    // Otherwise, try CryptoCompare as a backup
    return await fetchCryptoComparePrices();
  } catch (error) {
    console.error('Failed to fetch prices from all sources:', error);
    // Final fallback to static prices
    return {
      RBTC: 67500,
      USDC: 1,
      RETH: 4300,
      RUSDT: 1,
    };
  }
}