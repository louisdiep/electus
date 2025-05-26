import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Path to private key (used for decryption) — in shared/
const privateKeyPath = path.resolve(__dirname, '../../backend/src/data/private_key.pem');

// Path to public key (used for optional backend-side encryption, or testing) — in frontend/public/
const publicKeyPath = path.resolve(__dirname, '../../frontend/public/public_key.pem');

// Check for key existence
if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
  throw new Error('RSA key files not found. Please run generateKeys.js in shared/src/');
}

// Read keys
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

/**
 * Decrypts a base64-encoded string using the private key.
 */
export function decryptData(base64Encrypted: string): string {
  const buffer = Buffer.from(base64Encrypted, 'base64');
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    buffer
  );
  return decrypted.toString('utf8');
}

/**
 * Encrypts plaintext using the public key and returns a base64-encoded string.
 */
export function encryptWithPublicKey(plain: string): string {
  const buffer = Buffer.from(plain, 'utf8');
  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    buffer
  );
  return encrypted.toString('base64');
}
