import { Business } from '#/common.types';
import { request } from '#/lib/utils';

const getLastCreatedBusiness = async () => {
	try {
		const response = await request<Business>('/api/getLastCreatedBusiness', 'GET');

		return response;
	} catch (error: any) {
		return null;
	}
};

export default getLastCreatedBusiness;
