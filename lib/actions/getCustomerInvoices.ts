import { SelectedInvoiceFields } from '#/common.types';
import { request } from '#/lib/utils';

const getCustomerInvoices = async (businessId: string, customerId: string) => {
	try {
		const response = await request<SelectedInvoiceFields[]>(`/api/getCustomer/invoices?businessId=${businessId}&customerId=${customerId}`, 'GET');

		return response;
	} catch (error: any) {
		return null;
	}
};

export default getCustomerInvoices;
