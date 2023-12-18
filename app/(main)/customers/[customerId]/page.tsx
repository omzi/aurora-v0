import type { Metadata } from 'next';

import Customers from '#/app/(main)/customers/[customerId]/ViewCustomer';

export const metadata: Metadata = {
	title: 'Customer Overview ~ Aurora',
	description: 'View customer information and handy analytics about a customer'
};

const Page = () => {
	return <Customers />;
};

export default Page;
