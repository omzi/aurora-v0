import type { Metadata } from 'next';
import SignIn from '#/app/auth/sign-in/SignIn';

export const metadata: Metadata = {
  title: 'Sign In ~ Aurora',
  description: 'Sign in to your Aurora account'
};

const Page = () => {
	return ( <SignIn /> );
}

export default Page;
