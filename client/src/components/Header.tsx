import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, ExternalLink, LogOut, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  connected: boolean;
  address?: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export default function Header({ connected, address, onConnect, onDisconnect }: HeaderProps) {
  const { toast } = useToast();
  
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const openExplorer = () => {
    if (address) {
      window.open(`https://explorer.testnet.rsk.co/address/${address}`, "_blank");
    }
  };

  // Format address for display (0x1234...5678)
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <header className="border-b border-gray-800 bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-9 h-9 flex items-center justify-center bg-gradient-to-r from-primary to-blue-600 rounded-lg">
            <i className="ri-swap-line text-xl text-white"></i>
          </div>
          <h1 className="text-xl font-semibold text-white">
            GeminiSwap <span className="text-primary-400">AI Navigator</span>
          </h1>
        </div>
        
        <div className="relative">
          {!connected ? (
            <Button variant="default" onClick={onConnect} className="gap-2">
              <Wallet className="h-4 w-4" />
              <span>Connect Wallet</span>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="font-mono text-sm truncate max-w-[120px]">
                    {address ? formatAddress(address) : ""}
                  </span>
                  <i className="ri-arrow-down-s-line"></i>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <div className="p-4 border-b border-border">
                  <p className="text-muted-foreground text-xs mb-1">Connected with MetaMask</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <p className="font-mono text-sm truncate">{address}</p>
                  </div>
                </div>
                <DropdownMenuItem onClick={copyAddress} className="gap-2 cursor-pointer">
                  <Copy className="h-4 w-4" />
                  <span>Copy Address</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openExplorer} className="gap-2 cursor-pointer">
                  <ExternalLink className="h-4 w-4" />
                  <span>View on Explorer</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDisconnect} className="gap-2 text-destructive cursor-pointer">
                  <LogOut className="h-4 w-4" />
                  <span>Disconnect</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
