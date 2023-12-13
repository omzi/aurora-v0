import type { Metadata } from 'next';

import ForgotPassword from '#/app/auth/forgot-password/ForgotPassword';

export const metadata: Metadata = {
	title: 'Forgot Your Password? ~ Aurora',
	description: 'Request a link to reset your password'
};

const Page = () => {
	return <ForgotPassword />;
};

export default Page;
