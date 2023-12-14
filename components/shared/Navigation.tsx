'use client';

import { usePathname, useRouter } from 'next/navigation';

import { ElementRef, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import {
	Bell,
	ChevronLeft,
	Info,
	LayoutDashboard as Dashboard,
	MenuIcon,
	Receipt,
	SearchIcon,
	Settings,
	User,
	Users,
	Wallet
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useMediaQuery } from 'usehooks-ts';

import BusinessSwitcher from '../BusinessSwitcher';
import UserButton from '../UserButton';

import Item from './Item';
import Logo from './Logo';

import { Business, SuccessResponse } from '#/common.types';
import { Skeleton } from '#/components/ui/skeleton';
import { useSearch } from '#/hooks/useSearch';
import { useSettings } from '#/hooks/useSettings';
import getBusinesses from '#/lib/actions/getBusinesses';
import { cn, generateDefaultAvatar } from '#/lib/utils';

const Navigation = () => {
	const router = useRouter();
	const settings = useSettings();
	const pathname = usePathname();
	const { data: session } = useSession();
	const isMobile = useMediaQuery('(max-width: 768px)');

	const isResizingRef = useRef(false);
	const sideBarRef = useRef<ElementRef<'aside'>>(null);
	const navBarRef = useRef<ElementRef<'div'>>(null);
	const [isResetting, setIsResetting] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(isMobile);

	const openSidebar = () => {
		if (sideBarRef.current && navBarRef.current) {
			setIsCollapsed(false);
			setIsResetting(true);

			// Slide in the sidebar from the left
			sideBarRef.current.style.transform = 'translateX(0)';
			sideBarRef.current.style.setProperty('width', isMobile ? '100%' : '240px');

			setTimeout(() => setIsResetting(false), 300);
		}
	};

	const closeSidebar = () => {
		if (sideBarRef.current && navBarRef.current) {
			setIsCollapsed(true);
			setIsResetting(true);

			// Slide out the sidebar to the left
			sideBarRef.current.style.transform = isMobile ? 'translateX(-100%)' : 'translateX(-240px)';
			sideBarRef.current.style.width = '0';

			setTimeout(() => setIsResetting(false), 300);
		}
	};

	const handleCloseSidebar = () => {
		if (isMobile) closeSidebar();
	}

	const { data: businesses, isPending } = useQuery({
		queryKey: [`userBusinesses`],
		queryFn: async () => {
			try {
				const response = (await getBusinesses()) as SuccessResponse<Business[]>;

				console.log('Get Businesses Query :>>', response);
				return response.data;
			} catch (error) {
				toast.error('An error occurred while fetching your businesses ;(');
				throw error;
			}
		}
	});

	return (
		<>
			<aside
				ref={sideBarRef}
				className={cn(
					'group/sidebar h-[100vh] w-full md:w-60 -translate-x-[100%] md:-translate-x-0 bg-[#efefef] dark:bg-black overflow-hidden overflow-y-auto fixed md:relative flex flex-col z-[10]',
					isResetting && 'transition-all ease-in-out duration-300'
				)}
			>
				<div>
					<div className='flex items-center justify-between'>
						{isPending ? (
							<BusinessSwitcher.Skeleton />
						) : (
							<BusinessSwitcher items={businesses} />
						)}
						<div
							role='button'
							onClick={closeSidebar}
							className='h-6 w-6 mr-3 text-muted-foreground rounded-sm hover:bg-neutral-400 dark:hover:bg-neutral-600'
						>
							<ChevronLeft className='h-6 w-6' />
						</div>
					</div>
					<Item
						isLink
						path='/dashboard'
						label='Dashboard'
						icon={Dashboard}
						onClick={handleCloseSidebar}
						active={pathname === '/dashboard'}
					/>
					{/* <Item
						onClick={() => {}}
						label='Notifications'
						icon={Bell}
					/> */}
					{/* <Item
						onClick={search.onOpen}
						label='Search'
						icon={SearchIcon}
						isSearch
					/> */}
					<Item
						isLink
						path='/customers'
						label='Customers'
						icon={Users}
						onClick={handleCloseSidebar}
						active={pathname === '/customers'}
					/>
					<Item
						isLink
						path='/invoices'
						label='Invoices'
						icon={Receipt}
						onClick={handleCloseSidebar}
						active={pathname === '/invoices'}
					/>
					<Item
						isLink
						path='/business'
						label='Business Info'
						icon={Info}
						onClick={handleCloseSidebar}
						active={pathname === '/business'}
					/>
					<Item
						isLink
						path='/withdrawals'
						label='Withdrawals'
						icon={Wallet}
						onClick={handleCloseSidebar}
						active={pathname === '/withdrawals'}
					/>
					<Item
						onClick={settings.onOpen}
						label='Settings'
						icon={Settings}
						active={settings.isOpen}
					/>
					<Item
						isLink
						path='/profile'
						label='Profile'
						icon={User}
						onClick={handleCloseSidebar}
						active={pathname === '/profile'}
					/>
				</div>
				<div className='absolute h-full w-1 bg-primary/10 right-0 top-0'/>
			</aside>
			<div
				ref={navBarRef}
				className={cn(
					'absolute top-0 z-[9] left-0 md:left-60 w-full md:w-[calc(100%-240px)]',
					isResetting && 'transition-all ease-in-out duration-300',
					isCollapsed && '!left-0 !w-full'
				)}
			>
				<nav className={cn(
					'flex items-center justify-between w-full shadow-sm dark:bg-black px-3 py-2.5'
				)}>
					<MenuIcon
						onClick={openSidebar}
						role='button'
						className={cn(
							'h-6 w-6 block md:hidden text-muted-foreground',
							isCollapsed && '!block'
						)}
					/>
					<div className='w-full flex justify-start'>
						<div className='scale-[0.85]'>
							<Logo />
						</div>
					</div>
					{session && session.user ? (
						<UserButton
							profilePicture={session.user.image || generateDefaultAvatar(session.user.email!)}
							profilePictureAlt='Profile picture'
							fullName={session.user.name!}
							email={session.user.email!}
						/>
					) : (
						<Skeleton className='w-8 h-8 rounded-full' />
					)}
				</nav>
			</div>
		</>
	);
};

export default Navigation;
