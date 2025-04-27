import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ConnectPrompt from "@/components/ConnectPrompt";
import SwapInterface from "@/components/SwapInterface";
import Footer from "@/components/Footer";
import { useWallet } from "@/hooks/use-wallet";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { connected, connect, disconnect, address } = useWallet();
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if wallet was previously connected and try to reconnect
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const ethereum = (window as any).ethereum;
        if (ethereum && ethereum.isMetaMask) {
          const accounts = await ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            await connect();
          }
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      } finally {
        setIsInitialized(true);
      }
    };
    
    checkConnection();
  }, []);

  const handleConnect = async () => {
    try {
      const ethereum = (window as any).ethereum;
      if (!ethereum || !ethereum.isMetaMask) {
        toast({
          title: "MetaMask not detected",
          description: "Please install MetaMask to use this app",
          variant: "destructive",
          action: (
            <ToastAction altText="Install" onClick={() => window.open("https://metamask.io/download/", "_blank")}>
              Install
            </ToastAction>
          ),
        });
        return;
      }
      
      await connect();
      toast({
        title: "Wallet connected",
        description: "Your MetaMask wallet has been connected successfully",
      });
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection failed",
        description: "Failed to connect to MetaMask. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  if (!isInitialized) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="w-20 h-20 relative">
            <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header 
        connected={connected} 
        address={address} 
        onConnect={handleConnect} 
        onDisconnect={handleDisconnect} 
      />
      
      <main className="flex-grow container mx-auto px-4 py-6 md:py-10 max-w-7xl">
        {connected ? (
          <SwapInterface address={address} />
        ) : (
          <ConnectPrompt onConnect={handleConnect} />
        )}
      </main>
      
      <Footer />
    </div>
  );
}
