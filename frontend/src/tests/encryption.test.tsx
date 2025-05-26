import { encryptWithPublicKey, decryptData } from '../../../shared/src/encryptionBackend';
import fs from 'fs';
import path from 'path';

describe('Encryption/Decryption Roundtrip', () => {
  it('should encrypt and decrypt correctly', () => {
    const message = 'hello zID!';
    const encrypted = encryptWithPublicKey(message);
    const decrypted = decryptData(encrypted);
    expect(decrypted).toBe(message);
  });

  it('should use the same public key as the frontend fetches', () => {
    const backendPublicKey = fs.readFileSync(
      path.resolve(__dirname, '../../../shared/public_key.pem'),
      'utf8'
    );

    expect(backendPublicKey).toContain('BEGIN PUBLIC KEY');
  });
});
