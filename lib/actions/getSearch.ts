import { request } from '#/lib/utils';
import { Business } from '#/common.types';

const getSearch = async (searchQuery?: string) => {
  try {
    const response = await request<Business[]>(`/api/search?query=${searchQuery}`, 'GET');

    return response;
  } catch (error: any) {
    return null;
  }
};

export default getSearch;
