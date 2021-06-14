import axios from "axios";
import { decryptAESKEY, testEncrypt } from "./KeyStorage";

// return the user data from the local storage
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  return null;
};

// return the token from the local storage
// sets AES key into the session storage if blank.\
export const getToken = () => {

  const SignedSymmmetricKey = localStorage.getItem('SignedSymmmetricKey')
  if(!SignedSymmmetricKey && window.location.pathname!=='/enroll'){
    window.open('/enroll','_self')
  }
  const token = localStorage.getItem('token')
  if(token){
    const AESKEY = sessionStorage.getItem('AESKEY')
    if(!AESKEY){
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.open('/login','_self')
  }
    return token;
  }else{
    return null;
  }
};

export const setAESKeyInSession=(key)=>{
  const AESKEY = sessionStorage.getItem('AESKEY')
  if(!AESKEY){
    decryptAESKEY(key)
  }
}


// remove the token and user from the session storage
export const removeUserSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// set the token and user from the session storage
export const setUserSession = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};
