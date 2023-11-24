'use client';

import Logo from './Logo';
import { useSession } from 'next-auth/react';
import UserButton from '#/components/UserButton';
import ModeToggle from '#/components/ModeToggle';
import { useScrollTop } from '#/hooks/useScrollTop';
import { cn, generateDefaultAvatar } from '#/lib/utils';

const HomeNavBar = () => {
	const scrolled = useScrollTop();
  const { data: session } = useSession();

	return (
    <div
      className={cn(
        'z-50 bg-background fixed top-0 flex items-center w-full p-6 transition-colors',
        scrolled && 'border-b shadow-sm bg-[#efefef] dark:bg-[#1f1f1f]'
      )}
    >
      <Logo />
      <div className='md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2'>
        <ModeToggle />
        {session && session.user && (
          <UserButton
            profilePicture={session.user.image || generateDefaultAvatar(session.user.email!)}
            profilePictureAlt='Profile picture'
            fullName={session.user.name!}
            email={session.user.email!}
          />
        )}
      </div>
    </div>
  );
}

export default HomeNavBar;
