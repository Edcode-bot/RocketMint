export interface MiniPayMCPConfig {
  appName: string;
  appUrl: string;
  appIcon: string;
}

export function getMiniPayMCPConfig(): MiniPayMCPConfig {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://rocketmint.app";
  return {
    appName: "RocketMint",
    appUrl: origin,
    appIcon: `${origin}/favicon.svg`,
  };
}

export function isMiniPayMCP(): boolean {
  if (typeof window === "undefined") return false;
  
  const ethereum = window.ethereum;
  return !!(
    ethereum?.isMiniPay ||
    ethereum?.isOpera ||
    (window.navigator.userAgent.toLowerCase().includes("minipay"))
  );
}

export async function connectMiniPayMCP(): Promise<string[]> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MiniPay not detected. Please open in MiniPay browser.");
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
      params: []
    }) as string[];

    return accounts;
  } catch (error) {
    console.error("MiniPay MCP connection failed:", error);
    throw error;
  }
}

export function getMiniPayDeepLink(path: string = ""): string {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://rocketmint.app";
  return `https://minipay.opera.com/app?url=${encodeURIComponent(baseUrl + path)}`;
}

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
