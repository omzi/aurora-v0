'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '#/components/ui/avatar';
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
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { ExternalLinkIcon } from 'lucide-react';
import { Button } from '#/components/ui/button';
import ConfirmLogoutModal from '#/components/modals/ConfirmLogoutModal';
import { Skeleton } from './ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { DialogTrigger } from './ui/dialog';

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

  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation();
		signOut()
	}

  return (
    <AlertDialog>
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={profilePicture} alt={profilePictureAlt} />
            <AvatarFallback><Skeleton className='w-8 h-8 rounded-full' /></AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1 gap-2'>
            <p className='text-base font-medium leading-none'>{fullName}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href='/dashboard'>
            <DropdownMenuItem>Dashboard</DropdownMenuItem>
          </Link>
          <Link href='https://github.com/omzi/aurora' target='_blank'>
            <DropdownMenuItem>
              About
              <DropdownMenuShortcut>
                <ExternalLinkIcon size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
          <AlertDialogTrigger className='w-full'>
          <DropdownMenuItem>
            Log Out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
          </AlertDialogTrigger>
      </DropdownMenuContent>
    </DropdownMenu>
    <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Log Out</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default UserButton;
