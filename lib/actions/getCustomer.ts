import { GetCustomerResponse } from '#/common.types';
import { request } from '#/lib/utils';

const getCustomer = async (businessId: string, customerId: string) => {
	try {
		const response = await request<GetCustomerResponse>(`/api/getCustomer?businessId=${businessId}&customerId=${customerId}`, 'GET');

		return response;
	} catch (error: any) {
		return null;
	}
};

export default getCustomer;
