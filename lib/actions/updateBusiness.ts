import { Prisma } from '@prisma/client';

import { Business } from '#/common.types';
import { request } from '#/lib/utils';

const updateBusiness = async (data: Prisma.BusinessUpdateInput) => {
	try {
		const response = await request<Business>('/api/business', 'PUT', data);

		return response;
	} catch (error: any) {
		return null;
	}
};

export default updateBusiness;
