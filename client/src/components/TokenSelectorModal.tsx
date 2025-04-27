import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToken } from "@/hooks/use-token";

interface Token {
  symbol: string;
  name: string;
  logoUrl: string;
}

interface TokenSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: Token[];
  balances: Record<string, number>;
  onSelect: (token: Token) => void;
}

export default function TokenSelectorModal({
  isOpen,
  onClose,
  tokens,
  balances,
  onSelect
}: TokenSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredTokens = tokens.filter(token => 
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
    token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
      RBTC: "https://assets.coingecko.com/coins/images/24437/standard/rbtc-coingecko.png",
      USDC: "https://assets.coingecko.com/coins/images/6319/standard/usdc.png",
      RETH: "https://assets.coingecko.com/coins/images/279/standard/ethereum.png", 
      RUSDT: "https://assets.coingecko.com/coins/images/325/standard/Tether.png",
    };
    return logoMap[symbol] || "";
  };
  
  // Get token price data from the hook
  const { getUsdValue, prices } = useToken();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select a token</DialogTitle>
        </DialogHeader>
        
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by name or address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-700 rounded-lg px-4 py-3 pl-10"
            />
            <i className="ri-search-line absolute left-3 top-3.5 text-gray-400"></i>
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-[300px] p-2">
          <div className="mb-2 px-2">
            <h4 className="text-sm text-gray-400">Common tokens</h4>
          </div>
          
          {filteredTokens.map((token) => (
            <button
              key={token.symbol}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg transition-colors"
              onClick={() => onSelect(token)}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${getTokenColor(token.symbol)}`}>
                <img src={getTokenLogo(token.symbol)} alt={token.symbol} className="w-6 h-6 object-contain" />
              </div>
              <div className="flex-grow text-left">
                <div className="font-medium">{token.symbol}</div>
                <div className="text-sm text-gray-400">{token.name}</div>
              </div>
              <div className="text-right">
                <div className="font-mono">{balances[token.symbol]?.toFixed(4) || "0.0000"}</div>
                <div className="text-sm text-gray-400 font-mono">${getUsdValue(token.symbol, balances[token.symbol] || 0)}</div>
              </div>
            </button>
          ))}
          
          {filteredTokens.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No tokens found matching "{searchQuery}"
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
