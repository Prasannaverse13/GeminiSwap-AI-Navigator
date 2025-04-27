import { useState, useEffect } from "react";
import TokenSelector from "@/components/TokenSelector";
import AIInsightsPanel from "@/components/AIInsightsPanel";
import TokenSelectorModal from "@/components/TokenSelectorModal";
import SettingsModal from "@/components/SettingsModal";
import TransactionModal from "@/components/TransactionModal";
import { Button } from "@/components/ui/button";
import { useToken } from "@/hooks/use-token";
import { useSwap } from "@/hooks/use-swap";
import { ArrowUpDown, RefreshCw, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_TOKENS } from "@/lib/constants";

interface SwapInterfaceProps {
  address: string;
}

export default function SwapInterface({ address }: SwapInterfaceProps) {
  const { toast } = useToast();
  const { tokens, balances, getBalance, fetchBalances } = useToken(address);
  const { swap, approve, isApproved, isPending, txStatus, resetSwap } = useSwap(address);
  
  const [fromToken, setFromToken] = useState(DEFAULT_TOKENS[0]);
  const [toToken, setToToken] = useState(DEFAULT_TOKENS[1]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
  const [selectingTokenFor, setSelectingTokenFor] = useState<"from" | "to">("from");
  const [slippageTolerance, setSlippageTolerance] = useState(0.5);
  const [deadline, setDeadline] = useState(30);
  const [gasPreference, setGasPreference] = useState("auto");
  const [riskProfile, setRiskProfile] = useState("balanced");
  const [preferredDexs, setPreferredDexs] = useState(["RocketSwap", "RSK Swap", "MultiHop"]);
  
  // Calculate the estimated output based on the input
  useEffect(() => {
    if (fromAmount && fromToken && toToken) {
      // In a real implementation, this would call an API or smart contract to get the price
      // For now, using a simplified calculation
      if (fromToken.symbol === "RBTC") {
        setToAmount((parseFloat(fromAmount) * 27627).toFixed(2));
      } else if (toToken.symbol === "RBTC") {
        setToAmount((parseFloat(fromAmount) / 27627).toFixed(8));
      } else {
        // Default conversion ratio
        setToAmount((parseFloat(fromAmount) * 1.05).toFixed(2));
      }
    } else {
      setToAmount("");
    }
  }, [fromAmount, fromToken, toToken]);
  
  // Fetch balances for tokens
  useEffect(() => {
    if (address) {
      fetchBalances();
    }
  }, [address, fetchBalances]);
  
  const handleFromTokenSelect = (token: any) => {
    if (token.symbol === toToken.symbol) {
      setToToken(fromToken);
    }
    setFromToken(token);
    setIsTokenSelectorOpen(false);
  };
  
  const handleToTokenSelect = (token: any) => {
    if (token.symbol === fromToken.symbol) {
      setFromToken(toToken);
    }
    setToToken(token);
    setIsTokenSelectorOpen(false);
  };
  
  const openTokenSelector = (type: "from" | "to") => {
    setSelectingTokenFor(type);
    setIsTokenSelectorOpen(true);
  };
  
  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };
  
  const refreshRates = () => {
    if (fromAmount && fromToken && toToken) {
      // Re-fetch rates
      toast({
        title: "Refreshing rates",
        description: "Getting the latest exchange rates",
      });
      
      // Simulate a delay
      setTimeout(() => {
        // Update the toAmount with a slight variation to simulate a rate change
        const variation = 0.995 + Math.random() * 0.01;
        setToAmount((parseFloat(toAmount) * variation).toFixed(2));
        
        toast({
          title: "Rates updated",
          description: "Exchange rates have been refreshed",
        });
      }, 1000);
    }
  };
  
  const handleFromAmountChange = (value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFromAmount(value);
    }
  };
  
  const handleMaxClick = () => {
    const balance = getBalance(fromToken.symbol);
    if (balance) {
      setFromAmount(balance.toString());
    }
  };
  
  const handleSwap = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to swap",
        variant: "destructive",
      });
      return;
    }
    
    const fromBalance = getBalance(fromToken.symbol);
    if (!fromBalance || parseFloat(fromAmount) > fromBalance) {
      toast({
        title: "Insufficient balance",
        description: `You don't have enough ${fromToken.symbol}`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (!isApproved(fromToken.symbol, parseFloat(fromAmount))) {
        await approve(fromToken.symbol, parseFloat(fromAmount));
      } else {
        await swap({
          fromToken: fromToken.symbol,
          toToken: toToken.symbol,
          amount: fromAmount,
          slippageTolerance,
          deadline,
          gasPreference,
        });
      }
    } catch (error) {
      console.error("Swap error:", error);
      toast({
        title: "Swap failed",
        description: "There was an error processing your swap",
        variant: "destructive",
      });
    }
  };
  
  const handleSaveSettings = (settings: any) => {
    setSlippageTolerance(settings.slippageTolerance);
    setDeadline(settings.deadline);
    setGasPreference(settings.gasPreference);
    setRiskProfile(settings.riskProfile);
    setPreferredDexs(settings.preferredDexs);
    setIsSettingsOpen(false);
    
    toast({
      title: "Settings saved",
      description: "Your swap settings have been updated",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
          {/* Swap header */}
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Swap</h2>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={refreshRates}
                className="text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsSettingsOpen(true)}
                className="text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Swap form */}
          <div className="p-4">
            {/* From token */}
            <div className="mb-1">
              <label className="text-sm text-gray-400 mb-1 block">Swap from</label>
            </div>
            <TokenSelector 
              token={fromToken}
              onTokenSelect={() => openTokenSelector("from")}
              balance={getBalance(fromToken.symbol)}
              amount={fromAmount}
              onAmountChange={handleFromAmountChange}
              onMaxClick={handleMaxClick}
              readOnly={false}
            />
            
            {/* Swap button */}
            <div className="flex justify-center -my-2 relative z-10">
              <Button 
                variant="outline" 
                size="icon"
                onClick={switchTokens}
                className="bg-gray-700 hover:bg-gray-600 w-10 h-10 rounded-full transition-transform hover:rotate-180 text-gray-300"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
            
            {/* To token */}
            <div className="mb-1 mt-1">
              <label className="text-sm text-gray-400 mb-1 block">Swap to</label>
            </div>
            <TokenSelector 
              token={toToken}
              onTokenSelect={() => openTokenSelector("to")}
              balance={getBalance(toToken.symbol)}
              amount={toAmount}
              onAmountChange={() => {}}
              readOnly={true}
            />
            
            {/* Swap details */}
            <div className="bg-gray-850 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Rate</span>
                <span className="text-sm font-mono">
                  1 {fromToken.symbol} = {fromToken.symbol === "RBTC" ? "27,627" : (1 / 27627).toFixed(8)} {toToken.symbol}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Price Impact</span>
                <span className="text-sm text-green-500 font-medium">0.05%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Network Fee</span>
                <span className="text-sm font-mono">≈ 0.0001 RBTC</span>
              </div>
            </div>
            
            {/* Action button based on the current state */}
            {!isApproved(fromToken.symbol, parseFloat(fromAmount)) ? (
              <Button 
                className="w-full" 
                disabled={isPending}
                onClick={handleSwap}
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Approving...
                  </>
                ) : (
                  `Approve ${fromToken.symbol}`
                )}
              </Button>
            ) : (
              <Button 
                className="w-full" 
                disabled={isPending}
                onClick={handleSwap}
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Swapping...
                  </>
                ) : (
                  "Swap"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* AI Insights panel */}
      <AIInsightsPanel 
        fromToken={fromToken}
        toToken={toToken}
        fromAmount={fromAmount}
        slippageTolerance={slippageTolerance}
        deadline={deadline}
        gasPreference={gasPreference}
        riskProfile={riskProfile}
        preferredDexs={preferredDexs}
        onRouteSelect={(route) => {
          // In a real implementation, this would select the route for execution
          toast({
            title: "Route selected",
            description: `Using ${route.provider} for your swap`,
          });
        }}
      />
      
      {/* Modals */}
      <TokenSelectorModal 
        isOpen={isTokenSelectorOpen}
        onClose={() => setIsTokenSelectorOpen(false)}
        tokens={tokens}
        balances={balances}
        onSelect={selectingTokenFor === "from" ? handleFromTokenSelect : handleToTokenSelect}
      />
      
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={{
          slippageTolerance,
          deadline,
          gasPreference,
          riskProfile,
          preferredDexs,
        }}
        onSave={handleSaveSettings}
      />
      
      <TransactionModal 
        isOpen={txStatus.isOpen}
        status={txStatus.status}
        txHash={txStatus.txHash}
        fromToken={fromToken.symbol}
        toToken={toToken.symbol}
        fromAmount={fromAmount}
        toAmount={toAmount}
        onClose={resetSwap}
        onRetry={handleSwap}
      />
    </div>
  );
}
