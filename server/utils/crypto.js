import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16; 
const SECRET_KEY = process.env.WALLET_SECRET_KEY;

// 🔒 Encrypt private key
export function encryptPrivateKey(privateKey) {
  if (!SECRET_KEY || SECRET_KEY.length !== 32) {
    throw new Error("WALLET_SECRET_KEY must be set and 32 characters long");
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);

  let encrypted = cipher.update(privateKey, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return {
    encryptedData: encrypted,
    iv: iv.toString("hex"),
    tag: authTag,
  };
}

// 🔓 Decrypt private key
export function decryptPrivateKey({ encryptedData, iv, tag }) {
  if (!SECRET_KEY || SECRET_KEY.length !== 32) {
    throw new Error("WALLET_SECRET_KEY must be set and 32 characters long");
  }

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(SECRET_KEY),
    Buffer.from(iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(tag, "hex"));

  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
