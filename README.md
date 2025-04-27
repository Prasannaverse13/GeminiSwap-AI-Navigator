# GeminiSwap AI Navigator

GeminiSwap AI Navigator is an intelligent DeFi contract assistant that helps users navigate cryptocurrency swaps on the Rootstock blockchain testnet. The application leverages Google's Gemini AI API to provide intelligent insights, risk assessments, and recommendations for optimizing decentralized finance transactions.


## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [AI Integration Documentation](#ai-integration-documentation)
- [Rootstock Integration](#rootstock-integration)
- [Development Process](#development-process)

## Features

- **AI-Powered Swap Recommendations**: Utilizes Google's Gemini AI to analyze market conditions and recommend optimal swap routes.
- **Risk Analysis**: Provides detailed risk assessments based on slippage, gas fees, and market volatility.
- **Wallet Integration**: Seamlessly connects to cryptocurrency wallets for easy transaction execution.
- **Multi-DEX Support**: Compares rates across multiple decentralized exchanges on Rootstock.
- **Custom Swap Settings**: Adjustable slippage tolerance, transaction deadlines, and gas preferences.
- **Real-time Market Data**: Up-to-date token prices and exchange rates.

## Technology Stack

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI
- **Backend**: Node.js, Express
- **Blockchain**: Rootstock Testnet (RSK)
- **AI Service**: Google Gemini API
- **Data Storage**: In-memory with Drizzle ORM interface

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- A web3-compatible browser wallet (MetaMask recommended)
- Rootstock testnet RBTC (for testing transactions)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Project Structure

The project follows a client-server architecture:

- `/client`: Frontend React application
  - `/src/components`: React components including the swap interface and AI insights panel
  - `/src/hooks`: Custom React hooks for wallet, tokens, and swap operations
  - `/src/lib`: Utility functions and constants
  - `/src/pages`: Application pages

- `/server`: Backend Express server
  - `/routes.ts`: API endpoints 
  - `/storage.ts`: Data storage implementation

- `/shared`: Shared code between client and server
  - `/schema.ts`: Database schema definitions

## AI Integration Documentation

### Gemini AI Implementation

The project integrates Google's Gemini AI to provide intelligent swap insights and recommendations. The AI component analyzes market conditions, user preferences, and historical data to suggest optimal swap routes.

### AI Code Generation Examples

The Gemini AI can also assist developers with code generation for blockchain-related tasks. Below is an example of how the AI can generate Solidity smart contracts based on specific requirements:

#### Key AI Features

1. **Swap Path Optimization**: Identifies the most efficient token swap paths based on current market conditions
2. **Price Impact Analysis**: Estimates the price impact of large swaps
3. **Risk Assessment**: Evaluates the risk level of proposed transactions
4. **Market Condition Reports**: Provides summaries of current market status and trends

#### AI Integration Files

- `client/src/lib/gemini.ts`: Contains the core logic for interacting with the Gemini API
- `client/src/components/AIInsightsPanel.tsx`: Displays AI-generated insights and recommendations
- `shared/schema.ts`: Defines the data structure for AI analysis results

#### Example AI Request Structure

```typescript
export interface GeminiRequest {
  fromToken: string;
  toToken: string;
  amount: string;
  slippageTolerance: number;
  deadline: number;
  gasPreference: string;
  riskProfile: string;
  preferredDexs: string[];
  walletHistory?: {
    previousSwaps: number;
    averageAmount: number;
    preferredTokens: string[];
  };
}
```

### AI Prompt Engineering

When designing the prompts for Gemini AI, we focused on structuring requests that would yield actionable DeFi insights. The prompts include:

1. **Context Setting**: Information about the user's token pair, amount, and preferences
2. **Specific Queries**: Clear questions about optimal routes, risks, and market conditions
3. **Response Formatting**: Instructions for structured output that can be parsed and displayed in the UI

## AI Prompts Submission

### Prompt 1: DeFi Swap Route Optimization

#### Prompt Title
DeFi Swap Route Optimization with Risk Analysis

#### Prompt Text
```
You are a DeFi expert assistant for a cryptocurrency swap application. Analyze the following swap request:

User wants to swap {fromAmount} {fromToken} to {toToken}
Slippage Tolerance: {slippageTolerance}%
Transaction Deadline: {deadline} minutes
Gas Preference: {gasPreference}
Risk Profile: {riskProfile}
Preferred DEXs: {preferredDexs}

Please provide:
1. A brief market analysis for this trading pair (2-3 sentences)
2. An analysis of current gas costs and network congestion
3. At least 3 possible swap routes with these exact details for each:
   - Route path (which DEXs and intermediate tokens)
   - Expected output amount
   - Gas cost (in USD)
   - Price impact
   - Estimated slippage
   - Any specific risks for this route
4. Clearly indicate which route you recommend and why
5. 2-3 specific insights that might help the user make better swaps

Format your response as a structured JSON with the following keys:
- summary: string
- insights: string[]
- recommendedRoutes: array of route objects
- marketConditions: string
```

#### Expected Output
A structured JSON response containing swap route analysis with recommended paths, gas fees, and risk assessments.

#### AI Model / Tool Used
Google Gemini Pro API

#### Use Case
This prompt is used in the AIInsightsPanel component to analyze and recommend optimal swap routes based on current market conditions, user preferences, and risk tolerance. It helps users make informed decisions about their DeFi transactions.

#### Best Practices / Insights
- Including specific formatting instructions ensures consistent JSON output that can be parsed by the application
- Combining market data with user preferences (risk profile, preferred DEXs) produces personalized recommendations
- Requesting multiple route options with comparison metrics helps users understand tradeoffs between speed, cost, and risk
- Adding specific structure for insights helps the AI provide actionable information rather than generic advice

#### Example Output
```json
{
  "summary": "Swapping RBTC to USDC now is favorable as BTC has seen a 5% increase in the last 24 hours. Network congestion is moderate.",
  "insights": [
    "Splitting your swap across multiple DEXs could save approximately 0.5% in fees and price impact",
    "Current market volatility suggests setting a slightly higher slippage tolerance of 1.5% for this trade",
    "RBTC liquidity is higher on RocketSwap than other DEXs right now, giving better execution"
  ],
  "recommendedRoutes": [
    {
      "provider": "RocketSwap",
      "routeType": "Direct",
      "path": ["RBTC", "USDC"],
      "output": {
        "amount": "16,882.50",
        "token": "USDC"
      },
      "gas": {
        "amount": "4.28",
        "token": "USD"
      },
      "slippage": 0.8,
      "improvement": 15,
      "isRecommended": true
    },
    {
      "provider": "MultiHop",
      "routeType": "Multi-hop",
      "path": ["RBTC", "RUSDT", "USDC"],
      "output": {
        "amount": "16,875.25",
        "token": "USDC"
      },
      "gas": {
        "amount": "6.52",
        "token": "USD"
      },
      "slippage": 1.2,
      "improvement": 5,
      "isRecommended": false
    }
  ],
  "marketConditions": "Market conditions are currently favorable with bullish trends for BTC. USDC liquidity is healthy across major DEXs. Volatility is moderate."
}
```

### Prompt 2: DeFi Risk Assessment

#### Prompt Title
DeFi Transaction Risk Profile Assessment

#### Prompt Text
```
Analyze the risk profile of the following cryptocurrency transaction:

Transaction type: Swap
From token: {fromToken}
To token: {toToken}
Amount: {amount} {fromToken}
DEX: {dexName}
Liquidity pool size: ${poolSize}
Transaction time: {timeOfDay}
Current market trend: {marketTrend}

Provide a thorough risk assessment with:
1. Overall risk score (1-10 scale)
2. Impermanent loss risk
3. Slippage risk analysis
4. Smart contract vulnerability assessment
5. Market manipulation risk
6. Counterparty risk
7. Recommended mitigation strategies

Format your response as JSON with appropriate keys for each risk category.
```

#### Expected Output
A JSON format risk assessment with numerical scores and text explanations for different risk factors.

#### AI Model / Tool Used
Google Gemini Pro API

#### Use Case
Used in the transaction preparation phase to help users understand potential risks before executing a swap, particularly for large amounts or volatile tokens.

#### Best Practices / Insights
- Including pool size and market trend data significantly improves the accuracy of risk assessments
- Numerical scoring helps users quickly understand relative risk levels
- Tailoring risk factors to the specific DeFi operation (swap vs. provide liquidity) makes the analysis more relevant
- Requesting specific mitigation strategies makes the AI output more actionable

#### Example Output
```json
{
  "overallRiskScore": 6.5,
  "riskCategories": {
    "impermanentLoss": {
      "score": 4,
      "assessment": "Moderate risk due to recent volatility in ETH prices",
      "explanation": "While providing liquidity, you may experience impermanent loss if RETH price fluctuates significantly against RUSDT"
    },
    "slippage": {
      "score": 7,
      "assessment": "Higher than average risk",
      "explanation": "The pool has relatively low liquidity ($2.5M) compared to the transaction size, expect 2-3% slippage"
    },
    "smartContractRisk": {
      "score": 5,
      "assessment": "Medium risk",
      "explanation": "RSKSwap contracts are audited but relatively new compared to established Ethereum DEXs"
    }
  },
  "mitigationStrategies": [
    "Consider splitting the transaction into 3-4 smaller swaps to reduce slippage",
    "Set slippage tolerance to 3% for this particular transaction",
    "Wait until US market hours when liquidity is typically 15-20% higher"
  ]
}
```

## Rootstock Integration

This project runs exclusively on the **Rootstock Testnet** blockchain network. Rootstock is a smart contract platform secured by the Bitcoin network that enables DeFi applications with Bitcoin-based security.

### Key Rootstock Integration Points

1. **Network Configuration**: 
   - The application connects to Rootstock Testnet RPC endpoints
   - Chain ID: 31 (Rootstock Testnet)
   - Network Name: RSK Testnet

2. **Token Support**:
   - RBTC (Rootstock's native token)
   - RUSDT (Rootstock Tether)
   - USDC on Rootstock
   - RETH (Rootstock ETH)

3. **Integration Files**:
   - `client/src/lib/rootstock.ts`: Contains Rootstock-specific utilities and network configuration
   - `client/src/hooks/use-wallet.tsx`: Manages wallet connection to Rootstock network
   - `client/src/lib/constants.ts`: Defines Rootstock token addresses and DEX providers

### Testnet Usage

The application is configured to work with the Rootstock Testnet, which allows for testing the full functionality without using real assets. To use the application:

1. Configure MetaMask for Rootstock Testnet (Network ID: 31)
2. Obtain testnet RBTC from the Rootstock faucet
3. Connect your wallet to the application

## Development Process

### Building with AI Assistance

This project was developed with the assistance of AI tools that helped streamline the development process:

1. **Initial Planning**: Used AI to generate ideas for features and architecture
2. **Component Design**: Generated skeleton code for React components
3. **Integration Challenges**: Resolved blockchain integration issues with AI-assisted debugging
4. **Documentation**: AI helped create comprehensive documentation

The development workflow involved:
1. Defining project requirements
2. Designing the architecture and data models
3. Implementing the UI and core functionality
4. Integrating with Rootstock and Gemini AI
5. Testing and refining the user experience

### Latest Updates (April 2025)

- **Real-time Cryptocurrency Pricing**: Integrated CoinGecko's API to provide up-to-date token prices
- **PriceTracker Widget**: Added a minimizable price widget that shows current prices for major cryptocurrencies
- **Enhanced User Experience**: Updated token displays with accurate USD valuations
- **UI Improvements**: Simplified footer and updated token logos to use original cryptocurrency images

### Future Improvements

- Mainnet deployment with additional security measures
- Support for more token pairs and DEXs
- Advanced AI models for more sophisticated trading strategies
- Price charts and trend analysis with historical data
- Mobile application version
