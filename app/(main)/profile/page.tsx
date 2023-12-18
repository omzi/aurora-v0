import type { Metadata } from 'next';

import Profile from '#/app/(main)/profile/Profile';

export const metadata: Metadata = {
	title: 'Edit Profile ~ Aurora',
	description: 'Edit your Aurora profile.'
};

const Page = () => {
	return <Profile />;
};

export default Page;
