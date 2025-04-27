import { useState, useCallback, useEffect } from "react";
import { DEFAULT_TOKENS } from "@/lib/constants";
import axios from "axios";

interface TokenPrice {
  [symbol: string]: number;
}

export function useToken(walletAddress?: string) {
  const [tokens, setTokens] = useState(DEFAULT_TOKENS);
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [prices, setPrices] = useState<TokenPrice>({
    RBTC: 67500,
    USDC: 1,
    RETH: 4300,
    RUSDT: 1
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  
  // Fetch token balances from the blockchain
  const fetchBalances = useCallback(async () => {
    if (!walletAddress) return;
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call a blockchain API or use a Web3 library
      // to get actual balances from the blockchain
      
      // For demo purposes, using mock balances
      const mockBalances: Record<string, number> = {
        RBTC: 0.0045,
        USDC: 25.45,
        RETH: 0.15,
        RUSDT: 50.0,
      };
      
      setBalances(mockBalances);
    } catch (error) {
      console.error("Error fetching token balances:", error);
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress]);
  
  // Fetch real-time token prices
  const fetchPrices = useCallback(async () => {
    setIsPriceLoading(true);
    
    try {
      // CoinGecko free API
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin&vs_currencies=usd'
      );
      
      if (response.data) {
        const newPrices: TokenPrice = {
          RBTC: response.data.bitcoin?.usd || 67500,
          RETH: response.data.ethereum?.usd || 4300,
          RUSDT: response.data.tether?.usd || 1,
          USDC: response.data['usd-coin']?.usd || 1,
        };
        
        setPrices(newPrices);
      }
    } catch (error) {
      console.error("Error fetching token prices:", error);
      // Keep using the default prices if there's an error
    } finally {
      setIsPriceLoading(false);
    }
  }, []);
  
  // Initial fetch of balances and prices
  useEffect(() => {
    if (walletAddress) {
      fetchBalances();
    }
    
    fetchPrices();
    
    // Set up a timer to refresh prices every minute
    const priceRefreshInterval = setInterval(fetchPrices, 60000);
    
    return () => clearInterval(priceRefreshInterval);
  }, [walletAddress, fetchBalances, fetchPrices]);
  
  // Get balance for a specific token
  const getBalance = useCallback((symbol: string): number | undefined => {
    return balances[symbol];
  }, [balances]);
  
  // Get price for a specific token
  const getPrice = useCallback((symbol: string): number => {
    return prices[symbol] || 1;
  }, [prices]);
  
  // Calculate USD value
  const getUsdValue = useCallback((symbol: string, amount: number | string): string => {
    const price = getPrice(symbol);
    const amountNum = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
    return (amountNum * price).toFixed(2);
  }, [getPrice]);
  
  // Add a custom token
  const addToken = useCallback((token: any) => {
    setTokens((prevTokens) => {
      // Check if token already exists
      if (prevTokens.some(t => t.symbol === token.symbol)) {
        return prevTokens;
      }
      return [...prevTokens, token];
    });
  }, []);

  return {
    tokens,
    balances,
    prices,
    isLoading,
    isPriceLoading,
    fetchBalances,
    fetchPrices,
    getBalance,
    getPrice,
    getUsdValue,
    addToken,
  };
}
