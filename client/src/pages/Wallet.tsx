import { useState, useEffect } from "react";
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCcw, 
  Copy, 
  Check,
  ExternalLink,
  Coins,
  Droplets,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StarField } from "@/components/game/StarField";
import { WalletConnect } from "@/components/game/WalletConnect";
import { useGameStore } from "@/lib/gameStore";
import { shortenAddress, getcUSDBalance, getBalance, CELO_ALFAJORES_CONFIG } from "@/lib/wallet";
import { cn } from "@/lib/utils";

export default function Wallet() {
  const { wallet } = useGameStore();
  const [celoBalance, setCeloBalance] = useState<string>("0");
  const [cUSDBalance, setcUSDBalance] = useState<string>("0");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (wallet.address) {
      refreshBalances();
    }
  }, [wallet.address]);

  const refreshBalances = async () => {
    if (!wallet.address) return;
    
    setIsRefreshing(true);
    try {
      const [celo, cusd] = await Promise.all([
        getBalance(wallet.address),
        getcUSDBalance(wallet.address),
      ]);
      setCeloBalance(celo);
      setcUSDBalance(cusd);
    } catch (error) {
      console.error("Failed to refresh balances:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCopy = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openFaucet = () => {
    window.open("https://faucet.celo.org/alfajores", "_blank");
  };

  const openExplorer = () => {
    if (wallet.address) {
      window.open(`https://alfajores.celoscan.io/address/${wallet.address}`, "_blank");
    }
  };

  if (!wallet.isConnected) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <StarField count={40} />
        
        <header className="sticky top-0 z-10 p-4 bg-background/80 backdrop-blur-lg border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-celo-green/20 flex items-center justify-center">
              <WalletIcon className="w-5 h-5 text-celo-green" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold">Wallet</h1>
              <p className="text-xs text-muted-foreground">Manage Your Assets</p>
            </div>
          </div>
        </header>
        
        <main className="relative z-10 p-4">
          <WalletConnect />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <StarField count={40} />
      
      <header className="sticky top-0 z-10 p-4 bg-background/80 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-celo-green/20 flex items-center justify-center">
              <WalletIcon className="w-5 h-5 text-celo-green" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold">Wallet</h1>
              <p className="text-xs text-muted-foreground">Alfajores Testnet</p>
            </div>
          </div>
          <Button 
            size="icon" 
            variant="ghost"
            onClick={refreshBalances}
            disabled={isRefreshing}
            data-testid="button-refresh"
          >
            <RefreshCcw className={cn("w-5 h-5", isRefreshing && "animate-spin")} />
          </Button>
        </div>
      </header>
      
      <main className="relative z-10 p-4 space-y-6">
        <Card className="border-celo-green/30 bg-gradient-to-b from-celo-green/10 to-space-dark/50 overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-celo-green animate-pulse" />
                <span className="text-sm text-muted-foreground">Connected</span>
                {wallet.isMiniPay && (
                  <Badge variant="secondary" className="bg-celo-green/20 text-celo-green border-celo-green/30 text-xs">
                    MiniPay
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-6">
                <p className="font-mono text-sm">{wallet.address}</p>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  data-testid="button-copy-address"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-celo-green" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-celo-green/20 flex items-center justify-center">
                      <Coins className="w-5 h-5 text-celo-green" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">CELO</p>
                      <p className="text-xs text-muted-foreground">Native Token</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {isRefreshing ? (
                      <Skeleton className="h-6 w-20" />
                    ) : (
                      <p className="font-display text-xl font-bold" data-testid="text-celo-balance">
                        {parseFloat(celoBalance).toFixed(4)}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-lg font-bold text-green-400">$</span>
                    </div>
                    <div className="text-left">
                      <p className="font-medium">cUSD</p>
                      <p className="text-xs text-muted-foreground">Celo Dollar</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {isRefreshing ? (
                      <Skeleton className="h-6 w-20" />
                    ) : (
                      <p className="font-display text-xl font-bold" data-testid="text-cusd-balance">
                        ${parseFloat(cUSDBalance).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-auto py-4 flex-col gap-2"
            onClick={openFaucet}
            data-testid="button-get-testnet-tokens"
          >
            <Droplets className="w-5 h-5 text-blue-400" />
            <span>Get Test Tokens</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 flex-col gap-2"
            onClick={openExplorer}
            data-testid="button-view-explorer"
          >
            <ExternalLink className="w-5 h-5 text-purple-400" />
            <span>View Explorer</span>
          </Button>
        </div>
        
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-lg">Network Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Network</span>
              <span className="font-medium">{CELO_ALFAJORES_CONFIG.chainName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Chain ID</span>
              <span className="font-mono">{CELO_ALFAJORES_CONFIG.chainId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Currency</span>
              <span>{CELO_ALFAJORES_CONFIG.nativeCurrency.symbol}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-muted-foreground">RPC</span>
              <span className="font-mono text-xs text-right max-w-[200px] truncate">
                {CELO_ALFAJORES_CONFIG.rpcUrls[0]}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-orange-500/30 bg-orange-500/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">⚠️</span>
              </div>
              <div>
                <p className="font-medium text-orange-400">Testnet Only</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This is the Alfajores testnet. Tokens have no real value. 
                  Use the faucet to get free test tokens for playing RocketMint.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
