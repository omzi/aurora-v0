import { DashboardChartResponse } from '#/common.types';
import { request } from '#/lib/utils';

const getDashboardCharts = async (businessId: string) => {
	try {
		const response = await request<DashboardChartResponse>(`/api/dashboard/charts?id=${businessId}`, 'GET');
		return response;
	} catch (error: any) {
		return null;
	}
};

export default getDashboardCharts;
