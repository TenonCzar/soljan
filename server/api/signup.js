import bcrypt from "bcryptjs";
import { db, initDB } from "../utils/db";
import { generateAddresses } from "../utils/wallets";

export default defineEventHandler(async (event) => {
  const { email, password, fullName } = await readBody(event);

  // Validate input
  if (!email || !password || !fullName) {
    throw createError({
      statusCode: 400,
      message: "Email and password are required",
    });
  }

  await initDB();

  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into database
    const userResult = await db.execute({
      sql: "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      args: [fullName, email, hashedPassword],
    });

    const userId = userResult.lastInsertRowid;

    // Generate wallet addresses
    const addresses = await generateAddresses();

    // Store addresses in database
    const addressInserts = Object.entries(addresses).map(
      ([currency, address]) =>
        db.execute({
          sql: "INSERT INTO addresses (user_id, currency, address) VALUES (?, ?, ?)",
          args: [userId, currency, address],
        })
    );
    await Promise.all(addressInserts);

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT") {
      throw createError({
        statusCode: 400,
        message: "Email already exists",
      });
    }
    throw createError({
      statusCode: 500,
      message: `Internal server error ${error.message}`,
    });
  }
});
