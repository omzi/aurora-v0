import type { Metadata } from 'next';

import Withdrawals from '#/app/(main)/withdrawals/Withdrawals';

export const metadata: Metadata = {
	title: 'Withdrawals ~ Aurora',
	description: 'Initiate and track your business withdrawals.'
};

const Page = () => {
	return <Withdrawals />;
};

export default Page;
