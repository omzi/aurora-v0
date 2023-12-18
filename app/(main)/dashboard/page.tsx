import type { Metadata } from 'next';

import Dashboard from '#/app/(main)/dashboard/Dashboard';

export const metadata: Metadata = {
	title: 'Dashboard ~ Aurora',
	description:
    'Optimize your business operations with real-time insights and actionable data.'
};

const Page = () => {
	return <Dashboard />;
};

export default Page;
