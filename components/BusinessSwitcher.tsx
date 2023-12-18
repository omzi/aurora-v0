'use client';

import * as React from 'react';
import { ComponentPropsWithoutRef, useState } from 'react';
import { Check, ChevronsUpDown, PlusCircle, Store } from 'lucide-react';

import { Business } from '#/common.types';
import { useUserContext } from '#/components/contexts/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar';
import { Button } from '#/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator
} from '#/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '#/components/ui/popover';
import { Skeleton } from '#/components/ui/skeleton';
import { useBusinessModal } from '#/hooks/useBusinessModal';
import { cn } from '#/lib/utils';

type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface BusinessSwitcherProps extends PopoverTriggerProps {
	items?: Business[];
}

const BusinessSwitcher = ({ className, items = [] }: BusinessSwitcherProps) => {
	const [open, setOpen] = useState(false);
	const businessModal = useBusinessModal();
	const { selectedBusiness, selectBusiness } = useUserContext();
	const currentBusiness = items.find(item => item.id === selectedBusiness?.id);

	const onBusinessSelect = (business: Business) => {
		setOpen(false);
		selectBusiness(business);
		window.location.reload();
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					role="combobox"
					aria-expanded={open}
					aria-label="Select a business"
					className={cn('w-[200px] justify-between m-2', className)}
				>
					{currentBusiness?.logo ? (
						<Avatar className="mr-2 h-4 w-4">
							<AvatarImage
								src={currentBusiness.logo}
								alt={currentBusiness.name}
							/>
							<AvatarFallback>
								<Skeleton className="h-4 w-4 rounded" />
							</AvatarFallback>
						</Avatar>
					) : (
						<Store className="mr-2 h-4 w-4" />
					)}
					{currentBusiness?.name}
					<ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0 ml-2">
				<Command>
					<CommandList>
						<CommandInput placeholder="Search businesses..." />
						<CommandEmpty>No business found.</CommandEmpty>
						<CommandGroup heading="Businesses">
							{items.map(business => (
								<CommandItem
									key={business.id}
									onSelect={() => onBusinessSelect(business)}
									className="text-sm"
								>
									{business.logo ? (
										<Avatar className="mr-2 h-4 w-4">
											<AvatarImage src={business.logo} alt={business.name} />
											<AvatarFallback>
												<Skeleton className="h-4 w-4 rounded" />
											</AvatarFallback>
										</Avatar>
									) : (
										<Store className="mr-2 h-4 w-4" />
									)}
									{business.name}
									<Check
										className={cn(
											'ml-auto h-4 w-4',
											currentBusiness?.id === business.id
												? 'opacity-100'
												: 'opacity-0'
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
					<CommandSeparator />
					<CommandList>
						<CommandGroup>
							<CommandItem
								onSelect={() => {
									setOpen(false);
									businessModal.onOpen();
								}}
							>
								<PlusCircle className="mr-2 h-4 w-4" />
								Create Business
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default BusinessSwitcher;

BusinessSwitcher.Skeleton = function BusinessSwitcherSkeleton() {
	return (
		<Button
			variant="outline"
			size="sm"
			className="w-[200px] justify-between m-2"
		>
			<Skeleton className="mr-2 h-4 w-4 rounded" />
			<Skeleton className="h-4 w-4 rounded flex-1" />
			<Skeleton className="ml-2 h-4 w-4 rounded" />
		</Button>
	);
};
