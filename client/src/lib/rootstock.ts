import { DEFAULT_TOKENS } from "./constants";

// Convert token symbol to address
export function getTokenAddress(symbol: string): string {
  const token = DEFAULT_TOKENS.find(t => t.symbol === symbol);
  return token ? token.address : "";
}

// Rootstock Testnet configurations
export const ROOTSTOCK_TESTNET = {
  chainId: 31,
  chainIdHex: "0x1f", // 31 in hex
  chainName: "RSK Testnet",
  nativeCurrency: {
    name: "tRBTC",
    symbol: "tRBTC",
    decimals: 18,
  },
  rpcUrls: ["https://public-node.testnet.rsk.co"],
  blockExplorerUrls: ["https://explorer.testnet.rsk.co"],
};

// Helper function to add the Rootstock network to MetaMask
export async function addRootstockNetwork(): Promise<boolean> {
  const ethereum = (window as any).ethereum;
  
  if (!ethereum) {
    throw new Error("MetaMask not detected");
  }
  
  try {
    await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: ROOTSTOCK_TESTNET.chainIdHex,
          chainName: ROOTSTOCK_TESTNET.chainName,
          nativeCurrency: ROOTSTOCK_TESTNET.nativeCurrency,
          rpcUrls: ROOTSTOCK_TESTNET.rpcUrls,
          blockExplorerUrls: ROOTSTOCK_TESTNET.blockExplorerUrls,
        },
      ],
    });
    return true;
  } catch (error) {
    console.error("Error adding Rootstock network to MetaMask:", error);
    return false;
  }
}

// Helper function to switch to Rootstock network
export async function switchToRootstockNetwork(): Promise<boolean> {
  const ethereum = (window as any).ethereum;
  
  if (!ethereum) {
    throw new Error("MetaMask not detected");
  }
  
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ROOTSTOCK_TESTNET.chainIdHex }],
    });
    return true;
  } catch (error: any) {
    // If the error code is 4902, the chain hasn't been added to MetaMask
    if (error.code === 4902) {
      return addRootstockNetwork();
    }
    console.error("Error switching to Rootstock network:", error);
    return false;
  }
}

// Helper function to format explorer URL
export function getExplorerUrl(type: "address" | "tx", hash: string): string {
  return `${ROOTSTOCK_TESTNET.blockExplorerUrls[0]}/${type}/${hash}`;
}
