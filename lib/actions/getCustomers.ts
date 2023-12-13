import { Customer } from '#/common.types';
import { request } from '#/lib/utils';

const getCustomers = async (businessId: string) => {
	try {
		const response = await request<Customer[]>(`/api/customers?businessId=${businessId}`, 'GET');

		return response;
	} catch (error: any) {
		return null;
	}
};

export default getCustomers;
