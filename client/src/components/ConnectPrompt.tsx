import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface ConnectPromptProps {
  onConnect: () => void;
}

export default function ConnectPrompt({ onConnect }: ConnectPromptProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto text-center">
      <div className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-primary/30 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=400&h=300" 
          alt="Cryptocurrency trading" 
          className="w-full h-full object-cover"
        />
      </div>
      <h2 className="text-2xl font-semibold mb-3">Welcome to GeminiSwap AI Navigator</h2>
      <p className="text-gray-400 mb-6">Connect your MetaMask wallet to start trading with AI-powered insights on Rootstock network.</p>
      <Button 
        size="lg" 
        onClick={onConnect}
        className="gap-2 mx-auto"
      >
        <Wallet className="w-5 h-5" />
        <span>Connect Wallet</span>
      </Button>
    </div>
  );
}
