import dotenv from 'dotenv';
dotenv.config();
import crypto from 'node:crypto';

const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");

export function encryptSymmetric(plaintext, encryptionKey = key, algorithm = "aes-256-cbc") {
    if (!encryptionKey) {
        throw new Error("Encryption key is missing!");
    }

    const iv = crypto.randomBytes(16); 
    const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);
    const ciphertext = cipher.update(plaintext, "utf8", "hex") + cipher.final("hex");

    return iv.toString("hex") + ":" + ciphertext;
}

export function decryptSymmetric(encryptedData, encryptionKey = key, algorithm = "aes-256-cbc") {
    if (!encryptionKey) {
        throw new Error("Decryption key is missing!");
    }

    const [ivHex, ciphertext] = encryptedData.split(":"); 
    const iv = Buffer.from(ivHex, "hex");

    const decipher = crypto.createDecipheriv(algorithm, encryptionKey, iv);
    const decrypted = decipher.update(ciphertext, "hex", "utf8") + decipher.final("utf8");

    return decrypted;
}
