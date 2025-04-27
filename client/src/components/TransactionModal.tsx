import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink } from "lucide-react";

interface TransactionModalProps {
  isOpen: boolean;
  status: "pending" | "success" | "error" | null;
  txHash?: string;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  onClose: () => void;
  onRetry?: () => void;
}

export default function TransactionModal({
  isOpen,
  status,
  txHash,
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  onClose,
  onRetry
}: TransactionModalProps) {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<number | null>(null);
  
  const openExplorer = () => {
    if (txHash) {
      window.open(`https://explorer.testnet.rsk.co/tx/${txHash}`, "_blank");
    }
  };
  
  const handleFeedback = (rating: number) => {
    setFeedback(rating);
    toast({
      title: "Thank you for your feedback!",
      description: "Your feedback helps us improve the AI recommendations",
    });
  };
  
  const getFeedbackIcon = (rating: number) => {
    switch (rating) {
      case 1: return "ri-emotion-unhappy-line";
      case 2: return "ri-emotion-normal-line";
      case 3: return "ri-emotion-happy-line";
      case 4: return "ri-emotion-laugh-line";
      default: return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction Status</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 text-center">
          {/* Loading state */}
          {status === "pending" && (
            <div className="mb-4">
              <div className="w-20 h-20 relative mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
              </div>
              <h4 className="text-xl font-medium mb-2">Transaction Pending</h4>
              <p className="text-gray-400">Your swap transaction is being processed on the Rootstock network.</p>
              
              <div className="mt-6 bg-gray-850 rounded-lg p-4 text-left">
                {txHash && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Transaction Hash:</span>
                    <button 
                      onClick={openExplorer}
                      className="text-primary-400 font-mono hover:underline flex items-center gap-1"
                    >
                      {`${txHash.substring(0, 6)}...${txHash.substring(txHash.length - 4)}`}
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated Time:</span>
                  <span>~30 seconds</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Success state */}
          {status === "success" && (
            <div className="mb-4">
              <div className="w-20 h-20 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                <i className="ri-check-line text-4xl text-green-500"></i>
              </div>
              <h4 className="text-xl font-medium mb-2">Transaction Successful</h4>
              <p className="text-gray-400 mb-4">Your swap has been completed successfully!</p>
              
              <div className="bg-gray-850 rounded-lg p-4 text-left mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Swapped:</span>
                  <span className="font-medium">{fromAmount} {fromToken} → {toAmount} {toToken}</span>
                </div>
                {txHash && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Transaction Hash:</span>
                    <button 
                      onClick={openExplorer}
                      className="text-primary-400 font-mono hover:underline flex items-center gap-1"
                    >
                      {`${txHash.substring(0, 6)}...${txHash.substring(txHash.length - 4)}`}
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Gas Fee:</span>
                  <span className="font-mono">0.0001 RBTC</span>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium mb-2">How was your experience?</h5>
                <div className="flex items-center justify-center gap-2 mb-4">
                  {[1, 2, 3, 4].map((rating) => (
                    <button 
                      key={rating}
                      className={`p-2 text-2xl ${feedback === rating ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}
                      onClick={() => handleFeedback(rating)}
                    >
                      <i className={getFeedbackIcon(rating)}></i>
                    </button>
                  ))}
                </div>
                <button className="text-primary-400 hover:text-primary-300">
                  Share feedback...
                </button>
              </div>
            </div>
          )}
          
          {/* Error state */}
          {status === "error" && (
            <div className="mb-4">
              <div className="w-20 h-20 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                <i className="ri-close-line text-4xl text-red-500"></i>
              </div>
              <h4 className="text-xl font-medium mb-2">Transaction Failed</h4>
              <p className="text-gray-400 mb-4">There was an error processing your transaction.</p>
              
              <div className="bg-gray-850 rounded-lg p-4 text-left mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Error:</span>
                  <span className="text-red-500">Insufficient gas</span>
                </div>
                {txHash && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Transaction Hash:</span>
                    <button 
                      onClick={openExplorer}
                      className="text-primary-400 font-mono hover:underline flex items-center gap-1"
                    >
                      {`${txHash.substring(0, 6)}...${txHash.substring(txHash.length - 4)}`}
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                {onRetry && (
                  <Button 
                    className="flex-1" 
                    onClick={onRetry}
                  >
                    Retry
                  </Button>
                )}
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
