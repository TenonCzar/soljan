// wallet.js
import { ethers } from "ethers";
import { Keypair } from "@solana/web3.js";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import pkg from "tronweb";
import fetch from "node-fetch";
const { TronWeb } = pkg;

// Polyfill fetch (needed for tronweb in Node.js)
globalThis.fetch = fetch;

export async function generateUserWallets() {
  const addresses = {};

  try {
    // ----- EVM (Ethereum + BSC for ERC20/BEP20 tokens) -----
    const evmWallet = ethers.Wallet.createRandom();
    const evmAddress = evmWallet.address;

    // ETH (ERC20 only)
    addresses.eth = {
      erc20: evmAddress,
    };

    // BNB (ERC20 + BEP20)
    addresses.bnb = {
      erc20: evmAddress,
      bep20: evmAddress,
    };

    // USDT (ERC20 + BEP20 + TRC20)
    addresses.usdt = {
      erc20: evmAddress,
      bep20: evmAddress,
      // trc20 will be added below with Tron
    };

    // USDC (ERC20 + BEP20)
    addresses.usdc = {
      erc20: evmAddress,
      bep20: evmAddress,
    };

    // ----- TRON (for TRC20 like USDT-TRC20) -----
    const tronWeb = new TronWeb({ fullHost: "https://api.trongrid.io" });
    const tronAccount = tronWeb.utils.accounts.generateAccount();

    addresses.usdt.trc20 = tronAccount.address.base58;
    addresses.tron = {
      native: tronAccount.address.base58,
    };

    // ----- Solana -----
    const solKeypair = Keypair.generate();
    addresses.solana = {
      native: solKeypair.publicKey.toBase58(),
    };

    // ----- Sui -----
    const suiKeypair = new Ed25519Keypair();
    const suiAddress = suiKeypair.getPublicKey().toSuiAddress();
    addresses.sui = {
      native: suiAddress,
    };

    return {
      addresses,
      privateKeys: {
        eth: {
          erc20: evmWallet.privateKey,
        },
        bnb: {
          erc20: evmWallet.privateKey,
          bep20: evmWallet.privateKey,
        },
        usdt: {
          erc20: evmWallet.privateKey,
          bep20: evmWallet.privateKey,
          trc20: tronAccount.privateKey,
        },
        usdc: {
          erc20: evmWallet.privateKey,
          bep20: evmWallet.privateKey,
        },
        tron: {
          native: tronAccount.privateKey,
        },
        solana: {
          native: Buffer.from(solKeypair.secretKey).toString("hex"),
        },
        sui: {
          native: Buffer.from(suiKeypair.export().privateKey).toString("hex"),
        },
      },
    };
  } catch (error) {
    console.error("Generate Wallets Error:", error);
    throw error;
  }
}
