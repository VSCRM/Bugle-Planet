import CryptoJS from 'crypto-js';

export const hashPassword = (password) =>
	CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
