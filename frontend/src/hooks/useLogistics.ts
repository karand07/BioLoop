import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export const useLogistics = () => {
  const queryClient = useQueryClient();

  const availablePickupsQuery = useQuery({
    queryKey: ['available-pickups'],
    queryFn: async () => {
      const response = await api.get('/pickupschedule/available');
      return response.data.data;
    },
  });

  const myPickupsQuery = useQuery({
    queryKey: ['my-pickups'],
    queryFn: async () => {
      const response = await api.get('/pickupschedule/my');
      return response.data.data;
    },
  });

  const claimPickupMutation = useMutation({
    mutationFn: async (orderId: number) => {
      const response = await api.post(`/pickupschedule/${orderId}/claim`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['available-pickups'] });
      queryClient.invalidateQueries({ queryKey: ['my-pickups'] });
    },
  });

  const markPickedUpMutation = useMutation({
    mutationFn: async (orderId: number) => {
      const response = await api.patch(`/pickupschedule/${orderId}/picked-up`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-pickups'] });
    },
  });

  const markDeliveredMutation = useMutation({
    mutationFn: async (orderId: number) => {
      const response = await api.patch(`/pickupschedule/${orderId}/delivered`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-pickups'] });
    },
  });

  return {
    availablePickups: availablePickupsQuery.data || [],
    isAvailableLoading: availablePickupsQuery.isLoading,
    myPickups: myPickupsQuery.data || [],
    isMyPickupsLoading: myPickupsQuery.isLoading,
    claimPickup: claimPickupMutation.mutate,
    isClaiming: claimPickupMutation.isPending,
    markPickedUp: markPickedUpMutation.mutate,
    isMarkingPickedUp: markPickedUpMutation.isPending,
    markDelivered: markDeliveredMutation.mutate,
    isMarkingDelivered: markDeliveredMutation.isPending,
    refetchAvailable: availablePickupsQuery.refetch,
    refetchMy: myPickupsQuery.refetch,
  };
};
