import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface SwapParams {
  fromToken: string;
  toToken: string;
  amount: string;
  slippageTolerance?: number;
  deadline?: number;
  gasPreference?: string;
}

interface TransactionStatus {
  isOpen: boolean;
  status: "pending" | "success" | "error" | null;
  txHash?: string;
}

export function useSwap(walletAddress: string) {
  const [isPending, setIsPending] = useState(false);
  const [approvedTokens, setApprovedTokens] = useState<Record<string, number>>({});
  const [txStatus, setTxStatus] = useState<TransactionStatus>({
    isOpen: false,
    status: null
  });
  const { toast } = useToast();
  
  // Check if a token is approved for the given amount
  const isApproved = useCallback((token: string, amount: number): boolean => {
    return approvedTokens[token] !== undefined && approvedTokens[token] >= amount;
  }, [approvedTokens]);
  
  // Approve a token for trading
  const approve = useCallback(async (token: string, amount: number) => {
    if (isPending) return;
    
    setIsPending(true);
    setTxStatus({
      isOpen: true,
      status: "pending"
    });
    
    try {
      const ethereum = (window as any).ethereum;
      
      if (!ethereum) {
        throw new Error("MetaMask not detected");
      }
      
      // In a real implementation, this would call the token's approve function
      // For demo purposes, just simulate the approval
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate blockchain delay
      
      // Generate a random tx hash
      const txHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      
      // Update approved tokens
      setApprovedTokens(prev => ({
        ...prev,
        [token]: amount
      }));
      
      setTxStatus({
        isOpen: true,
        status: "success",
        txHash
      });
      
      toast({
        title: "Token approved",
        description: `${token} has been approved for trading`,
      });
      
      return txHash;
    } catch (error) {
      console.error("Approval error:", error);
      
      setTxStatus({
        isOpen: true,
        status: "error"
      });
      
      toast({
        title: "Approval failed",
        description: "Failed to approve token for trading",
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsPending(false);
    }
  }, [isPending, toast]);
  
  // Execute a swap
  const swap = useCallback(async (params: SwapParams) => {
    if (isPending) return;
    
    setIsPending(true);
    setTxStatus({
      isOpen: true,
      status: "pending"
    });
    
    try {
      const ethereum = (window as any).ethereum;
      
      if (!ethereum) {
        throw new Error("MetaMask not detected");
      }
      
      // In a real implementation, this would call the DEX contract to execute the swap
      // This includes sending the transaction through MetaMask
      
      // For demo purposes, send a request to our backend which will forward to Gemini API
      await apiRequest("POST", "/api/swap/execute", {
        fromToken: params.fromToken,
        toToken: params.toToken,
        amount: params.amount,
        walletAddress,
        slippageTolerance: params.slippageTolerance,
        deadline: params.deadline,
        gasPreference: params.gasPreference
      });
      
      // Simulate blockchain delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate a random tx hash
      const txHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      
      // 90% chance of success (for demo purposes)
      const success = Math.random() > 0.1;
      
      if (success) {
        setTxStatus({
          isOpen: true,
          status: "success",
          txHash
        });
        
        toast({
          title: "Swap successful",
          description: `Successfully swapped ${params.amount} ${params.fromToken} to ${params.toToken}`,
        });
      } else {
        setTxStatus({
          isOpen: true,
          status: "error",
          txHash
        });
        
        toast({
          title: "Swap failed",
          description: "Transaction was rejected by the network",
          variant: "destructive",
        });
      }
      
      return txHash;
    } catch (error) {
      console.error("Swap error:", error);
      
      setTxStatus({
        isOpen: true,
        status: "error"
      });
      
      toast({
        title: "Swap failed",
        description: "Failed to execute swap transaction",
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsPending(false);
    }
  }, [isPending, walletAddress, toast]);
  
  // Reset the transaction status
  const resetSwap = useCallback(() => {
    setTxStatus({
      isOpen: false,
      status: null
    });
  }, []);

  return {
    isPending,
    txStatus,
    isApproved,
    approve,
    swap,
    resetSwap
  };
}
