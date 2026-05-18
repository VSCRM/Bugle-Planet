import config from '../config';
import { api } from './api';
import { MOCK_NEWS } from '../mock/newsData';
import { mockDelay } from '../mock/mockDelay';

const mockMethods = {
	async getAll() { await mockDelay(); return MOCK_NEWS; },
	async getById(id) { await mockDelay(); return MOCK_NEWS.find(n => n.id === Number(id)) ?? null; }
};

const apiMethods = {
	async getAll() { const { data } = await api.get('/news'); return data; },
	async getById(id) { const { data } = await api.get(`/news/${id}`); return data; }
};

export const newsService = config.USE_MOCK ? mockMethods : apiMethods;
