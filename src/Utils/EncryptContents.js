var CryptoJS = require("crypto-js")


export const encryptField = (message) => {
    // Encrypt
    const AESKEY = sessionStorage.getItem('AESKEY');
    var ciphertext = CryptoJS.AES.encrypt(message, AESKEY).toString();
    return ciphertext;
};

export const encryptObject = (message) => {
    // Encrypt
    const AESKEY = sessionStorage.getItem('AESKEY');
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(message), AESKEY).toString();
    return ciphertext;
};

export const decryptField = (ciphertext) => {
    // Encrypt
    const AESKEY = sessionStorage.getItem('AESKEY');
    var bytes  = CryptoJS.AES.decrypt(ciphertext, AESKEY);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};
export const decryptObject = (ciphertext) => {
    // Encrypt
    const AESKEY = sessionStorage.getItem('AESKEY');
    var bytes  = CryptoJS.AES.decrypt(JSON.parse(ciphertext), AESKEY);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};