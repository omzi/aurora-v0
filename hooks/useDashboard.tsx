import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useUserContext } from '#/components/contexts/UserContext';

const useDashboard = () => {
  const { selectedBusiness } = useUserContext();

  const analyticsGetter = async () => {
    try {
      const response = await axios.get(`/api/dashboardAnalytics?id=${selectedBusiness?.id}`);
      return response.data.data;
    } catch (error) {
      // toast.error('Something went wrong...')
    }
  };

  const useGetAnalytics = () => {
    const { data: analytics, isLoading: loadingAnalytics } = useQuery({
      queryKey: ['analytics'],
      queryFn: analyticsGetter
    });

    return {
      analytics,
      loadingAnalytics
    };
  };

  return {
    analyticsGetter,
    useGetAnalytics
  };
}

export default useDashboard;
