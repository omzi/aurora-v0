'use client';

import {
  Card,
  Flex,
  Grid,
  Icon,
  AreaChart,
  Metric,
  Text,
  Title
} from '@tremor/react';
import { BanknoteIcon, UsersIcon } from 'lucide-react';

const DummyDashboard = () => {
  const chartData = [
    {
      month: 'Jan',
      'Monthly Revenue': 409200
    },
    {
      month: 'Feb',
      'Monthly Revenue': 889150
    },
    {
      month: 'Mar',
      'Monthly Revenue': 796000
    },
    {
      month: 'Apr',
      'Monthly Revenue': 1231400
    },
    {
      month: 'May',
      'Monthly Revenue': 257500
    }
  ];
	const valueFormatter = (number: number) => `₦ ${new Intl.NumberFormat('us').format(number).toString()}`;

	return (
    <div className='flex flex-col items-center justify-center mt-5 mb-10 space-y-7'>
      <Grid numItemsMd={2} className='gap-6 w-[calc(100%-50px)]'>
        {/* Total Customers Card */}
        <Card className='p-4' key='Total Customers'>
          <Flex alignItems='center' justifyContent='start' className='gap-4'>
            <Icon
              icon={UsersIcon}
              className='rounded-tremor-full'
              color='blue'
              variant='shadow'
              size='lg'
            />
            <div className='truncate'>
              <Text>Total Customers</Text>
              <Metric className='truncate'>12,519</Metric>
            </div>
          </Flex>
        </Card>
        {/* Total Revenue Card */}
        <Card className='p-4' key='Total Revenue'>
          <Flex alignItems='center' justifyContent='start' className='gap-4'>
            <Icon
              icon={BanknoteIcon}
              className='rounded-tremor-full'
              color='green'
              variant='shadow'
              size='lg'
            />
            <div className='truncate'>
              <Text>Total Revenue</Text>
              <Metric className='truncate'>₦ 218,175,500</Metric>
            </div>
          </Flex>
        </Card>
      </Grid>
      <div className='mt-24 w-[calc(100%-50px)]'>
        <Card>
          <Title>Monthly Revenue Trends</Title>
          <AreaChart
            className='h-[16rem]'
            data={chartData}
            index='month'
            categories={['Monthly Revenue']}
            colors={['purple']}
            valueFormatter={valueFormatter}
            yAxisWidth={90}
          />
        </Card>
      </div>
    </div>
  );
}

export default DummyDashboard;
