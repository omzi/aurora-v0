import type { Metadata } from 'next';

import Business from '#/app/(main)/business/Business';

export const metadata: Metadata = {
	title: 'Your Business Info ~ Aurora',
	description: 'Effortlessly manage and update crucial business details'
};

const Page = () => {
	return <Business />;
};

export default Page;
