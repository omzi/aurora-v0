import type { Metadata } from 'next';
import HomeNavBar from '#/components/shared/HomeNavBar';

export const metadata: Metadata = {
  title: 'Aurora',
  description: 'Your all-in-one solution for simplifying small business payments. ✨'
}

const HomeLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className='h-full'>
      <HomeNavBar />
      <main className='h-full pt-32'>{children}</main>
    </div>
  );
}

export default HomeLayout;