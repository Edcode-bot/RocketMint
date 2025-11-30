import { useState, useEffect } from "react";
import { Wallet, ExternalLink, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useGameStore } from "@/lib/gameStore";
import { 
  connectWallet, 
  isMiniPay, 
  isWalletAvailable, 
  shortenAddress,
  getcUSDBalance,
  switchToAlfajores,
  CELO_ALFAJORES_CONFIG,
} from "@/lib/wallet";

export function WalletConnect() {
  const { wallet, setWallet } = useGameStore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cUSDBalance, setcUSDBalance] = useState("0");
  const { toast } = useToast();

  useEffect(() => {
    if (isMiniPay()) {
      handleConnect();
    }
  }, []);

  useEffect(() => {
    if (wallet.address) {
      getcUSDBalance(wallet.address).then(setcUSDBalance);
    }
  }, [wallet.address]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await switchToAlfajores();
      const walletState = await connectWallet();
      setWallet(walletState);
      
      if (walletState.address) {
        const balance = await getcUSDBalance(walletState.address);
        setcUSDBalance(balance);
      }
      
      toast({
        title: "Wallet Connected",
        description: walletState.isMiniPay 
          ? "Connected with MiniPay!" 
          : `Connected: ${shortenAddress(walletState.address || "")}`,
      });
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCopyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isWalletAvailable()) {
    return (
      <Card className="border-white/10 bg-gradient-to-b from-space-purple/30 to-space-dark/50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
              <Wallet className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">No Wallet Detected</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Please install MiniPay or a compatible wallet to play RocketMint.
              </p>
            </div>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => window.open("https://www.opera.com/products/minipay", "_blank")}
              data-testid="button-get-minipay"
            >
              Get MiniPay
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!wallet.isConnected) {
    return (
      <Card className="border-white/10 bg-gradient-to-b from-space-purple/30 to-space-dark/50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-celo-green/20 flex items-center justify-center">
              <Wallet className="w-8 h-8 text-celo-green" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Connect Your Wallet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {isMiniPay() 
                  ? "Connecting to MiniPay..." 
                  : "Connect your wallet to start playing RocketMint."}
              </p>
            </div>
            <Button 
              onClick={handleConnect}
              disabled={isConnecting}
              className="gap-2 bg-celo-gradient hover:brightness-110"
              data-testid="button-connect-wallet"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-white/10 bg-gradient-to-b from-space-purple/30 to-space-dark/50">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-celo-green/20 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-celo-green" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">
                    {shortenAddress(wallet.address || "")}
                  </span>
                  <button
                    onClick={handleCopyAddress}
                    className="p-1 rounded hover:bg-white/10 transition-colors"
                    data-testid="button-copy-address"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-celo-green" />
                    ) : (
                      <Copy className="w-3 h-3 text-muted-foreground" />
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {wallet.isMiniPay && (
                    <Badge variant="secondary" className="text-xs bg-celo-green/20 text-celo-green border-celo-green/30">
                      MiniPay
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    Alfajores
                  </Badge>
                </div>
              </div>
            </div>
            <div className="w-3 h-3 rounded-full bg-celo-green animate-pulse" />
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
            <div className="text-center p-3 rounded-lg bg-white/5">
              <p className="text-xs text-muted-foreground mb-1">cUSD Balance</p>
              <p className="font-display font-bold text-lg text-celo-green" data-testid="text-cusd-balance">
                ${parseFloat(cUSDBalance).toFixed(2)}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/5">
              <p className="text-xs text-muted-foreground mb-1">Network</p>
              <p className="font-medium text-sm">
                {wallet.chainId === CELO_ALFAJORES_CONFIG.chainId ? "Alfajores" : "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function WalletStatus() {
  const { wallet } = useGameStore();

  if (!wallet.isConnected) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10">
      <div className="w-2 h-2 rounded-full bg-celo-green animate-pulse" />
      <span className="font-mono text-xs text-muted-foreground">
        {shortenAddress(wallet.address || "")}
      </span>
      {wallet.isMiniPay && (
        <Badge variant="secondary" className="text-xs h-5 bg-celo-green/20 text-celo-green border-none">
          MiniPay
        </Badge>
      )}
    </div>
  );
}
