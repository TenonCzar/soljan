// wallet.js
import { ethers } from "ethers";
import { Keypair } from "@solana/web3.js";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import fetch from "node-fetch";

// Polyfill fetch
globalThis.fetch = fetch;

export async function generateAddresses() {
  const addresses = {};

  try {
    // Ethereum / BSC / USDT / USDC
    const ethWallet = ethers.Wallet.createRandom();
    addresses.eth = ethWallet.address;
    addresses.bsc = ethWallet.address;
    addresses.usdt = ethWallet.address;
    addresses.usdc = ethWallet.address;

    // Solana
    const solKeypair = Keypair.generate();
    addresses.solana = solKeypair.publicKey.toBase58();

    // Sui (Ed25519)
    const suiKeypair = new Ed25519Keypair();
    const suiAddress = suiKeypair.getPublicKey().toSuiAddress();
    addresses.sui = suiAddress;

    return addresses;
  } catch (error) {
    console.error("Generate Addresses Error:", error);
    throw error;
  }
}
