import { cn } from '#/lib/utils';
import Image from 'next/image';

// TODO: Add font for logo text
const Logo = () => {
	return (
    <div className='hidden md:flex items-center gap-x-2'>
      <Image
        src='/images/logo-text-dark.png'
        height={20}
        width={131.5}
        className='hidden dark:block'
        alt='Aurora Logo'
      />
      <Image
        src='/images/logo-text-coloured.png'
        height={20}
        width={131.5}
        className='block dark:hidden'
        alt='Aurora Logo'
      />
    </div>
  );
}

export default Logo;
