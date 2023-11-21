'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '#/components/ui/avatar';
import {
	DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '#/components/ui/dropdown-menu';
import Image from 'next/image';
import { ChevronsLeftRight } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import ConfirmLogoutModal from '#/components/modals/ConfirmLogoutModal';
import { generateDefaultAvatar } from '#/lib/utils';

const UserItems = () => {
  const { data: session } = useSession();
	if (!session || !session.user) return;

	const [firstName] = session.user.name!.split(' ');

	return (
		<>
			<DropdownMenu>
				<DropdownMenuContent className='w-80' align='start' alignOffset={10} forceMount>
					<div className='flex flex-col space-y-4 p-2'>
						<p className='text-xs font-medium leading-none text-muted-foreground'>
							{session.user.email}
						</p>
						<div className='flex items-center gap-x-2'>
							<div className='rounded-md bg-secondary p-1'> 
								<Avatar className='h-8 w-8'>
									<AvatarImage src={session.user.image!} />
								</Avatar>
							</div>
							<div className='space-y-1'>
								<p className='text-sm line-clamp-1'>
									{firstName}&apos;s Aurora
								</p>
							</div>
						</div>
					</div>
					<DropdownMenuSeparator />
					<ConfirmLogoutModal onConfirm={signOut}>
						<DropdownMenuItem asChild className='w-full cursor-pointer text-muted-foreground' onClick={() => signOut()}>
							Log Out
						</DropdownMenuItem>
					</ConfirmLogoutModal>
				</DropdownMenuContent>
			</DropdownMenu>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<div role='button' className='inline-flex items-center rounded-md text-sm m-2 bg-primary/10 hover:bg-primary/5'>
						<div className='flex items-center space-x-2 rounded-lg p-2'>
							<Image
								alt='Logo'
								width='24'
								height='24'
								src='/images/logo.png'
								className='rounded-full mr-1'
							/>
							<div className='h-6 rotate-[30deg] border-l border-stone-400 dark:border-stone-500'></div>
							<Image
								alt='Logo'
								width='24'
								height='24'
								src={session.user.image || generateDefaultAvatar(session.user.email!)}
								className='rounded-full !ml-3'
							/>
						</div>
						<ChevronsLeftRight className='rotate-90 mr-2 text-muted-foreground h-4 w-4' />
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent className='w-80' align='start' forceMount>
					<div className='flex flex-col space-y-4 p-2'>
						<p className='text-xs font-medium leading-none text-muted-foreground'>
							{session.user.email}
						</p>
						<div className='flex items-center gap-x-2'>
							<div className='rounded-md bg-secondary p-1'> 
								<Avatar className='h-8 w-8'>
									<AvatarImage src={session.user.image || generateDefaultAvatar(session.user.email!)} />
									<AvatarFallback>{session.user.name}</AvatarFallback>
								</Avatar>
							</div>
							<div className='space-y-1'>
								<p className='text-sm line-clamp-1'>
									{firstName}&apos;s Aurora
								</p>
							</div>
						</div>
					</div>
					<DropdownMenuSeparator />
					<div onClick={() => {}}>
						<DropdownMenuItem className='w-full cursor-pointer text-muted-foreground'>
							Log Out
							<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
						</DropdownMenuItem>
					</div>
				</DropdownMenuContent>
    	</DropdownMenu>
		</>
	)
}

export default UserItems;
