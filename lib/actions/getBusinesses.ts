import { Business } from '#/common.types';
import { request } from '#/lib/utils';

const getBusinesses = async () => {
	try {
		const response = await request<Business[]>('/api/businesses', 'GET');

		return response;
	} catch (error: any) {
		return null;
	}
};

export default getBusinesses;
