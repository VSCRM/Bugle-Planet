import config from '../config';

export const mockDelay = () =>
	new Promise(resolve => setTimeout(resolve, config.MOCK_DELAY_MS));
