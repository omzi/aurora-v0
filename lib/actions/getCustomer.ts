import { request } from '#/lib/utils';
import { Customer } from '#/common.types';

const getCustomer = async (businessId: string, customerId: string) => {
  try {
    const response = await request<Customer>(`/api/getCustomer?businessId=${businessId}&customerId=${customerId}`, 'GET');

    return response;
  } catch (error: any) {
    return null;
  }
};

export default getCustomer;
