// Default list of tokens on Rootstock testnet
export const DEFAULT_TOKENS = [
  {
    symbol: "RBTC",
    name: "Rootstock BTC",
    address: "0x0000000000000000000000000000000000000000", // Native token
    decimals: 18,
    logoUrl: "https://assets.coingecko.com/coins/images/24437/standard/rbtc-coingecko.png",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x4D5aB76E731b00E5896189E34BF7b7BFed15Ba97", // Example testnet address
    decimals: 6,
    logoUrl: "https://assets.coingecko.com/coins/images/6319/standard/usdc.png",
  },
  {
    symbol: "RETH",
    name: "Rootstock ETH",
    address: "0x5D5aB76E731b00E5896189E34BF7b7BFed15Ba98", // Example testnet address
    decimals: 18,
    logoUrl: "https://assets.coingecko.com/coins/images/279/standard/ethereum.png",
  },
  {
    symbol: "RUSDT",
    name: "Rootstock Tether",
    address: "0x6D5aB76E731b00E5896189E34BF7b7BFed15Ba99", // Example testnet address
    decimals: 6,
    logoUrl: "https://assets.coingecko.com/coins/images/325/standard/Tether.png",
  },
];

// DEX providers on Rootstock
export const DEX_PROVIDERS = [
  {
    id: "rocketswap",
    name: "RocketSwap",
    routerAddress: "0x7D5aB76E731b00E5896189E34BF7b7BFed15Ba91", // Example address
  },
  {
    id: "rskswap",
    name: "RSK Swap",
    routerAddress: "0x8D5aB76E731b00E5896189E34BF7b7BFed15Ba92", // Example address
  },
  {
    id: "multihop",
    name: "MultiHop",
    routerAddress: "0x9D5aB76E731b00E5896189E34BF7b7BFed15Ba93", // Example address
  },
];

// Risk profiles
export const RISK_PROFILES = [
  {
    id: "conservative",
    name: "Conservative",
    maxSlippage: 0.5,
  },
  {
    id: "balanced",
    name: "Balanced",
    maxSlippage: 1.0,
  },
  {
    id: "aggressive",
    name: "Aggressive",
    maxSlippage: 2.0,
  },
];

// Gas preferences
export const GAS_PREFERENCES = [
  {
    id: "auto",
    name: "Auto",
    multiplier: 1.0,
    gwei: 25,
  },
  {
    id: "fast",
    name: "Fast",
    multiplier: 1.2,
    gwei: 30,
  },
  {
    id: "instant",
    name: "Instant",
    multiplier: 1.4,
    gwei: 35,
  },
];
