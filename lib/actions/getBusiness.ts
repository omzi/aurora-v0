import { request } from '#/lib/utils';
import { Business } from '#/common.types';

const getBusiness = async (businessId: string) => {
  try {
    const response = await request<Business>(`/api/getBusiness?businessId=${businessId}`, 'GET');

    return response;
  } catch (error: any) {
    return null;
  }
};

export default getBusiness;
