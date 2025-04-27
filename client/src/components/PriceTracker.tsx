import { useToken } from "@/hooks/use-token";
import { useEffect, useState } from "react";

export default function PriceTracker() {
  const { prices, fetchPrices } = useToken();
  const [isMinimized, setIsMinimized] = useState(false);
  
  useEffect(() => {
    // Refresh prices initially and every 60 seconds
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    
    return () => clearInterval(interval);
  }, [fetchPrices]);
  
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 w-64 overflow-hidden">
        <div 
          className="flex items-center justify-between p-3 bg-gray-750 cursor-pointer"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <div className="flex items-center gap-2">
            <i className="ri-line-chart-line text-primary-500"></i>
            <h3 className="text-sm font-medium">Live Cryptocurrency Prices</h3>
          </div>
          <button className="text-gray-400 hover:text-white">
            {isMinimized ? (
              <i className="ri-arrow-up-s-line"></i>
            ) : (
              <i className="ri-arrow-down-s-line"></i>
            )}
          </button>
        </div>
        
        {!isMinimized && (
          <div className="p-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img 
                    src="https://assets.coingecko.com/coins/images/24437/standard/rbtc-coingecko.png" 
                    alt="RBTC" 
                    className="w-5 h-5"
                  />
                  <span className="text-sm">Bitcoin (RBTC)</span>
                </div>
                <span className="text-sm font-mono">${prices.RBTC?.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img 
                    src="https://assets.coingecko.com/coins/images/279/standard/ethereum.png" 
                    alt="RETH" 
                    className="w-5 h-5"
                  />
                  <span className="text-sm">Ethereum (RETH)</span>
                </div>
                <span className="text-sm font-mono">${prices.RETH?.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img 
                    src="https://assets.coingecko.com/coins/images/6319/standard/usdc.png" 
                    alt="USDC" 
                    className="w-5 h-5"
                  />
                  <span className="text-sm">USD Coin (USDC)</span>
                </div>
                <span className="text-sm font-mono">${prices.USDC?.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img 
                    src="https://assets.coingecko.com/coins/images/325/standard/Tether.png" 
                    alt="RUSDT" 
                    className="w-5 h-5"
                  />
                  <span className="text-sm">Tether (RUSDT)</span>
                </div>
                <span className="text-sm font-mono">${prices.RUSDT?.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="mt-3 pt-2 border-t border-gray-700 text-xs text-gray-400 flex items-center justify-between">
              <span>Data by CoinGecko</span>
              <span>Auto-updating</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}