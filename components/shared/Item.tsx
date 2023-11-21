'use client';

import { cn } from '#/lib/utils';
import { LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '#/components/ui/skeleton';

interface ItemProps {
	label: string;
	onClick?: () => void;
	icon: LucideIcon;
	active?: boolean;
	isSearch?: boolean;
	level?: number;
}

const Item = ({
	label,
	onClick,
	icon: Icon,
	active,
	isSearch
}: ItemProps) => {
	const router = useRouter();

	return (
    <div
      onClick={onClick}
      role='button'
      className={cn(
        'group min-h-[24px] text-sm px-3 py-3 w-full hover:bg-primary/5 flex items-center text-dark-1 dark:text-light-2 font-medium',
        active && 'bg-primary/5 text-primary'
      )}
    >
      <Icon className='shrink-0 h-[18px] mr-2 text-muted-foreground' />
      <span className='truncate'>{label}</span>
      {isSearch && (
        <kbd className='ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100'>
          <span className='text-xs'>⌘</span>K
        </kbd>
      )}
    </div>
  );
}

export default Item;

Item.Skeleton = function ItemSkeleton() {
	return (
		<div className='flex items-center gap-x-2 py-3 pl-3 pr-4'>
			<Skeleton className='h-4 w-4 rounded mr-1' />
			<Skeleton className='h-4 w-4 rounded mr-1' />
			<Skeleton className='h-4 rounded flex-1' />
		</div>
	)
}