import type { Metadata } from 'next';

import Invoices from '#/app/(main)/invoices/Invoices';

export const metadata: Metadata = {
	title: 'Invoices ~ Aurora',
	description: 'Manages invoices and track payments.'
};

const Page = () => {
	return <Invoices />;
};

export default Page;
