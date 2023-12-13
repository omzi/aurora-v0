import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { AnalyticsResponse, SuccessResponse } from '#/common.types';
import { useUserContext } from '#/components/contexts/UserContext';

const useDashboard = () => {
	const { selectedBusiness } = useUserContext();
	const getAnalytics = async () => {
		try {
			const { data: analyticsResponse } = await axios.get<SuccessResponse<AnalyticsResponse>>(`/api/dashboard/analytics?id=${selectedBusiness?.id}`);
			return analyticsResponse.data;
		} catch (error) {
			// console.log('[Error]: Getting dashboard analytics :>>', error);
			return null;
		}
	};
	const getCharts = async () => {
		try {
			const { data: chartsResponse } = await axios.get<
				SuccessResponse<AnalyticsResponse>
			>(`/api/dashboard/charts?id=${selectedBusiness?.id}`);
			return chartsResponse.data;
		} catch (error) {
			// console.log('[Error]: Getting dashboard charts :>>', error);
			return null;
		}
	};

	const { data: analytics, isLoading: isAnalyticsLoading } = useQuery({
		queryKey: ['analytics'],
		queryFn: getAnalytics
	});

	const { data: charts, isLoading: isChartsLoading } = useQuery({
		queryKey: ['charts'],
		queryFn: getCharts
	});

	return {
		analytics,
		isAnalyticsLoading,
		charts,
		isChartsLoading
	};
};

export default useDashboard;
