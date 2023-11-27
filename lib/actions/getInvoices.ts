import { request } from '#/lib/utils';
import { Invoice } from '#/common.types';

const getInvoices = async (businessId: string) => {
  try {
    const response = await request<Invoice[]>(`/api/invoices?businessId=${businessId}`, 'GET');

    return response;
  } catch (error: any) {
    return null;
  }
};

export default getInvoices;
