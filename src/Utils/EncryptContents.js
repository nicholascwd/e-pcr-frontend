const CryptoJS = require('crypto-js');

export const encryptField = (message) => {
  // Encrypt
  const AESKEY = sessionStorage.getItem('AESKEY');
  return CryptoJS.AES.encrypt(message, AESKEY).toString();
};

export const encryptObject = (message) => {
  // Encrypt
  const AESKEY = sessionStorage.getItem('AESKEY');
  return CryptoJS.AES.encrypt(JSON.stringify(message), AESKEY).toString();
};

export const decryptField = (ciphertext) => {
  // Encrypt
  if (!ciphertext) {
    return;
  }
  const AESKEY = sessionStorage.getItem('AESKEY');
  let bytes = CryptoJS.AES.decrypt(ciphertext, AESKEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
export const decryptObject = (ciphertext) => {
  // Encrypt
  const AESKEY = sessionStorage.getItem('AESKEY');
  let bytes = CryptoJS.AES.decrypt(JSON.parse(ciphertext), AESKEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
