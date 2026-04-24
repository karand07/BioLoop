import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export const usePayouts = () => {
  const myPayoutsQuery = useQuery({
    queryKey: ['my-payouts'],
    queryFn: async () => {
      const response = await api.get('/payout/my');
      return response.data.data;
    },
  });

  const getPayoutStatusQuery = (orderId: number) => useQuery({
    queryKey: ['payout-status', orderId],
    queryFn: async () => {
      const response = await api.get(`/payout/${orderId}/status`);
      return response.data.data;
    },
    enabled: !!orderId,
  });

  return {
    payouts: myPayoutsQuery.data || [],
    isPayoutsLoading: myPayoutsQuery.isLoading,
    refetchPayouts: myPayoutsQuery.refetch,
    getPayoutStatusQuery,
  };
};
