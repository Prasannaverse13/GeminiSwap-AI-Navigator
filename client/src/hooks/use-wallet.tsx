import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useWallet = () => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [chainId, setChainId] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  // Detect MetaMask and set up event listeners
  useEffect(() => {
    const ethereum = (window as any).ethereum;
    
    if (ethereum) {
      // Handle account changes
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          setConnected(false);
          setAddress(undefined);
        } else if (accounts[0] !== address) {
          // Account changed
          setConnected(true);
          setAddress(accounts[0]);
        }
      };
      
      // Handle chain changes
      const handleChainChanged = (chainIdHex: string) => {
        setChainId(chainIdHex);
        
        // Check if on Rootstock testnet (chainId 31)
        if (chainIdHex !== "0x1f") { // 0x1f is hex for 31
          toast({
            title: "Wrong Network",
            description: "Please switch to Rootstock Testnet to use this app",
            variant: "destructive",
          });
        }
      };
      
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("chainChanged", handleChainChanged);
      
      // Clean up event listeners
      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
          ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, [address, toast]);

  // Connect to MetaMask
  const connect = useCallback(async () => {
    try {
      const ethereum = (window as any).ethereum;
      
      if (!ethereum) {
        toast({
          title: "Wallet not found",
          description: "Please install MetaMask or another web3 wallet to continue",
          variant: "destructive",
        });
        throw new Error("MetaMask not detected");
      }
      
      // First try to switch to Rootstock testnet
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x1f" }], // 0x1f is hex for 31
        });
      } catch (switchError: any) {
        // If network doesn't exist in wallet, add it
        if (switchError.code === 4902) {
          try {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x1f", // 31 in hex
                  chainName: "RSK Testnet",
                  nativeCurrency: {
                    name: "tRBTC",
                    symbol: "tRBTC",
                    decimals: 18,
                  },
                  rpcUrls: ["https://public-node.testnet.rsk.co"],
                  blockExplorerUrls: ["https://explorer.testnet.rsk.co"],
                },
              ],
            });
          } catch (addError) {
            console.error("Error adding chain:", addError);
            toast({
              title: "Network Error",
              description: "Could not add Rootstock Testnet to your wallet",
              variant: "destructive",
            });
            throw addError;
          }
        } else if (switchError.code !== 4001) { // 4001 is user rejected request
          // Show error message unless user just rejected the request
          console.error("Error switching chain:", switchError);
          toast({
            title: "Network Error",
            description: "Could not switch to Rootstock Testnet",
            variant: "destructive",
          });
          throw switchError;
        }
      }
      
      // Then request accounts
      try {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        
        if (accounts.length > 0) {
          setConnected(true);
          setAddress(accounts[0]);
          
          // Get current chain ID
          const chainIdHex = await ethereum.request({ method: "eth_chainId" });
          setChainId(chainIdHex);
          
          toast({
            title: "Wallet Connected",
            description: "Successfully connected to your wallet",
          });
          
          return true;
        }
      } catch (accountsError: any) {
        if (accountsError.code !== 4001) { // 4001 is user rejected request
          // Show error message unless user just rejected the request
          console.error("Error getting accounts:", accountsError);
          toast({
            title: "Connection Error",
            description: "Could not connect to your wallet",
            variant: "destructive",
          });
        }
        throw accountsError;
      }
      
      return false;
    } catch (error) {
      console.error("Connection error:", error);
      setConnected(false);
      setAddress(undefined);
      throw error;
    }
  }, [toast]);

  // Disconnect from MetaMask
  const disconnect = useCallback(() => {
    setConnected(false);
    setAddress(undefined);
  }, []);

  return {
    connected,
    address,
    chainId,
    connect,
    disconnect,
  };
}
