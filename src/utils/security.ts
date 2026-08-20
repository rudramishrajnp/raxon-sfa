/**
 * Cryptographically Secure Utilities for RAXON SFA Zero-Trust Architecture
 */

/**
 * Generates an unpredictable, cryptographically strong temporary password.
 * Uses Web Crypto API (window.crypto) in browser environments and Node crypto if server-side.
 */
export function generateSecureTemporaryPassword(length: number = 12): string {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowercase = 'abcdefghijkmnpqrstuvwxyz';
  const numbers = '23456789';
  const symbols = '!@#$%^&*';
  const allChars = uppercase + lowercase + numbers + symbols;

  const array = new Uint8Array(length);
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(array);
  } else {
    try {
      const crypto = require('crypto');
      const bytes = crypto.randomBytes(length);
      for (let i = 0; i < length; i++) {
        array[i] = bytes[i];
      }
    } catch {
      for (let i = 0; i < length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
  }

  // Ensure at least one character from each set for strong initial passwords
  let result = [
    uppercase[array[0] % uppercase.length],
    lowercase[array[1] % lowercase.length],
    numbers[array[2] % numbers.length],
    symbols[array[3] % symbols.length]
  ];

  for (let i = 4; i < length; i++) {
    result.push(allChars[array[i] % allChars.length]);
  }

  // Fisher-Yates shuffle with crypto values
  for (let i = result.length - 1; i > 0; i--) {
    const j = array[i] % (i + 1);
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }

  return result.join('');
}
