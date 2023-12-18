import type { Metadata } from 'next';

import ViewCustomer from '#/app/(main)/customers/[customerId]/ViewCustomer';

export const metadata: Metadata = {
	title: 'Customer Overview ~ Aurora',
	description: 'View customer information and handy analytics about a customer'
};

const Page = () => {
	return <ViewCustomer />;
};

export default Page;
