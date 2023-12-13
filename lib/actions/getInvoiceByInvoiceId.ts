import { Invoice } from '#/common.types';
import { request } from '#/lib/utils';

const getInvoiceByInvoiceId = async (invoiceId: string) => {
	try {
		const response = await request<Invoice[]>(`/api/getInvoiceByInvoiceId?invoiceId=${invoiceId}`, 'GET');

		return response;
	} catch (error: any) {
		return null;
	}
};

export default getInvoiceByInvoiceId;
