import type { Metadata } from 'next';

import Customers from '#/app/(main)/customers/Customers';

export const metadata: Metadata = {
	title: 'Customers ~ Aurora',
	description: `Build strong customer relationships and streamline interactions.`
};

const Page = () => {
	return <Customers />;
};

export default Page;
