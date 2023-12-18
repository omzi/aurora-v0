import { Prisma } from '@prisma/client';

import { Customer } from '#/common.types';
import { request } from '#/lib/utils';

const createCustomer = async (data: Omit<Prisma.CustomerCreateInput, 'userId'>) => {
	try {
		const response = await request<Customer>('/api/customers', 'POST', data);

		return response;
	} catch (error: any) {
		return null;
	}
};

export default createCustomer;
