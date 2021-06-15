var CryptoJS = require('crypto-js');

export const decryptAESKEY = (key) => {
  let ciphertext = localStorage.getItem('EncryptedSymmmetricKey');
  let bytes = CryptoJS.AES.decrypt(ciphertext, key);
  let originalText = bytes.toString(CryptoJS.enc.Utf8);
  sessionStorage.setItem('AESKEY', originalText);
};
