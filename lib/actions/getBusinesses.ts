import { request } from '#/lib/utils';
import { Business } from '#/common.types';

const getBusinesses = async () => {
  try {
    const response = await request<Business[]>('/api/businesses', 'GET');

    return response;
  } catch (error: any) {
    return null;
  }
};

export default getBusinesses;
