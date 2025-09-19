// wallet.js
import { ethers } from "ethers";
import { Keypair } from "@solana/web3.js";
import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";
import { ECPairFactory } from "ecpair";
import fetch from "node-fetch";

// Polyfill fetch
globalThis.fetch = fetch;

// Create ECPair instance
const ECPair = ECPairFactory(ecc);

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

    // Bitcoin (mainnet)
const btcNetwork = bitcoin.networks.bitcoin;
const keyPair = ECPair.makeRandom({ network: btcNetwork });

const { address: btcAddress } = bitcoin.payments.p2pkh({
  pubkey: Buffer.from(keyPair.publicKey), // ✅ fix here
  network: btcNetwork,
});

addresses.bitcoin = btcAddress;
addresses.btc_wif = keyPair.toWIF();

    return addresses;
  } catch (error) {
    console.error("Generate Addresses Error:", error);
    throw error;
  }
}
