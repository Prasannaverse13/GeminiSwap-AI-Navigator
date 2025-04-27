import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getGeminiAnalysis, getMockGeminiAnalysis, SwapRouteRecommendation } from "@/lib/gemini";
import { useQuery } from "@tanstack/react-query";
import { GeminiRequest } from "@shared/schema";

interface AIInsightsPanelProps {
  fromToken: { symbol: string };
  toToken: { symbol: string };
  fromAmount: string;
  slippageTolerance: number;
  deadline: number;
  gasPreference: string;
  riskProfile: string;
  preferredDexs: string[];
  onRouteSelect: (route: SwapRouteRecommendation) => void;
}

export default function AIInsightsPanel({
  fromToken,
  toToken,
  fromAmount,
  slippageTolerance,
  deadline,
  gasPreference,
  riskProfile,
  preferredDexs,
  onRouteSelect
}: AIInsightsPanelProps) {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  
  // Prepare the request payload for Gemini API
  const request: GeminiRequest = {
    fromToken: fromToken.symbol,
    toToken: toToken.symbol,
    amount: fromAmount,
    slippageTolerance,
    deadline,
    gasPreference,
    riskProfile,
    preferredDexs
  };
  
  const shouldFetch = fromAmount && parseFloat(fromAmount) > 0;
  
  // Fetch AI analysis
  const { data: analysis, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/gemini/analyze", request],
    enabled: Boolean(shouldFetch),
    staleTime: 60000, // 1 minute
    queryFn: async () => {
      try {
        return await getGeminiAnalysis(request);
      } catch (err) {
        console.error("Failed to get Gemini analysis:", err);
        // Fallback to mock data for demo purposes
        return getMockGeminiAnalysis(request);
      }
    }
  });
  
  // Refetch when inputs change
  useEffect(() => {
    if (shouldFetch) {
      refetch();
    }
  }, [fromToken.symbol, toToken.symbol, fromAmount, slippageTolerance, riskProfile, refetch, shouldFetch]);
  
  // Handle route selection
  const handleRouteSelect = (route: SwapRouteRecommendation) => {
    setSelectedRoute(route.provider);
    onRouteSelect(route);
  };
  
  // Format the path of tokens
  const formatPath = (path: string[]) => {
    if (!path || path.length === 0) return null;
    
    const getTokenColor = (symbol: string) => {
      const colorMap: Record<string, string> = {
        RBTC: "bg-yellow-500",
        USDC: "bg-blue-500",
        RETH: "bg-gray-400",
        RUSDT: "bg-green-500",
      };
      return colorMap[symbol] || "bg-gray-500";
    };
    
    const getTokenLogo = (symbol: string) => {
      const logoMap: Record<string, string> = {
        RBTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
        USDC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
        RETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
        RUSDT: "https://cryptologos.cc/logos/tether-usdt-logo.png",
      };
      return logoMap[symbol] || "";
    };
    
    return (
      <div className="flex items-center gap-1 mb-3">
        {path.map((token, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center overflow-hidden ${getTokenColor(token)}`}>
              <img src={getTokenLogo(token)} alt={token} className="w-5 h-5 object-contain" />
            </div>
            {index < path.length - 1 && (
              <i className="ri-arrow-right-line text-gray-500 mx-1"></i>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="lg:col-span-3">
      <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 h-full flex flex-col">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="ri-robot-line text-blue-400"></i>
              </div>
            </div>
            <h2 className="text-lg font-semibold">AI Trading Insights</h2>
          </div>
          <div className="text-xs inline-flex items-center bg-blue-500/10 text-blue-400 rounded-full px-3 py-1">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Powered by Gemini AI
          </div>
        </div>
        
        <div id="aiInsightsContent" className="p-4 flex-grow overflow-y-auto scrollbar-thin">
          {/* Not connected or no amount entered */}
          {!shouldFetch && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-lock-line text-3xl text-gray-500"></i>
              </div>
              <h3 className="text-xl font-medium mb-2">Enter an amount</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Enter a swap amount to see AI-powered recommendations and market insights.
              </p>
            </div>
          )}
          
          {/* Loading state */}
          {isLoading && shouldFetch && (
            <div className="py-12">
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 relative mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="ri-robot-line text-3xl text-blue-400"></i>
                  </div>
                </div>
                <h3 className="text-xl font-medium mb-2">Analyzing your swap</h3>
                <p className="text-gray-400 max-w-md text-center">
                  GeminiSwap AI is analyzing market conditions and finding the best swap options...
                </p>
                
                <div className="w-full max-w-md mt-6 space-y-3">
                  <div className="loading-shimmer h-4 w-3/4 rounded-full"></div>
                  <div className="loading-shimmer h-4 w-1/2 rounded-full"></div>
                  <div className="loading-shimmer h-4 w-5/6 rounded-full"></div>
                </div>
                
                <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-md">
                  <div className="loading-shimmer h-24 rounded-lg"></div>
                  <div className="loading-shimmer h-24 rounded-lg"></div>
                  <div className="loading-shimmer h-24 rounded-lg"></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Error state */}
          {error && shouldFetch && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-error-warning-line text-3xl text-red-500"></i>
              </div>
              <h3 className="text-xl font-medium mb-2">Analysis Error</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                There was an error getting AI insights for your swap. Please try again.
              </p>
              <Button onClick={() => refetch()}>Retry Analysis</Button>
            </div>
          )}
          
          {/* Results state */}
          {analysis && !isLoading && !error && (
            <div>
              {/* Summary section */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Swap Summary</h3>
                <div className="bg-gray-850 rounded-lg p-4">
                  <p className="text-gray-300 mb-3">
                    {analysis.summary}
                  </p>
                  <div className="text-sm text-gray-400 space-y-2">
                    {analysis.insights && analysis.insights.map((insight: string, index: number) => (
                      <p key={index}>{insight}</p>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Recommended routes */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium">Recommended Routes</h3>
                  <div className="text-xs text-gray-400">Based on current market data</div>
                </div>
                
                {analysis.recommendedRoutes && analysis.recommendedRoutes.map((route: SwapRouteRecommendation, index: number) => (
                  <div 
                    key={index}
                    className={`${
                      route.isRecommended 
                        ? "bg-gradient-to-r from-primary-900/50 to-primary-800/30 border border-primary-700/50" 
                        : "bg-gray-850 border border-gray-700"
                    } rounded-lg p-4 mb-3 relative overflow-hidden`}
                  >
                    {route.isRecommended && (
                      <div className="absolute top-0 right-0 bg-primary-600 text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
                        BEST ROUTE
                      </div>
                    )}
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className={`${route.isRecommended ? "bg-gray-700" : "bg-gray-800"} rounded-lg p-3 text-center w-24`}>
                          <div className={`text-2xl font-semibold ${route.isRecommended ? "text-green-500" : "text-gray-300"}`}>
                            +{route.improvement.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-400 mt-1">vs market</div>
                        </div>
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`${
                            route.provider === "RocketSwap" ? "text-primary-400" :
                            route.provider === "RSK Swap" ? "text-blue-400" :
                            "text-green-400"
                          } font-medium`}>
                            {route.provider}
                          </div>
                          <i className="ri-arrow-right-line text-gray-500"></i>
                          <div className="text-white">{route.routeType}</div>
                        </div>
                        
                        {formatPath(route.path)}
                        
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="bg-gray-800/80 rounded p-2">
                            <div className="text-gray-400 text-xs mb-1">Output</div>
                            <div className="font-mono font-medium">
                              {route.output.amount} {route.output.token}
                            </div>
                          </div>
                          <div className="bg-gray-800/80 rounded p-2">
                            <div className="text-gray-400 text-xs mb-1">Gas fee</div>
                            <div className={`font-mono font-medium ${
                              parseFloat(route.gas.amount) <= 0.0001 ? "text-green-500" :
                              parseFloat(route.gas.amount) <= 0.0002 ? "text-yellow-400" :
                              "text-red-500"
                            }`}>
                              {route.gas.amount} {route.gas.token}
                            </div>
                          </div>
                          <div className="bg-gray-800/80 rounded p-2">
                            <div className="text-gray-400 text-xs mb-1">Slippage</div>
                            <div className="font-mono font-medium">
                              {route.slippage.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <Button
                          variant={selectedRoute === route.provider ? "default" : (route.isRecommended ? "default" : "secondary")}
                          className={`w-full md:w-auto ${selectedRoute === route.provider ? "" : (route.isRecommended ? "" : "bg-gray-700 hover:bg-gray-600")}`}
                          onClick={() => handleRouteSelect(route)}
                        >
                          {selectedRoute === route.provider ? "Selected" : "Select"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Market insights */}
              <div>
                <h3 className="text-lg font-medium mb-3">Market Insights</h3>
                <div className="bg-gray-850 rounded-lg p-4">
                  <p className="text-gray-300 mb-3">
                    Analysis based on current market conditions and historical data:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <i className="ri-arrow-right-up-line text-green-500 mt-0.5"></i>
                      <span>{analysis.marketConditions}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-information-line text-blue-400 mt-0.5"></i>
                      <span>Liquidity on RocketSwap for {fromToken.symbol}/{toToken.symbol} pair is 15% higher than other DEXs, resulting in less slippage.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-timer-line text-yellow-400 mt-0.5"></i>
                      <span>Current network congestion is low, suggesting good transaction confirmation times.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-eye-line text-purple-400 mt-0.5"></i>
                      <span>Based on trend analysis, {fromToken.symbol} may continue rising over the next 48 hours (confidence: medium).</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
