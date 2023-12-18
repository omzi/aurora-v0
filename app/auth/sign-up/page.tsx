import type { Metadata } from 'next';

import SignUp from '#/app/auth/sign-up/SignUp';

export const metadata: Metadata = {
	title: 'Sign Up ~ Aurora',
	description: 'Sign up for a FREE Aurora account'
};

const Page = () => {
	return <SignUp />;
};

export default Page;
