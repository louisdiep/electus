// shared/src/generateKeys.js

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Define key output paths
const privateKeyPath = path.resolve(__dirname, '../backend/src/data/private_key.pem'); // in shared/
const publicKeyPath = path.resolve(__dirname, '../frontend/public/public_key.pem'); // in frontend/public/

// Create keys if they don't exist
if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  fs.writeFileSync(privateKeyPath, privateKey);
  fs.writeFileSync(publicKeyPath, publicKey);
  console.log('RSA key pair generated.');
} else {
  console.log('RSA key files already exist. Skipping generation.');
}
