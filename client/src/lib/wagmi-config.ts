import { createConfig, http } from "wagmi";
import { celoAlfajores, celo } from "viem/chains";
import { injected, walletConnect, coinbaseWallet } from "@wagmi/connectors";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64";

export const wagmiConfig = createConfig({
  chains: [celoAlfajores, celo],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
    walletConnect({
      projectId,
      showQrModal: true,
      metadata: {
        name: "RocketMint",
        description: "Celo Prediction Game",
        url: typeof window !== "undefined" ? window.location.origin : "https://rocketmint.app",
        icons: [typeof window !== "undefined" ? `${window.location.origin}/favicon.svg` : ""],
      },
    }),
    coinbaseWallet({
      appName: "RocketMint",
      appLogoUrl: typeof window !== "undefined" ? `${window.location.origin}/favicon.svg` : "",
    }),
  ],
  transports: {
    [celoAlfajores.id]: http("https://alfajores-forno.celo-testnet.org"),
    [celo.id]: http("https://forno.celo.org"),
  },
});

export const CELO_ALFAJORES_CHAIN_ID = 44787;
export const CELO_MAINNET_CHAIN_ID = 42220;

export const CUSD_ADDRESSES = {
  [CELO_ALFAJORES_CHAIN_ID]: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1" as const,
  [CELO_MAINNET_CHAIN_ID]: "0x765DE816845861e75A25fCA122bb6898B8B1282a" as const,
} as const;
