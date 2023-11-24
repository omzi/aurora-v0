'use client';

import {
	Bell,
	ChevronLeft,
	LayoutDashboard as Dashboard,
	Info,
	MenuIcon,
	Receipt,
	SearchIcon,
	Settings,
	User,
	Users,
	Wallet
} from 'lucide-react';
import Item from './Item';
import { cn, generateDefaultAvatar } from '#/lib/utils';
import UserItems from './UserItems';
import { useMediaQuery } from 'usehooks-ts';
import { usePathname, useRouter } from 'next/navigation';
import { useSearch } from '#/hooks/useSearch';
import { useSettings } from '#/hooks/useSettings';
import { ElementRef, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import BusinessSwitcher from '../BusinessSwitcher';
import getBusinesses from '#/lib/actions/getBusinesses';
import { Business, SuccessResponse } from '#/common.types';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import UserButton from '../UserButton';
import { Skeleton } from '../ui/skeleton';
import Logo from './Logo';

const Navigation = () => {
	const settings = useSettings();
	const pathname = usePathname();
	const router = useRouter()
  const { data: session } = useSession();
	const isMobile = useMediaQuery('(max-width: 768px)');

	const isResizingRef = useRef(false);
	const sideBarRef = useRef<ElementRef<'aside'>>(null);
	const navBarRef = useRef<ElementRef<'div'>>(null);
	const [isResetting, setIsResetting] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(isMobile);

	useEffect(() => {
		if (isMobile) {
			collapse();
		} else {
			resetWidth();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMobile]);
 
	useEffect(() => {
		if (isMobile) {
			collapse();
		}
	}, [isMobile, pathname]);

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault();
		e.stopPropagation();

		isResizingRef.current = true;
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	}

	const handleMouseMove = (e: MouseEvent) => {
		if (!isResizingRef.current) return;

		let newWidth = e.clientX;

		if (newWidth < 240) newWidth = 240;
		if (newWidth > 360) newWidth = 360;

		if (sideBarRef.current && navBarRef.current) {
			sideBarRef.current.style.width = `${newWidth}px`;
			navBarRef.current.style.setProperty('left', `${newWidth}px`);
			navBarRef.current.style.setProperty('width', `calc(100% - ${newWidth}px)`);
		}
	}

	const handleMouseUp = () => {
		isResizingRef.current = false;
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
	}

	const resetWidth = () => {
		if (sideBarRef.current && navBarRef.current) {
			setIsCollapsed(false);
			setIsResetting(true);

			sideBarRef.current.style.width = isMobile ? '100%' : '240px';
			navBarRef.current.style.setProperty('width', isMobile ? '0' : 'calc(100% - 240px)');
			navBarRef.current.style.setProperty('left', isMobile ? '100%' : '240px');
			setTimeout(() => setIsResetting(false), 300);
		}
	}

	const collapse = () => {
		if (sideBarRef.current && navBarRef.current) {
			setIsCollapsed(true);
			setIsResetting(true);

			sideBarRef.current.style.width = '0';
			navBarRef.current.style.setProperty('width', '100%');
			navBarRef.current.style.setProperty('left', '0');
			setTimeout(() => setIsResetting(false), 300);
		}
	}

  const queryClient = useQueryClient();
	const { data: businesses, isPending } = useQuery({
		queryKey: [`userBusinesses`],
		queryFn: async () => {
			try {
				const response = await getBusinesses() as SuccessResponse<Business[]>;
		
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
					'group/sidebar h-full bg-[#efefef] dark:bg-black overflow-y-auto relative flex w-60 flex-col z-[99999]', isResetting && 'transition-all ease-in-out duration-300', isMobile && 'w-0'
				)}
			>
        <div>
          <div className="flex items-center justify-between">
						{/* <UserItems /> */}
						{isPending ? <BusinessSwitcher.Skeleton /> : <BusinessSwitcher items={businesses} />}
						<div
							role='button'
							onClick={collapse}
							className={cn('h-6 w-6 mr-3 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 opacity-0 group-hover/sidebar:opacity-100 transition', isMobile && 'opacity-100')}
						>
							<ChevronLeft className='h-6 w-6' />
						</div>
					</div>
					<Item
						onClick={() => {}}
						label="Dashboard"
						icon={Dashboard}
						active={pathname === '/dashboard'}
					/>
					{/* <Item
						onClick={() => {}}
						label="Notifications"
						icon={Bell}
					/> */}
					{/* <Item
						onClick={search.onOpen}
						label="Search"
						icon={SearchIcon}
						isSearch
					/> */}
					<Item
						onClick={() => {}}
						label="Customers"
						icon={Users}
						active={pathname.startsWith('/customers') }
					/>
					<Item
						onClick={() => {router.push('/invoices')}}
						label="Invoices"
						icon={Receipt}
						active={pathname.startsWith('/invoices')}
					/>
					<Item
						onClick={() => {}}
						label="Business Info"
						icon={Info}
						active={pathname === '/business'}
					/>
					{/* <Item
						onClick={() => {}}
						label="Withdrawals"
						icon={Wallet}
					/> */}
					<Item
						onClick={settings.onOpen}
						label="Settings"
						icon={Settings}
						active={settings.isOpen}
					/>
					<Item
						onClick={() => {}}
						label="Profile"
						icon={User}
						active={pathname === '/profile'}
					/>
        </div>
        <div
					onMouseDown={handleMouseDown}
					onClick={resetWidth}
					className='opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0'
				/>
      </aside>
			<div
				ref={navBarRef}
				className={cn(
					'fixed top-0 z-[99999] left-60 w-[100%-240px]',
					isResetting && 'transition-all ease-in-out duration-300',
					isMobile && 'left-0 w-full'
				)}
			>                                                                                                                                                           
				<nav className='flex items-center justify-between w-full shadow-ab dark:bg-black px-3 py-2.5'>
					{isCollapsed ? <MenuIcon onClick={resetWidth} role='button' className='h-6 w-6 text-muted-foreground' /> : <div className='h-6 w-6'></div>}
					<div className='w-full flex  justify-start'><div className='scale-[0.85] '><Logo/></div></div>
					{session && session.user ? (
						<UserButton
							profilePicture={session.user.image || generateDefaultAvatar(session.user.email!)}
							profilePictureAlt='Profile picture'
							avatarFallback={session.user.name!}
							fullName={session.user.name!}
							email={session.user.email!}
						/>
					) : <Skeleton className='w-8 h-8 rounded-full' />}
				</nav>
			</div>
    </>
  );
}

export default Navigation;
