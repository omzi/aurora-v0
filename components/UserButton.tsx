'use client';

import Link from 'next/link';

import { MouseEvent as ReactMouseEvent } from 'react';
import { AlertTriangleIcon, ExternalLinkIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from './ui/alert-dialog';

import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar';
import { Button } from '#/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger
} from '#/components/ui/dropdown-menu';
import { Skeleton } from '#/components/ui/skeleton';

interface UserButtonProps {
	profilePicture: string;
	profilePictureAlt: string;
	fullName: string;
	email: string;
}

const UserButton = ({
	profilePicture,
	profilePictureAlt,
	fullName,
	email
}: UserButtonProps) => {
	const logout = () => signOut();

	const handleConfirm = (
		e: ReactMouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.stopPropagation();
		signOut();
	};

	return (
		<AlertDialog>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="relative h-8 w-8 rounded-full">
						<Avatar className="h-8 w-8">
							<AvatarImage src={profilePicture} alt={profilePictureAlt} />
							<AvatarFallback>
								<Skeleton className="w-8 h-8 rounded-full" />
							</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end" forceMount>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1 gap-2">
							<p className="text-base font-medium leading-none">{fullName}</p>
							<p className="text-xs leading-none text-muted-foreground">
								{email}
							</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<Link href="/dashboard">
							<DropdownMenuItem>Dashboard</DropdownMenuItem>
						</Link>
						<Link href="https://github.com/omzi/aurora" target="_blank">
							<DropdownMenuItem>
								About
								<DropdownMenuShortcut>
									<ExternalLinkIcon size={16} />
								</DropdownMenuShortcut>
							</DropdownMenuItem>
						</Link>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<AlertDialogTrigger className="w-full">
						<DropdownMenuItem>
							Log Out
							<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
						</DropdownMenuItem>
					</AlertDialogTrigger>
				</DropdownMenuContent>
			</DropdownMenu>
			<AlertDialogContent>
				<AlertDialogHeader>
					<div className="sm:flex sm:items-start">
						<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
							<AlertTriangleIcon className="h-6 w-6 text-red-600" />
						</div>
						<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
							<h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">
								Confirm log out
							</h3>
							<div className="mt-2">
								<p className="text-sm text-gray-500">
									Are you sure you want to log out? You will be signed out of
									your account, and any unsaved changes may be lost.
								</p>
							</div>
						</div>
					</div>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleConfirm}>Log Out</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default UserButton;
