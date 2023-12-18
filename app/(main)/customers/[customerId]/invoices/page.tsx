import type { Metadata } from 'next';

import ViewCustomerInvoices from '#/app/(main)/customers/[customerId]/invoices/ViewCustomerInvoices';

export const metadata: Metadata = {
	title: 'Invoice History ~ Aurora',
	description: 'View customer invoice history'
};

const Page = () => {
	return <ViewCustomerInvoices />;
};

export default Page;
