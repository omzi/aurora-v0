import { request } from '#/lib/utils';
import { Invoice } from '#/common.types';

const getInvoiceByInvoiceId = async (invoiceId: string) => {
  try {
    const response = await request<Invoice[]>(`/api/getInvoiceByInvoiceId?invoiceId=${invoiceId}`, 'GET');

    return response;
  } catch (error: any) {
    return null;
  }
};

export default getInvoiceByInvoiceId;
