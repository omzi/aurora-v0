import { request } from '#/lib/utils';
import { Customer } from '#/common.types';

const getCustomers = async (businessId: string) => {
  try {
    const response = await request<Customer[]>(`/api/customers?businessId=${businessId}`, 'GET');

    return response;
  } catch (error: any) {
    return null;
  }
};

export default getCustomers;
