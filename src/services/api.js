import axios from 'axios';
import config from '../config';
import { storage } from './storage';

export const api = axios.create({
	baseURL: config.API_BASE_URL,
	timeout: 5_000,
	headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((reqConfig) => {
	const token = storage.getToken();
	if (token) {
		reqConfig.headers.Authorization = `Bearer ${token}`;
	}
	return reqConfig;
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			storage.clearAuth();
			window.dispatchEvent(new Event('auth_expired'));
		}
		return Promise.reject(error);
	},
);
