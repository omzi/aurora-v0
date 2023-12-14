/* eslint-disable no-undef */
'use client';

import { usePathname, useRouter } from 'next/navigation';

import { ElementRef, MouseEvent as ReactMouseEvent, useEffect, useRef, useState } from 'react';
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

	const navigateTo = (path: string) => {
		router.push(path);
	};

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

	const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault();
		e.stopPropagation();

		isResizingRef.current = true;
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!isResizingRef.current) return;

		let newWidth = e.clientX;

		if (newWidth < 240) newWidth = 240;
		if (newWidth > 360) newWidth = 360;

		if (sideBarRef.current && navBarRef.current) {
			sideBarRef.current.style.width = `${newWidth}px`;
			navBarRef.current.style.setProperty('left', `${newWidth}px`);
			navBarRef.current.style.setProperty(
				'width',
				`calc(100% - ${newWidth}px)`
			);
		}
	};

	const handleMouseUp = () => {
		isResizingRef.current = false;
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
	};

	const resetWidth = () => {
		if (sideBarRef.current && navBarRef.current) {
			setIsCollapsed(false);
			setIsResetting(true);

			sideBarRef.current.style.width = isMobile ? '100%' : '240px';
			navBarRef.current.style.setProperty(
				'width',
				isMobile ? '0' : 'calc(100% - 240px)'
			);
			navBarRef.current.style.setProperty('left', isMobile ? '100%' : '240px');
			setTimeout(() => setIsResetting(false), 300);
		}
	};

	const collapse = () => {
		if (sideBarRef.current && navBarRef.current) {
			setIsCollapsed(true);
			setIsResetting(true);

			sideBarRef.current.style.width = '0';
			navBarRef.current.style.setProperty('width', '100%');
			navBarRef.current.style.setProperty('left', '0');
			setTimeout(() => setIsResetting(false), 300);
		}
	};

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
					'group/sidebar h-[100vh] bg-[#efefef] dark:bg-black overflow-y-auto relative flex w-60 flex-col z-[10]',
					isResetting && 'transition-all ease-in-out duration-300',
					isMobile && 'w-0'
				)}
			>
				<div>
					<div className="flex items-center justify-between">
						{isPending ? (
							<BusinessSwitcher.Skeleton />
						) : (
							<BusinessSwitcher items={businesses} />
						)}
						<div
							role="button"
							onClick={collapse}
							className={cn(
								'h-6 w-6 mr-3 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 opacity-0 group-hover/sidebar:opacity-100 transition',
								isMobile && 'opacity-100'
							)}
						>
							<ChevronLeft className="h-6 w-6" />
						</div>
					</div>
					<Item
						isLink
						path="/dashboard"
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
						isLink
						path="/customers"
						label="Customers"
						icon={Users}
						active={pathname.startsWith('/customers')}
					/>
					<Item
						isLink
						path="/invoices"
						label="Invoices"
						icon={Receipt}
						active={pathname === '/invoices'}
					/>
					<Item
						isLink
						path="/business"
						label="Business Info"
						icon={Info}
						active={pathname === '/business'}
					/>
					<Item
						isLink
						path="/withdrawals"
						label="Withdrawals"
						icon={Wallet}
						active={pathname === '/withdrawals'}
					/>
					<Item
						onClick={settings.onOpen}
						label="Settings"
						icon={Settings}
						active={settings.isOpen}
					/>
					<Item
						isLink
						path='/profile'
						label='Profile'
						icon={User}
						active={pathname === '/profile'}
					/>
				</div>
				<div
					onMouseDown={handleMouseDown}
					onClick={resetWidth}
					className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
				/>
			</aside>
			<div
				ref={navBarRef}
				className={cn(
					'absolute top-0 z-[9] left-60 w-[calc(100%-240px)]',
					isResetting && 'transition-all ease-in-out duration-300',
					isMobile && 'left-0 w-full'
				)}
			>
				<nav className="flex items-center justify-between w-full shadow-ab dark:bg-black px-3 py-2.5">
					{isCollapsed && (
						<MenuIcon
							onClick={resetWidth}
							role="button"
							className="h-6 w-6 text-muted-foreground"
						/>
					)}
					<div className="w-full flex justify-start">
						<div className="scale-[0.85] ">
							<Logo />
						</div>
					</div>
					{session && session.user ? (
						<UserButton
							profilePicture={
								session.user.image || generateDefaultAvatar(session.user.email!)
							}
							profilePictureAlt="Profile picture"
							fullName={session.user.name!}
							email={session.user.email!}
						/>
					) : (
						<Skeleton className="w-8 h-8 rounded-full" />
					)}
				</nav>
			</div>
		</>
	);
};

export default Navigation;
