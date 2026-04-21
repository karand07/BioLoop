import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export const useOrders = () => {
  const myOrdersQuery = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const response = await api.get('/order/my');
      return response.data.data;
    },
  });

  const getIncomingRequestsQuery = useQuery({
    queryKey: ['incoming-requests'],
    queryFn: async () => {
      const response = await api.get('/orderrequest/incoming');
      return response.data.data;
    },
  });

  const getMyRequestsQuery = useQuery({
    queryKey: ['my-requests'],
    queryFn: async () => {
      const response = await api.get('/orderrequest/my');
      return response.data.data;
    },
  });

  const respondToRequestMutation = useMutation({
    mutationFn: async ({ requestId, action, negotiatedPrice }: { requestId: number; action: 'accepted' | 'rejected' | 'negotiated'; negotiatedPrice?: number }) => {
      const response = await api.patch(`/orderrequest/${requestId}/respond`, {
        status: action,
        negotiated_price: negotiatedPrice,
      });
      return response.data;
    },
    onSuccess: () => {
      getIncomingRequestsQuery.refetch();
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/orderrequest/create', data);
      return response.data;
    },
    onSuccess: () => {
      getMyRequestsQuery.refetch();
    },
  });

  return {
    orders: myOrdersQuery.data || [],
    isOrdersLoading: myOrdersQuery.isLoading,
    incomingRequests: getIncomingRequestsQuery.data || [],
    isRequestsLoading: getIncomingRequestsQuery.isLoading,
    myRequests: getMyRequestsQuery.data || [],
    isMyRequestsLoading: getMyRequestsQuery.isLoading,
    createRequest: createRequestMutation.mutate,
    isCreatingRequest: createRequestMutation.isPending,
    respondToRequest: respondToRequestMutation.mutate,
    isResponding: respondToRequestMutation.isPending,
    refetchOrders: myOrdersQuery.refetch,
    refetchRequests: getIncomingRequestsQuery.refetch,
    refetchMyRequests: getMyRequestsQuery.refetch,
  };
};
