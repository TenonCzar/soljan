// server/api/updateBalance.patch.js
import jwt from "jsonwebtoken";
import { db } from "../utils/db";

const COIN_ID_TO_CURRENCY = {
  sui: "sui",
  ethereum: "eth",
  solana: "solana",
  tether: "usdt",
  binancecoin: "bsc",
  "usd-coin": "usdc",
};

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, "Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const body = await readBody(event);
    const { coinId, coinbal, currentPrice } = body;

    if (!coinId || coinbal == null || currentPrice == null) {
      throw createError({
        statusCode: 400,
        message: "Missing required fields",
      });
    }

    const currency = COIN_ID_TO_CURRENCY[coinId];
    if (!currency)
      throw createError({ statusCode: 400, message: "Invalid coinId" });

    // Fetch the user's address row
    const addressResult = await db.execute({
      sql: "SELECT id, coinbal FROM addresses WHERE user_id = ? AND currency = ?",
      args: [decoded.userId, currency],
    });

    if (addressResult.rows.length === 0) {
      throw createError({ statusCode: 404, message: "Address not found" });
    }

    const address = addressResult.rows[0];
    const ngnbalance = (coinbal * currentPrice).toFixed(2);

    // Update the row
    await db.execute({
      sql: "UPDATE addresses SET coinbal = ?, ngnbalance = ? WHERE id = ?",
      args: [coinbal, ngnbalance, address.id],
    });

    // 🔑 Calculate total balance in NGN across all addresses
    const totalBalanceResult = await db.execute({
      sql: "SELECT SUM(CAST(ngnbalance AS FLOAT)) AS total FROM addresses WHERE user_id = ?",
      args: [decoded.userId],
    });

    const totalBalance = totalBalanceResult.rows[0]?.total || 0;

    // Optionally also update the users table with the latest total balance
    await db.execute({
      sql: "UPDATE users SET balance = ? WHERE id = ?",
      args: [totalBalance, decoded.userId],
    });

    // Fetch updated user + addresses
    const userResult = await db.execute({
      sql: "SELECT id, email, name, username, balance, account FROM users WHERE id = ?",
      args: [decoded.userId],
    });

    const updatedAddressesResult = await db.execute({
      sql: "SELECT currency, address, ngnbalance, coinbal FROM addresses WHERE user_id = ?",
      args: [decoded.userId],
    });

    const user = JSON.parse(JSON.stringify(userResult.rows[0]));
    const addresses = JSON.parse(JSON.stringify(updatedAddressesResult.rows));

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        balance: totalBalance || 0,
        account: user.account || "STANDARD",
        addresses,
        last_checkin: new Date().toISOString(),
        checkin: 0,
        wallet: addresses.length > 0 ? "Linked" : "No Linked Wallet",
      },
    };
  } catch (error) {
    console.error("UpdateBalance endpoint error:", error);
    throw createError({
      statusCode: error.name === "JsonWebTokenError" ? 401 : 500,
      message:
        error.name === "JsonWebTokenError"
          ? "Invalid token"
          : "Internal server error",
    });
  }
});
