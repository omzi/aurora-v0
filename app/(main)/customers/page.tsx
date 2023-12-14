import type { Metadata } from 'next';

import Customers from '#/app/(main)/customers/Customers';

export const metadata: Metadata = {
	title: 'Customers ~ Aurora',
	description: `Build strong customer relationships and streamline interactions with Aurora's customer management tools.`
};

const Page = () => {
	return <Customers />;
};

export default Page;
