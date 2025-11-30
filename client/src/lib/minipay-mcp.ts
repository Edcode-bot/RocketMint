
// MiniPay MCP Integration Helper
// Following https://github.com/celo-org/composer-kit-mcp

export interface MiniPayMCPConfig {
  appName: string;
  appUrl: string;
  appIcon: string;
}

export const MINIPAY_MCP_CONFIG: MiniPayMCPConfig = {
  appName: "RocketMint",
  appUrl: window.location.origin,
  appIcon: `${window.location.origin}/favicon.svg`
};

export function isMiniPayMCP(): boolean {
  if (typeof window === "undefined") return false;
  
  // Check for MiniPay MCP specific properties
  const ethereum = window.ethereum;
  return !!(
    ethereum?.isMiniPay ||
    ethereum?.isOpera ||
    (window.navigator.userAgent.toLowerCase().includes("minipay"))
  );
}

export async function connectMiniPayMCP(): Promise<string[]> {
  if (!window.ethereum) {
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
  const baseUrl = window.location.origin;
  return `https://minipay.opera.com/app?url=${encodeURIComponent(baseUrl + path)}`;
}
