import { createWalletClient, createPublicClient, custom, http, formatEther } from "viem";
import { celoAlfajores } from "viem/chains";
import type { WalletState } from "@shared/schema";

declare global {
  interface Window {
    ethereum?: {
      isMiniPay?: boolean;
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
  return typeof window !== "undefined" && !!window.ethereum?.isMiniPay;
}

export function isWalletAvailable(): boolean {
  return typeof window !== "undefined" && !!window.ethereum;
}

export async function connectWallet(): Promise<WalletState> {
  if (!isWalletAvailable()) {
    throw new Error("No wallet detected. Please install MiniPay or a compatible wallet.");
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

export async function getBalance(address: string): Promise<string> {
  if (!isWalletAvailable()) return "0";

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
  if (!isWalletAvailable()) return "0";

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

export function getWalletClient() {
  if (!isWalletAvailable()) {
    throw new Error("Wallet not available");
  }

  return createWalletClient({
    chain: celoAlfajores,
    transport: custom(window.ethereum!),
  });
}

export function getPublicClient() {
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
      throw switchError;
    }
  }
}
