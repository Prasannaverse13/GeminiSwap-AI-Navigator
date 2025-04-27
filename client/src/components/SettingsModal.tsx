import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    slippageTolerance: number;
    deadline: number;
    gasPreference: string;
    riskProfile: string;
    preferredDexs: string[];
  };
  onSave: (settings: any) => void;
}

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  settings, 
  onSave 
}: SettingsModalProps) {
  const [slippageTolerance, setSlippageTolerance] = useState(settings.slippageTolerance);
  const [customSlippage, setCustomSlippage] = useState("");
  const [deadline, setDeadline] = useState(settings.deadline);
  const [gasPreference, setGasPreference] = useState(settings.gasPreference);
  const [riskProfile, setRiskProfile] = useState(settings.riskProfile);
  const [preferredDexs, setPreferredDexs] = useState(settings.preferredDexs);
  
  const handleSlippagePresetClick = (value: number) => {
    setSlippageTolerance(value);
    setCustomSlippage("");
  };
  
  const handleCustomSlippageChange = (value: string) => {
    if (value === "" || (/^\d*\.?\d*$/.test(value) && parseFloat(value) <= 50)) {
      setCustomSlippage(value);
      if (value !== "") {
        setSlippageTolerance(parseFloat(value));
      }
    }
  };
  
  const handleDexToggle = (dex: string) => {
    if (preferredDexs.includes(dex)) {
      setPreferredDexs(preferredDexs.filter(d => d !== dex));
    } else {
      setPreferredDexs([...preferredDexs, dex]);
    }
  };
  
  const handleSave = () => {
    onSave({
      slippageTolerance,
      deadline,
      gasPreference,
      riskProfile,
      preferredDexs
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div>
            <Label className="text-sm text-gray-400 mb-2 block">Slippage Tolerance</Label>
            <div className="flex items-center gap-2">
              <Button 
                variant={slippageTolerance === 0.1 && !customSlippage ? "default" : "secondary"}
                size="sm"
                onClick={() => handleSlippagePresetClick(0.1)}
                className={slippageTolerance === 0.1 && !customSlippage ? "" : "bg-gray-700 hover:bg-gray-600"}
              >
                0.1%
              </Button>
              <Button 
                variant={slippageTolerance === 0.5 && !customSlippage ? "default" : "secondary"}
                size="sm"
                onClick={() => handleSlippagePresetClick(0.5)}
                className={slippageTolerance === 0.5 && !customSlippage ? "" : "bg-gray-700 hover:bg-gray-600"}
              >
                0.5%
              </Button>
              <Button 
                variant={slippageTolerance === 1.0 && !customSlippage ? "default" : "secondary"}
                size="sm"
                onClick={() => handleSlippagePresetClick(1.0)}
                className={slippageTolerance === 1.0 && !customSlippage ? "" : "bg-gray-700 hover:bg-gray-600"}
              >
                1.0%
              </Button>
              <div className="relative flex-grow">
                <Input 
                  type="text" 
                  placeholder="Custom" 
                  value={customSlippage}
                  onChange={(e) => handleCustomSlippageChange(e.target.value)}
                  className="w-full bg-gray-700 rounded-lg pr-8"
                />
                <div className="absolute right-3 top-2.5 text-gray-400">%</div>
              </div>
            </div>
          </div>
          
          <div>
            <Label className="text-sm text-gray-400 mb-2 block">Transaction Deadline</Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <Input 
                  type="number" 
                  value={deadline}
                  onChange={(e) => setDeadline(parseInt(e.target.value) || 30)}
                  min={1}
                  max={60}
                  className="w-full bg-gray-700 rounded-lg"
                />
              </div>
              <div className="text-gray-400">minutes</div>
            </div>
          </div>
          
          <div>
            <Label className="text-sm text-gray-400 mb-2 block">Gas Price (GWEI)</Label>
            <RadioGroup value={gasPreference} onValueChange={setGasPreference}>
              <div className="flex items-center justify-between space-y-1">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="auto" id="gasAuto" className="text-primary" />
                  <Label htmlFor="gasAuto" className="text-sm">Auto</Label>
                </div>
                <div className="text-sm text-gray-400">~25 GWEI</div>
              </div>
              <div className="flex items-center justify-between space-y-1">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="fast" id="gasFast" className="text-primary" />
                  <Label htmlFor="gasFast" className="text-sm">Fast</Label>
                </div>
                <div className="text-sm text-gray-400">~30 GWEI</div>
              </div>
              <div className="flex items-center justify-between space-y-1">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="instant" id="gasInstant" className="text-primary" />
                  <Label htmlFor="gasInstant" className="text-sm">Instant</Label>
                </div>
                <div className="text-sm text-gray-400">~35 GWEI</div>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label className="text-sm text-gray-400 mb-2 block">AI Risk Profile</Label>
            <div className="flex items-center gap-2">
              <Button 
                variant={riskProfile === "conservative" ? "default" : "secondary"}
                size="sm"
                onClick={() => setRiskProfile("conservative")}
                className={riskProfile === "conservative" ? "" : "bg-gray-700 hover:bg-gray-600"}
              >
                Conservative
              </Button>
              <Button 
                variant={riskProfile === "balanced" ? "default" : "secondary"}
                size="sm"
                onClick={() => setRiskProfile("balanced")}
                className={riskProfile === "balanced" ? "" : "bg-gray-700 hover:bg-gray-600"}
              >
                Balanced
              </Button>
              <Button 
                variant={riskProfile === "aggressive" ? "default" : "secondary"}
                size="sm"
                onClick={() => setRiskProfile("aggressive")}
                className={riskProfile === "aggressive" ? "" : "bg-gray-700 hover:bg-gray-600"}
              >
                Aggressive
              </Button>
            </div>
          </div>
          
          <div>
            <Label className="text-sm text-gray-400 mb-2 block">Preferred DEXs</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="dex1" 
                  checked={preferredDexs.includes("RocketSwap")}
                  onCheckedChange={() => handleDexToggle("RocketSwap")}
                />
                <label
                  htmlFor="dex1"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  RocketSwap
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="dex2" 
                  checked={preferredDexs.includes("RSK Swap")}
                  onCheckedChange={() => handleDexToggle("RSK Swap")}
                />
                <label
                  htmlFor="dex2"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  RSK Swap
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="dex3" 
                  checked={preferredDexs.includes("MultiHop")}
                  onCheckedChange={() => handleDexToggle("MultiHop")}
                />
                <label
                  htmlFor="dex3"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  MultiHop
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={handleSave}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
