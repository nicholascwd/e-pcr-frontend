var CryptoJS = require("crypto-js");

export const decryptAESKEY = (key) => {
  var ciphertext = localStorage.getItem("SignedSymmmetricKey");
  var bytes = CryptoJS.AES.decrypt(ciphertext, key);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  sessionStorage.setItem("AESKEY", originalText);
};
