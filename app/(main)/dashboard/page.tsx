'use client';

import { useUserContext } from '#/components/contexts/UserContext';
import { Skeleton } from '#/components/ui/skeleton';
import useDashboard from '#/hooks/useDashboard';
import {
  AreaChart,
  Card,
  Flex,
  Grid,
  Icon,
  Metric,
  Text,
  Title,
} from '@tremor/react';
import {
  BanknoteIcon,
  LandmarkIcon,
  UsersIcon,
  WalletIcon,
} from 'lucide-react';

const AnalyticSkeleton = () => (
  <Skeleton className="w-[100px] mt-[2px] h-[30px] rounded-sm" />
);

const Dashboard = () => {
  const { selectedBusiness } = useUserContext();
  const { analytics, isAnalyticsLoading, charts, isChartsLoading } =
    useDashboard();

  console.log(analytics);

  const chartData = [
    {
      month: 'Jan',
      'Monthly Revenue': 109200,
    },
    {
      month: 'Feb',
      'Monthly Revenue': 289150,
    },
    {
      month: 'Mar',
      'Monthly Revenue': 96000,
    },
    {
      month: 'Apr',
      'Monthly Revenue': 131400,
    },
    {
      month: 'May',
      'Monthly Revenue': 257500,
    },
  ];

  const valueFormatter = (number: number) =>
    `₦ ${new Intl.NumberFormat('us').format(number).toString()}`;

  return (
    <div className="min-h-full max-w-[1560px] mx-auto pt-6 pb-8 flex flex-col items-center justify-start space-y-7">
      <Grid numItemsMd={2} numItemsLg={4} className="gap-6 w-[calc(100%-50px)]">
        {/* Total Customers Card */}
        <Card
          className="p-4 ring-0"
          decoration="top"
          decorationColor="blue"
          key="Total Customers"
        >
          <Flex alignItems="center" justifyContent="start" className="gap-4">
            <Icon
              icon={UsersIcon}
              className="rounded-tremor-full"
              color="blue"
              variant="light"
              size="lg"
            />
            <div className="truncate">
              <Text>Total Customers</Text>
              {isAnalyticsLoading ? (
                <AnalyticSkeleton />
              ) : (
                <Metric className="truncate">{analytics?.customers}</Metric>
              )}
            </div>
          </Flex>
        </Card>
        {/* Total Revenue Card */}
        <Card
          className="p-4 ring-0"
          decoration="top"
          decorationColor="green"
          key="Total Revenue"
        >
          <Flex alignItems="center" justifyContent="start" className="gap-4">
            <Icon
              icon={BanknoteIcon}
              className="rounded-tremor-full"
              color="green"
              variant="light"
              size="lg"
            />
            <div className="truncate">
              <Text>Total Revenue</Text>
              {isAnalyticsLoading ? (
                <AnalyticSkeleton />
              ) : (
                <Metric className="truncate">₦ {analytics?.revenue}</Metric>
              )}
            </div>
          </Flex>
        </Card>
        {/* Total Outstanding Card */}
        <Card
          className="p-4 ring-0"
          decoration="top"
          decorationColor="red"
          key="Total Outstanding"
        >
          <Flex alignItems="center" justifyContent="start" className="gap-4">
            <Icon
              icon={LandmarkIcon}
              className="rounded-tremor-full"
              color="red"
              variant="light"
              size="lg"
            />
            <div className="truncate">
              <Text>Total Outstanding</Text>
              {isAnalyticsLoading ? (
                <AnalyticSkeleton />
              ) : (
                <Metric className="truncate">₦ {analytics?.outstanding}</Metric>
              )}
            </div>
          </Flex>
        </Card>
        {/* Total Withdrawn Card */}
        <Card
          className="p-4 ring-0"
          decoration="top"
          decorationColor="yellow"
          key="Total Withdrawn"
        >
          <Flex alignItems="center" justifyContent="start" className="gap-4">
            <Icon
              icon={WalletIcon}
              className="rounded-tremor-full"
              color="yellow"
              variant="light"
              size="lg"
            />
            <div className="truncate">
              <Text>Total Withdrawn</Text>
              {isAnalyticsLoading ? (
                <AnalyticSkeleton />
              ) : (
                <Metric className="truncate">₦ {analytics?.withdrawals}</Metric>
              )}
            </div>
          </Flex>
        </Card>
      </Grid>
      <div className="mt-24 w-[calc(100%-50px)]">
        <Card>
          <Title>Monthly Revenue Trends</Title>
          <AreaChart
            className="h-[24rem]"
            data={charts as unknown as any[]}
            index="month"
            categories={['Monthly Revenue']}
            colors={['blue']}
            valueFormatter={valueFormatter}
            yAxisWidth={75}
          />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
