import { GeminiRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

// Define the request and response types
interface GeminiAnalysisResponse {
  summary: string;
  insights: string[];
  recommendedRoutes: SwapRouteRecommendation[];
  marketConditions: string;
}

export interface SwapRouteRecommendation {
  provider: string;
  routeType: string;
  path: string[];
  output: {
    amount: string;
    token: string;
  };
  gas: {
    amount: string;
    token: string;
  };
  slippage: number;
  improvement: number;
  isRecommended?: boolean;
}

// Function to get AI analysis for a swap
export async function getGeminiAnalysis(request: GeminiRequest): Promise<GeminiAnalysisResponse> {
  try {
    const response = await apiRequest('POST', '/api/gemini/analyze', request);
    return await response.json();
  } catch (error) {
    console.error("Error getting Gemini analysis:", error);
    throw error;
  }
}

// Mock Gemini analysis response (only used if API request fails)
export function getMockGeminiAnalysis(request: GeminiRequest): GeminiAnalysisResponse {
  return {
    summary: `You're swapping ${request.amount} ${request.fromToken} for approximately 124.32 ${request.toToken} on Rootstock network.`,
    insights: [
      "Market conditions indicate favorable timing for this swap with minimal price impact.",
      "Based on 24h price movements, you could gain an additional 1.2% by using the optimal route.",
      "Liquidity on RocketSwap for this pair is 15% higher than other DEXs, resulting in less slippage.",
      "Current network congestion is low, suggesting good transaction confirmation times."
    ],
    recommendedRoutes: [
      {
        provider: "RocketSwap",
        routeType: "Direct swap",
        path: [request.fromToken, request.toToken],
        output: {
          amount: "124.32",
          token: request.toToken
        },
        gas: {
          amount: "0.0001",
          token: "RBTC"
        },
        slippage: 0.05,
        improvement: 1.2,
        isRecommended: true
      },
      {
        provider: "RSK Swap",
        routeType: "Direct swap",
        path: [request.fromToken, request.toToken],
        output: {
          amount: "123.98",
          token: request.toToken
        },
        gas: {
          amount: "0.0002",
          token: "RBTC"
        },
        slippage: 0.1,
        improvement: 0.8
      },
      {
        provider: "MultiHop",
        routeType: "2-hop route",
        path: [request.fromToken, "RETH", request.toToken],
        output: {
          amount: "123.65",
          token: request.toToken
        },
        gas: {
          amount: "0.0003",
          token: "RBTC"
        },
        slippage: 0.2,
        improvement: 0.5
      }
    ],
    marketConditions: "RBTC has increased 3.5% in the last 24 hours, making this a favorable time to swap to stablecoins."
  };
}
