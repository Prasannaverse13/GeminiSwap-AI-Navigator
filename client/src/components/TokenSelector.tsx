import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToken } from "@/hooks/use-token";

interface TokenSelectorProps {
  token: {
    symbol: string;
    name: string;
    logoUrl: string;
  };
  onTokenSelect: () => void;
  balance?: number;
  amount: string;
  onAmountChange: (value: string) => void;
  onMaxClick?: () => void;
  readOnly?: boolean;
}

export default function TokenSelector({
  token,
  onTokenSelect,
  balance,
  amount,
  onAmountChange,
  onMaxClick,
  readOnly = false
}: TokenSelectorProps) {
  const getTokenColor = (symbol: string) => {
    const colorMap: Record<string, string> = {
      RBTC: "bg-yellow-500",
      USDC: "bg-blue-500",
      RETH: "bg-gray-400",
      RUSDT: "bg-green-500",
      // Add more tokens as needed
    };
    
    return colorMap[symbol] || "bg-gray-500";
  };
  
  const getTokenLogo = (symbol: string) => {
    const logoMap: Record<string, string> = {
      RBTC: "https://assets.coingecko.com/coins/images/24437/standard/rbtc-coingecko.png",
      USDC: "https://assets.coingecko.com/coins/images/6319/standard/usdc.png",
      RETH: "https://assets.coingecko.com/coins/images/279/standard/ethereum.png",
      RUSDT: "https://assets.coingecko.com/coins/images/325/standard/Tether.png",
      // Add more tokens as needed
    };
    
    return logoMap[symbol] || "";
  };
  
  // Get token price data from the hook
  const { getUsdValue, prices } = useToken();

  return (
    <div className="bg-gray-850 rounded-lg p-3 mb-2">
      <div className="flex items-center justify-between mb-3">
        <Button 
          variant="outline" 
          onClick={onTokenSelect}
          className="bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 flex items-center gap-2 transition-colors h-auto"
        >
          <div className={cn("w-6 h-6 rounded-full flex items-center justify-center overflow-hidden", getTokenColor(token.symbol))}>
            <img src={getTokenLogo(token.symbol)} alt={token.symbol} className="w-5 h-5 object-contain" />
          </div>
          <span className="font-medium">{token.symbol}</span>
          <i className="ri-arrow-down-s-line"></i>
        </Button>
        <div className="text-sm text-gray-400">
          Balance: <span className="font-mono">{balance?.toFixed(4) || "0.0000"}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Input
          type="text"
          placeholder="0.0"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="bg-transparent text-2xl w-full outline-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
          readOnly={readOnly}
        />
        {onMaxClick && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onMaxClick}
            className="text-xs bg-primary-700 hover:bg-primary-600 px-2 py-1 rounded text-white font-medium h-auto"
          >
            MAX
          </Button>
        )}
      </div>
      <div className="flex justify-end mt-1">
        <span className="text-sm text-gray-400 font-mono">≈ ${getUsdValue(token.symbol, amount)}</span>
      </div>
    </div>
  );
}
