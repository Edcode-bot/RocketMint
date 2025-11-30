import { createWalletClient, createPublicClient, custom, http, formatEther, type WalletClient, type PublicClient, type Account } from "viem";
import { celoAlfajores, celo } from "viem/chains";
import type { WalletState } from "@shared/schema";

declare global {
  interface Window {
    ethereum?: {
      isMiniPay?: boolean;
      isValora?: boolean;
      isOpera?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

export const CELO_ALFAJORES_CONFIG = {
  chainId: 44787,
  chainName: "Celo Alfajores Testnet",
  nativeCurrency: {
    name: "Celo",
    symbol: "CELO",
    decimals: 18,
  },
  rpcUrls: ["https://alfajores-forno.celo-testnet.org"],
  blockExplorerUrls: ["https://alfajores.celoscan.io"],
};

export const cUSD_ADDRESS = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1" as const;

export function isMiniPay(): boolean {
  if (typeof window === "undefined") return false;
  return !!(
    window.ethereum?.isMiniPay === true ||
    window.ethereum?.isOpera === true ||
    window.navigator.userAgent.toLowerCase().includes("minipay")
  );
}

export function isValora(): boolean {
  if (typeof window === "undefined") return false;
  return !!(
    window.ethereum?.isValora === true ||
    window.navigator.userAgent.toLowerCase().includes("valora")
  );
}

export function detectMiniPayEnvironment(): boolean {
  if (typeof window === "undefined") return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return (
    window.ethereum?.isMiniPay === true ||
    window.ethereum?.isOpera === true ||
    userAgent.includes("minipay") ||
    userAgent.includes("opera")
  );
}

export function detectValoraEnvironment(): boolean {
  if (typeof window === "undefined") return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return (
    window.ethereum?.isValora === true ||
    userAgent.includes("valora")
  );
}

export type ConnectStatus = 
  | "trying_minipay"
  | "trying_valora"
  | "minipay_timeout"
  | "valora_timeout"
  | "connecting_wallet"
  | "connected"
  | "failed";

export interface ConnectResult {
  status: ConnectStatus;
  wallet?: WalletState;
  error?: string;
}

export function isWalletAvailable(): boolean {
  return typeof window !== "undefined" && !!window.ethereum;
}

export async function connectMiniPayDirect(): Promise<WalletState> {
  if (!window.ethereum) {
    throw new Error("MiniPay not detected. Please open in MiniPay browser.");
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [],
    }) as string[];
    
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found. Please approve the connection in MiniPay.");
    }
    
    const address = accounts[0];
    const balance = await getBalance(address);
    
    return {
      address,
      isConnected: true,
      isMiniPay: true,
      balance,
      chainId: celoAlfajores.id,
    };
  } catch (error) {
    console.error("[MiniPay] Direct connection failed:", error);
    throw error;
  }
}

export async function connectWallet(preferredProvider: "minipay" | "valora" | "wagmi" = "wagmi"): Promise<WalletState> {
  if (!isWalletAvailable()) {
    throw new Error("No wallet detected. Please install MiniPay, Valora, or a compatible wallet.");
  }

  if (preferredProvider === "minipay" && isMiniPay()) {
    return connectMiniPayDirect();
  }

  try {
    const accounts = (await window.ethereum!.request({
      method: "eth_requestAccounts",
      params: [],
    })) as string[];

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found");
    }

    const address = accounts[0];
    const chainId = (await window.ethereum!.request({
      method: "eth_chainId",
    })) as string;

    const balance = await getBalance(address);

    return {
      address,
      isConnected: true,
      isMiniPay: isMiniPay(),
      balance,
      chainId: parseInt(chainId, 16),
    };
  } catch (error) {
    console.error("Failed to connect wallet:", error);
    throw error;
  }
}

async function tryMiniPayConnect(timeout: number = 4000): Promise<WalletState> {
  if (!isMiniPay() && !detectMiniPayEnvironment()) {
    throw new Error("MiniPay not detected");
  }

  return Promise.race([
    connectMiniPayDirect(),
    new Promise<WalletState>((_, reject) =>
      setTimeout(() => reject(new Error("MiniPay timeout")), timeout)
    ),
  ]);
}

async function tryValoraConnect(timeout: number = 4000): Promise<WalletState> {
  if (!isValora() && !detectValoraEnvironment()) {
    throw new Error("Valora not detected");
  }

  return Promise.race([
    connectWallet("valora"),
    new Promise<WalletState>((_, reject) =>
      setTimeout(() => reject(new Error("Valora timeout")), timeout)
    ),
  ]);
}

export async function connectWithPriority(): Promise<ConnectResult> {
  if (isMiniPay() || detectMiniPayEnvironment()) {
    try {
      const wallet = await tryMiniPayConnect(4000);
      return { status: "connected", wallet };
    } catch (error) {
      console.log("[Wallet] MiniPay connection failed, trying Valora...", error);
    }
  }

  if (isValora() || detectValoraEnvironment()) {
    try {
      const wallet = await tryValoraConnect(4000);
      return { status: "connected", wallet };
    } catch (error) {
      console.log("[Wallet] Valora connection failed, falling back to generic...", error);
    }
  }

  try {
    const wallet = await connectWallet("wagmi");
    return { status: "connected", wallet };
  } catch (error) {
    return {
      status: "failed",
      error: error instanceof Error ? error.message : "Connection failed",
    };
  }
}

export async function getBalance(address: string): Promise<string> {
  try {
    const publicClient = createPublicClient({
      chain: celoAlfajores,
      transport: http(),
    });

    const balance = await publicClient.getBalance({
      address: address as `0x${string}`,
    });

    return formatEther(balance);
  } catch (error) {
    console.error("Failed to get balance:", error);
    return "0";
  }
}

export async function getcUSDBalance(address: string): Promise<string> {
  try {
    const publicClient = createPublicClient({
      chain: celoAlfajores,
      transport: http(),
    });

    const balance = await publicClient.readContract({
      address: cUSD_ADDRESS,
      abi: [
        {
          name: "balanceOf",
          type: "function",
          inputs: [{ name: "account", type: "address" }],
          outputs: [{ name: "", type: "uint256" }],
          stateMutability: "view",
        },
      ],
      functionName: "balanceOf",
      args: [address as `0x${string}`],
    });

    return formatEther(balance as bigint);
  } catch (error) {
    console.error("Failed to get cUSD balance:", error);
    return "0";
  }
}

export function getMiniPayWalletClient(): WalletClient {
  if (!window.ethereum) {
    throw new Error("Wallet not available");
  }

  return createWalletClient({
    chain: celoAlfajores,
    transport: custom(window.ethereum),
  });
}

export function getWalletClient(): WalletClient {
  if (!isWalletAvailable()) {
    throw new Error("Wallet not available");
  }

  return createWalletClient({
    chain: celoAlfajores,
    transport: custom(window.ethereum!),
  });
}

export function getPublicClient(): PublicClient {
  return createPublicClient({
    chain: celoAlfajores,
    transport: http(),
  });
}

export function shortenAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export async function switchToAlfajores(): Promise<void> {
  if (!isWalletAvailable()) return;
  if (isMiniPay()) return;

  try {
    await window.ethereum!.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${CELO_ALFAJORES_CONFIG.chainId.toString(16)}` }],
    });
  } catch (switchError: unknown) {
    if ((switchError as { code: number }).code === 4902) {
      await window.ethereum!.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${CELO_ALFAJORES_CONFIG.chainId.toString(16)}`,
            chainName: CELO_ALFAJORES_CONFIG.chainName,
            nativeCurrency: CELO_ALFAJORES_CONFIG.nativeCurrency,
            rpcUrls: CELO_ALFAJORES_CONFIG.rpcUrls,
            blockExplorerUrls: CELO_ALFAJORES_CONFIG.blockExplorerUrls,
          },
        ],
      });
    } else {
      console.error("[Wallet] Failed to switch to Alfajores:", switchError);
    }
  }
}
