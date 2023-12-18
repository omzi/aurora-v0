import { DashboardAnalyticsResponse } from '#/common.types';
import { request } from '#/lib/utils';

const getDashboardAnalytics = async (businessId: string) => {
	try {
		const response = await request<DashboardAnalyticsResponse>(`/api/dashboard/analytics?id=${businessId}`, 'GET');
		return response;
	} catch (error: any) {
		return null;
	}
};

export default getDashboardAnalytics;
