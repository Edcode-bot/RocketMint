import { useEffect, useState, createContext, useContext, useCallback } from "react";
import { isMiniPay, connectMiniPayDirect } from "@/lib/wallet";
import { useGameStore } from "@/lib/gameStore";

interface WalletContextType {
  isMiniPayEnv: boolean;
  isAutoConnecting: boolean;
  autoConnectError: string | null;
  retryAutoConnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
  isMiniPayEnv: false,
  isAutoConnecting: false,
  autoConnectError: null,
  retryAutoConnect: () => {},
});

export function useWalletContext() {
  return useContext(WalletContext);
}

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [isMiniPayEnv, setIsMiniPayEnv] = useState(false);
  const [isAutoConnecting, setIsAutoConnecting] = useState(false);
  const [autoConnectError, setAutoConnectError] = useState<string | null>(null);
  const [hasAttemptedAutoConnect, setHasAttemptedAutoConnect] = useState(false);
  const { wallet, setWallet } = useGameStore();

  const attemptMiniPayConnect = useCallback(async () => {
    if (wallet.isConnected) return;
    
    const checkMiniPay = isMiniPay();
    setIsMiniPayEnv(checkMiniPay);

    if (checkMiniPay) {
      setIsAutoConnecting(true);
      setAutoConnectError(null);
      try {
        const walletState = await connectMiniPayDirect();
        setWallet(walletState);
        console.log("[WalletProvider] MiniPay auto-connected:", walletState.address);
      } catch (error) {
        console.error("[WalletProvider] MiniPay auto-connect failed:", error);
        setAutoConnectError(error instanceof Error ? error.message : "Auto-connect failed");
      } finally {
        setIsAutoConnecting(false);
      }
    }
    setHasAttemptedAutoConnect(true);
  }, [wallet.isConnected, setWallet]);

  useEffect(() => {
    attemptMiniPayConnect();

    const handleEthereumInitialized = () => {
      console.log("[WalletProvider] Ethereum initialized event received");
      if (!hasAttemptedAutoConnect) {
        attemptMiniPayConnect();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("ethereum#initialized", handleEthereumInitialized);
      
      const pollInterval = setInterval(() => {
        if (!hasAttemptedAutoConnect && typeof window.ethereum !== "undefined") {
          attemptMiniPayConnect();
          clearInterval(pollInterval);
        }
      }, 500);

      const clearPollTimeout = setTimeout(() => {
        clearInterval(pollInterval);
      }, 5000);

      return () => {
        window.removeEventListener("ethereum#initialized", handleEthereumInitialized);
        clearInterval(pollInterval);
        clearTimeout(clearPollTimeout);
      };
    }
  }, [attemptMiniPayConnect, hasAttemptedAutoConnect]);

  const retryAutoConnect = useCallback(() => {
    setHasAttemptedAutoConnect(false);
    attemptMiniPayConnect();
  }, [attemptMiniPayConnect]);

  return (
    <WalletContext.Provider value={{ isMiniPayEnv, isAutoConnecting, autoConnectError, retryAutoConnect }}>
      {children}
    </WalletContext.Provider>
  );
}
