'use client';

import Image from 'next/image';
import Link from 'next/link';

import {
	AreaChart,
	BadgeDelta,
	Card,
	Flex,
	Grid,
	Icon,
	Metric,
	Text,
	Title
} from '@tremor/react';
import {
	BanknoteIcon,
	LandmarkIcon,
	PlusIcon,
	StoreIcon,
	UserIcon,
	UsersIcon,
	WalletIcon
} from 'lucide-react';
import { useSession } from 'next-auth/react';

import { useUserContext } from '#/components/contexts/UserContext';
import { Button } from '#/components/ui/button';
import { Skeleton } from '#/components/ui/skeleton';
import { useBusinessModal } from '#/hooks/useBusinessModal';
import { useCustomerModal } from '#/hooks/useCustomerModal';
import useDashboard from '#/hooks/useDashboard';
import { chartColors, formatPercentageDelta } from '#/lib/utils';

const Dashboard = () => {
	const { data: session } = useSession();
	const customerModal = useCustomerModal();
	const { selectedBusiness } = useUserContext();
	const { analytics, isAnalyticsLoading, charts, isChartsLoading } = useDashboard();

	const valueFormatter = (number: number) => `₦ ${new Intl.NumberFormat('us').format(number).toString()}`;

	return (
		<div className=' w-[calc(100%-50px)] max-w-[1560px] mx-auto pt-6 pb-8 flex flex-col sm:grid-cols-2 lg:grid lg:grid-cols-3 gap-6 py-4'>
			{session && session.user ? (
				<Card className='md:col-span-1 max-h-[275px] min-w-[9rem] md:max-h-[420px] h-full relative z-[1]'>
					<div className='flex flex-col justify-between h-full'>
						<div>
							<h2 className='text-xl font-bold'>👋🏽 Hi, {session?.user?.name?.split(' ').shift()}!</h2>
							<div className='flex flex-row justify-between mt-5 mb-4 gap-2 items-center text-start'>
								<p className='mb-2 leading-1.5'>Ready to streamline your business payments? Explore quick actions below.</p>
								<Image
									src='/images/money-target.png'
									alt='Business Financial Target'
									height={100}
									width={100}
									className='mr-2 hidden  lg:hidden'
								/>
							</div>
						</div>
						<div className='flex flex-col gap-3 sm:flex-row lg:flex-col sm:gap-5 lg:gap-3'>
							<Link href='/invoices/new'>
								<Button variant='secondary' className='mt-0 h-auto py-1 px-3 bg-core hover:bg-blue-800 text-white'>
									<PlusIcon className='h-4 w-4 mr-2' />
									Create An Invoice
								</Button>
							</Link>
							<Button onClick={customerModal.onOpen} className='mt-0 max-w-[10rem] h-auto py-1 px-3 bg-core hover:bg-blue-800 text-white'>
								<UserIcon className='h-4 w-4 mr-2' />
								Add A Customer
							</Button>
						</div>
					</div>
					<Image
						src='/images/money-target.png'
						alt='...'
						height={150}
						width={150}
						className='absolute right-2.5 bottom-2.5 lg:bottom-12 z-[-1] opacity-60 lg:scale-75 lg:opacity-80 block '
					/>
				</Card>
			) : (
				<Card className='md:col-span-1 max-h-[275px] min-w-[9rem] md:max-h-[420px] h-full relative z-[1]'>
					<div className='flex flex-col justify-between h-full'>
						<div>
							<Skeleton className='w-2/3 h-8 rounded-md' />
							<Skeleton className='w-full h-20 md:h-28 mt-6 mb-4 rounded-md' />
						</div>
						<div>
							<Skeleton className='w-2/3 h-6 rounded-md' />
							<Skeleton className='w-2/3 h-6 rounded-md mt-2' />
						</div>
					</div>
					<Image
						src='/images/money-target.png'
						alt='...'
						height={175}
						width={175}
						className='absolute right-2.5 bottom-2.5 z-[-1] opacity-20 block lg:hidden'
					/>
				</Card>
			)}
			<Grid numItemsSm={1} numItemsMd={2} className='md:col-span-2 gap-6 h-full md:max-h-[420px]'>
				{isAnalyticsLoading ? (
					Array.from({ length: 4 }).map((_, idx) => (
						<Card key={idx} className='flex flex-col p-4 ring-0' decoration='top' decorationColor='gray'>
							<Flex alignItems='center' justifyContent='start' className='gap-2'>
								<Skeleton className='w-6 h-6 rounded-full' />
								<Skeleton className='w-full h-4 rounded-sm' />
							</Flex>
							<Skeleton className='w-full h-8 mt-2 rounded-sm' />
							<div className='flex justify-start items-center space-x-2 mt-2'>
								<Skeleton className='w-9 h-6 rounded-xl' />
								<Skeleton className='w-full h-4 rounded-sm' />
							</div>
						</Card>
					))
				) : (
					<>
						{/* Total Customers Card */}
						<Card className='p-4 ring-0' decoration='top' decorationColor='blue' key='Total Customers'>
							<Flex alignItems='center' justifyContent='start' className='gap-2'>
								<Icon
									icon={UsersIcon}
									className='rounded-tremor-full'
									color='blue'
									variant='light'
									size='xs'
								/>
								<Text>Total Customers</Text>
							</Flex>
							<Metric className='truncate mt-2'>{analytics?.customers.count}</Metric>
							<div className='flex justify-start items-center space-x-2 mt-2'>
								<BadgeDelta deltaType={formatPercentageDelta(analytics?.customers.monthlyPercentageChange!).deltaType} />
								<div className='flex justify-start space-x-1 truncate'>
									<Text color={chartColors[formatPercentageDelta(analytics?.customers.monthlyPercentageChange!).deltaType] as any}>
										{formatPercentageDelta(analytics?.customers.monthlyPercentageChange!).absoluteValue}%
									</Text>
									<Text>from previous month</Text>
								</div>
							</div>
						</Card>
						{/* Total Revenue Card */}
						<Card className='p-4 ring-0' decoration='top' decorationColor='green' key='Total Revenue'>
							<Flex alignItems='center' justifyContent='start' className='gap-2'>
								<Icon
									icon={BanknoteIcon}
									className='rounded-tremor-full'
									color='green'
									variant='light'
									size='xs'
								/>
								<Text>Total Revenue</Text>
							</Flex>
							<Metric className='truncate mt-2'>₦ {analytics?.revenue.amount}</Metric>
							<div className='flex justify-start items-center space-x-2 mt-2'>
								<BadgeDelta deltaType={formatPercentageDelta(analytics?.revenue.monthlyPercentageChange!).deltaType} />
								<div className='flex justify-start space-x-1 truncate'>
									<Text color={chartColors[formatPercentageDelta(analytics?.revenue.monthlyPercentageChange!).deltaType] as any}>
										{formatPercentageDelta(analytics?.revenue.monthlyPercentageChange!).absoluteValue}%
									</Text>
									<Text>from previous month</Text>
								</div>
							</div>
						</Card>
						{/* Total Outstanding Card */}
						<Card className='p-4 ring-0' decoration='top' decorationColor='red' key='Total Outstanding'>
							<Flex alignItems='center' justifyContent='start' className='gap-2'>
								<Icon
									icon={LandmarkIcon}
									className='rounded-tremor-full'
									color='red'
									variant='light'
									size='xs'
								/>
								<Text>Total Outstanding</Text>
							</Flex>
							<Metric className='truncate mt-2'>₦ {analytics?.outstanding.amount}</Metric>
							<div className='flex justify-start items-center space-x-2 mt-2'>
								<BadgeDelta deltaType={formatPercentageDelta(analytics?.outstanding.monthlyPercentageChange!).deltaType} />
								<div className='flex justify-start space-x-1 truncate'>
									<Text color={chartColors[formatPercentageDelta(analytics?.outstanding.monthlyPercentageChange!).deltaType] as any}>
										{formatPercentageDelta(analytics?.outstanding.monthlyPercentageChange!).absoluteValue}%
									</Text>
									<Text>from previous month</Text>
								</div>
							</div>
						</Card>
						{/* Total Withdrawn Card */}
						<Card className='p-4 ring-0' decoration='top' decorationColor='yellow' key='Total Withdrawn'>
							<Flex alignItems='center' justifyContent='start' className='gap-2'>
								<Icon
									icon={WalletIcon}
									className='rounded-tremor-full'
									color='yellow'
									variant='light'
									size='xs'
								/>
								<Text>Total Withdrawn</Text>
							</Flex>
							<Metric className='truncate mt-2'>₦ {analytics?.withdrawals.amount}</Metric>
							<div className='flex justify-start items-center space-x-2 mt-2'>
								<BadgeDelta deltaType={formatPercentageDelta(analytics?.withdrawals.monthlyPercentageChange!).deltaType} />
								<div className='flex justify-start space-x-1 truncate'>
									<Text color={chartColors[formatPercentageDelta(analytics?.withdrawals.monthlyPercentageChange!).deltaType] as any}>
										{formatPercentageDelta(analytics?.withdrawals.monthlyPercentageChange!).absoluteValue}%
									</Text>
									<Text>from previous month</Text>
								</div>
							</div>
						</Card>
					</>
				)}
			</Grid>
			<div className='md:col-span-3'>
				{isChartsLoading ? (
					<Card>
						<Skeleton className='w-1/2 h-7 mb-4 rounded-sm' />
						<Skeleton className='w-full h-[24rem] mt-4 rounded-sm' />
					</Card>
				) : (
					<Card>
						<Title className='mb-4'>Monthly Revenue Trends</Title>
						<AreaChart
							className='h-[24rem]'
							data={charts as unknown as any[]}
							index='month'
							categories={['Monthly Revenue']}
							colors={['blue']}
							valueFormatter={valueFormatter}
							yAxisWidth={95}
							showLegend={false}
						/>
					</Card>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
