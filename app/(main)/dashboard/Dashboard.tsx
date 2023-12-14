'use client';

import {
	AreaChart,
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
	UsersIcon,
	WalletIcon
} from 'lucide-react';

import { useUserContext } from '#/components/contexts/UserContext';
import { Skeleton } from '#/components/ui/skeleton';
import useDashboard from '#/hooks/useDashboard';

const Dashboard = () => {
	const { selectedBusiness } = useUserContext();
	const { analytics, isAnalyticsLoading, charts, isChartsLoading } = useDashboard();

	const valueFormatter = (number: number) => `₦ ${new Intl.NumberFormat('us').format(number).toString()}`;

	return (
		<div className='min-h-full max-w-[1560px] mx-auto pt-6 pb-8 flex flex-col items-center justify-start space-y-7'>
			<Grid numItemsMd={2} numItemsLg={4} className='gap-6 w-[calc(100%-50px)]'>
				{isAnalyticsLoading ? (
					Array.from({ length: 4 }).map((_, idx) => (
						<Card key={idx} className='flex p-4 ring-0' decoration='top' decorationColor='gray'>
							<Flex alignItems='center' justifyContent='start' className='gap-4'>
								<Skeleton className='w-[44px] h-[44px] rounded-full' />
								<div className='truncate flex-1'>
									<Skeleton className='w-full h-3 rounded-sm' />
									<Skeleton className='w-full h-9 mt-2 rounded-sm' />
								</div>
							</Flex>
						</Card>
					))
				) : (
					<>
						{/* Total Customers Card */}
						<Card className='p-4 ring-0' decoration='top' decorationColor='blue' key='Total Customers'>
							<Flex alignItems='center' justifyContent='start' className='gap-4'>
								<Icon
									icon={UsersIcon}
									className='rounded-tremor-full'
									color='blue'
									variant='light'
									size='lg'
								/>
								<div className='truncate'>
									<Text>Total Customers</Text>
									<Metric className='truncate'>{analytics?.customers}</Metric>
								</div>
							</Flex>
						</Card>
						{/* Total Revenue Card */}
						<Card className='p-4 ring-0' decoration='top' decorationColor='green' key='Total Revenue'>
							<Flex alignItems='center' justifyContent='start' className='gap-4'>
								<Icon
									icon={BanknoteIcon}
									className='rounded-tremor-full'
									color='green'
									variant='light'
									size='lg'
								/>
								<div className='truncate'>
									<Text>Total Revenue</Text>
									<Metric className='truncate'>₦ {analytics?.revenue}</Metric>
								</div>
							</Flex>
						</Card>
						{/* Total Outstanding Card */}
						<Card className='p-4 ring-0' decoration='top' decorationColor='red' key='Total Outstanding'>
							<Flex alignItems='center' justifyContent='start' className='gap-4'>
								<Icon
									icon={LandmarkIcon}
									className='rounded-tremor-full'
									color='red'
									variant='light'
									size='lg'
								/>
								<div className='truncate'>
									<Text>Total Outstanding</Text>
									<Metric className='truncate'>₦ {analytics?.outstanding}</Metric>
								</div>
							</Flex>
						</Card>
						{/* Total Withdrawn Card */}
						<Card className='p-4 ring-0' decoration='top' decorationColor='yellow' key='Total Withdrawn'>
							<Flex alignItems='center' justifyContent='start' className='gap-4'>
								<Icon
									icon={WalletIcon}
									className='rounded-tremor-full'
									color='yellow'
									variant='light'
									size='lg'
								/>
								<div className='truncate'>
									<Text>Total Withdrawn</Text>
									<Metric className='truncate'>₦ {analytics?.withdrawals}</Metric>
								</div>
							</Flex>
						</Card>
					</>
				)}
			</Grid>
			<div className='mt-24 w-[calc(100%-50px)]'>
				{isChartsLoading ? (
					<Card>
						<Skeleton className='w-1/2 h-5 rounded-sm' />
						<Skeleton className='w-full h-[24rem] mt-2 rounded-sm' />
					</Card>
				) : (
					<Card>
						<Title>Monthly Revenue Trends</Title>
						<AreaChart
							className='h-[24rem]'
							data={charts as unknown as any[]}
							index='month'
							categories={['Monthly Revenue']}
							colors={['blue']}
							valueFormatter={valueFormatter}
							yAxisWidth={95}
						/>
					</Card>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
