import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const { token } = await readBody(event);

  if (!token) {
    throw createError({
      statusCode: 400,
      message: "Token is required",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    return { valid: true, user: { id: decoded.userId, email: decoded.email } };
  } catch (error) {
    console.error("Token verification error:", error);
    return { valid: false, message: "Invalid or expired token" };
  }
});
