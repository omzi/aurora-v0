import type { Metadata } from 'next';

import NewInvoice from '#/app/(main)/invoices/new/NewInvoice';

export const metadata: Metadata = {
	title: 'Create Invoice ~ Aurora',
	description: 'Create and send professional invoices effortlessly'
};

const Page = () => {
	return <NewInvoice />;
};

export default Page;
