import { createWalletClient, createPublicClient, custom, http, type Hash } from "viem";
import { celoAlfajores } from "viem/chains";
import deploymentInfo from "@/contracts/deployment.json";
import contractABI from "@/contracts/MiniRocketGame.json";
import { isMiniPay, cUSD_ADDRESS } from "./wallet";

const CONTRACT_ADDRESS = deploymentInfo.address as `0x${string}`;

export interface ContractConfig {
  address: `0x${string}`;
  abi: typeof contractABI.abi;
}

export const contractConfig: ContractConfig = {
  address: CONTRACT_ADDRESS,
  abi: contractABI.abi,
};

export function getPublicClient() {
  return createPublicClient({
    chain: celoAlfajores,
    transport: http(),
  });
}

export function getWalletClient() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("Wallet not available");
  }

  return createWalletClient({
    chain: celoAlfajores,
    transport: custom(window.ethereum),
  });
}

export async function submitPrediction(
  planetId: number,
  userAddress: `0x${string}`
): Promise<Hash> {
  const walletClient = getWalletClient();

  if (isMiniPay()) {
    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: contractABI.abi,
      functionName: "submitPrediction",
      args: [BigInt(planetId)],
      account: userAddress,
      feeCurrency: cUSD_ADDRESS,
    } as any);

    return hash;
  }

  const hash = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI.abi,
    functionName: "submitPrediction",
    args: [BigInt(planetId)],
    account: userAddress,
  });

  return hash;
}

export async function getPlayerXP(playerAddress: `0x${string}`): Promise<bigint> {
  const publicClient = getPublicClient();

  const xp = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI.abi,
    functionName: "getPlayerXP",
    args: [playerAddress],
  }) as bigint;

  return xp;
}

export async function getPrediction(
  round: number,
  playerAddress: `0x${string}`
): Promise<bigint> {
  const publicClient = getPublicClient();

  const prediction = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI.abi,
    functionName: "getPrediction",
    args: [BigInt(round), playerAddress],
  }) as bigint;

  return prediction;
}

export async function getCurrentRound(): Promise<bigint> {
  const publicClient = getPublicClient();

  const round = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI.abi,
    functionName: "currentRound",
  }) as bigint;

  return round;
}

export async function sendTransactionMiniPay(
  to: `0x${string}`,
  data: `0x${string}`,
  userAddress: `0x${string}`
): Promise<Hash> {
  const walletClient = getWalletClient();

  const hash = await walletClient.sendTransaction({
    to,
    data,
    account: userAddress,
    chain: celoAlfajores,
    feeCurrency: cUSD_ADDRESS,
  } as any);

  return hash;
}

export async function sendTransactionNormal(
  to: `0x${string}`,
  data: `0x${string}`,
  userAddress: `0x${string}`
): Promise<Hash> {
  const walletClient = getWalletClient();

  const hash = await walletClient.sendTransaction({
    to,
    data,
    account: userAddress,
    chain: celoAlfajores,
  });

  return hash;
}

export async function sendTransaction(
  to: `0x${string}`,
  data: `0x${string}`,
  userAddress: `0x${string}`
): Promise<Hash> {
  if (isMiniPay()) {
    return sendTransactionMiniPay(to, data, userAddress);
  }
  return sendTransactionNormal(to, data, userAddress);
}
