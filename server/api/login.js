import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../utils/db";

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event);

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      message: "Username and password are required",
    });
  }

  try {
    // Query user from Turso
    const { rows } = await db.execute({
      sql: "SELECT id, email, password FROM users WHERE username = ?",
      args: [username],
    });

    if (rows.length === 0) {
      throw createError({
        statusCode: 401,
        message: "Invalid username or password",
      });
    }

    const user = rows[0];

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw createError({
        statusCode: 401,
        message: "Incorrect password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key", // Use env var in production
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    return { success: true, token, message: "Login successful" };
  } catch (error) {
    console.error("Login error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error",
    });
  }
});
