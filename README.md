# GeminiSwap AI Navigator

GeminiSwap AI Navigator is an intelligent DeFi contract assistant that helps users navigate cryptocurrency swaps on the Rootstock blockchain testnet. The application leverages Google's Gemini AI API to provide intelligent insights, risk assessments, and recommendations for optimizing decentralized finance transactions.

![GeminiSwap Screenshot](https://assets.coingecko.com/coins/images/24437/standard/rbtc-coingecko.png)

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

#### 📝 Generate a Smart Contract in Solidity  

**Prompt:**  
"Write a Solidity smart contract for a token with a fixed supply of 1 million tokens and basic transfer functionality."  

**Expected Output:**  
A Solidity smart contract with the specified requirements.

**AI Model Used:** GPT-4  

**Use Case:**  
Generated boilerplate code for a blockchain project.

**Best Practices / Insights:**  
Specifying "best practices" in the prompt helped reduce errors in AI-generated code.

**Example Output:**  
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Basic Fixed Supply Token
 * @dev ERC20-like token with a fixed supply of 1 million tokens
 */
contract FixedSupplyToken {
    string public name = "Rootstock Demo Token";
    string public symbol = "RSDEMO";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1_000_000 * 10**18; // 1 million tokens with 18 decimals
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    /**
     * @dev Constructor that gives the msg.sender all existing tokens.
     */
    constructor() {
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }
    
    /**
     * @dev Transfer tokens from the sender to a recipient
     * @param recipient The address receiving the tokens
     * @param amount The amount of tokens to transfer
     * @return success Whether the transfer was successful
     */
    function transfer(address recipient, uint256 amount) public returns (bool success) {
        require(recipient != address(0), "Transfer to zero address");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }
    
    /**
     * @dev Approve spender to spend tokens on behalf of the owner
     * @param spender The address authorized to spend
     * @param amount The amount authorized to spend
     * @return success Whether the approval was successful
     */
    function approve(address spender, uint256 amount) public returns (bool success) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    /**
     * @dev Transfer tokens from one address to another 
     * @param sender The address sending the tokens
     * @param recipient The address receiving the tokens
     * @param amount The amount of tokens to transfer
     * @return success Whether the transfer was successful
     */
    function transferFrom(address sender, address recipient, uint256 amount) public returns (bool success) {
        require(sender != address(0), "Transfer from zero address");
        require(recipient != address(0), "Transfer to zero address");
        require(balanceOf[sender] >= amount, "Insufficient balance");
        require(allowance[sender][msg.sender] >= amount, "Insufficient allowance");
        
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        allowance[sender][msg.sender] -= amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }
}
```

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

Example prompt structure:
```
Given a swap from {fromToken} to {toToken} with amount {amount} and slippage tolerance {slippage}%:
1. Analyze current market conditions for this pair
2. Recommend the best swap route considering gas fees and price impact
3. Identify any risks or opportunities in this transaction
4. Compare at least 3 alternative routes across different DEXs
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

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Rootstock team for their testnet infrastructure
- Google for the Gemini AI API
- The DeFi community for inspiration and support