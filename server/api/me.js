// server/api/me.get.js
import jwt from "jsonwebtoken";
import { db } from "../utils/db";

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, "Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized: Missing or invalid token",
    });
  }

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    // Query user data
    const userResult = await db.execute({
      sql: "SELECT id, email, name, username, balance, account FROM users WHERE id = ?",
      args: [decoded.userId],
    });

    if (userResult.rows.length === 0) {
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    }

    // const user = userResult.rows[0];

    // Query addresses
    const addressResult = await db.execute({
      sql: "SELECT currency, address, ngnbalance, coinbal FROM addresses WHERE user_id = ?",
      args: [decoded.userId],
    });

    const user = JSON.parse(JSON.stringify(userResult.rows[0]));
    const addresses = JSON.parse(JSON.stringify(addressResult.rows));

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        balance: user.balance || 0,
        account: user.account || "STANDARD",
        addresses,
        last_checkin: new Date().toISOString(),
        checkin: 0,
        wallet: addressResult.rows.length > 0 ? "Linked" : "No Linked Wallet",
      },
    };
  } catch (error) {
    console.error("Me endpoint error:", error);
    throw createError({
      statusCode: error.name === "JsonWebTokenError" ? 401 : 500,
      message:
        error.name === "JsonWebTokenError"
          ? "Invalid token"
          : "Internal server error",
    });
  }
});
