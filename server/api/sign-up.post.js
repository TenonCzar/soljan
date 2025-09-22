// server/api/signup.js
import bcrypt from "bcryptjs";
import { db, initDB } from "../utils/db";
import { generateUserWallets } from "../utils/wallets"; // updated wallet generator
import { encryptPrivateKey } from "../utils/crypto"; // encryption utils

export default defineEventHandler(async (event) => {
  const { email, password, fullName, userName } = await readBody(event);

  // ✅ Validate input
  if (!email || !password || !fullName || !userName || !userName.trim()) {
    throw createError({
      statusCode: 400,
      message: "All fields are required",
    });
  }

  await initDB();

  try {
    // ✅ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Insert user
    const userResult = await db.execute({
      sql: "INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)",
      args: [fullName, userName, email, hashedPassword],
    });

    const userId = userResult.lastInsertRowid;

    // ✅ Generate wallets (addresses + private keys)
    const { addresses, privateKeys } = await generateUserWallets();

    // ✅ Insert addresses into DB
    const addressInserts = [];
    for (const [currency, networks] of Object.entries(addresses)) {
      for (const [network, address] of Object.entries(networks)) {
        addressInserts.push(
          db.execute({
            sql: `INSERT INTO addresses (user_id, currency, network, address) 
                  VALUES (?, ?, ?, ?)`,
            args: [userId, currency, network, address],
          })
        );
      }
    }
    await Promise.all(addressInserts);

    // ✅ Insert encrypted private keys into DB
    const keyInserts = [];
    for (const [currency, networks] of Object.entries(privateKeys)) {
      for (const [network, privateKey] of Object.entries(networks)) {
        const { encryptedData, iv, tag } = encryptPrivateKey(privateKey);

        keyInserts.push(
          db.execute({
            sql: `INSERT INTO pato_ti (user_id, currency, network, encrypted_key, iv, tag) 
                  VALUES (?, ?, ?, ?, ?, ?)`,
            args: [userId, currency, network, encryptedData, iv, tag],
          })
        );
      }
    }
    await Promise.all(keyInserts);

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT") {
      throw createError({
        statusCode: 400,
        message: "Email or Username already exists",
      });
    }
    throw createError({
      statusCode: 500,
      message: `Internal server error: ${error.message}`,
    });
  }
});
