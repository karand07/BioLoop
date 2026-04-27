import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { useAuth } from './useAuth';

export const useOrders = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userRole = user?.role;

  const myOrdersQuery = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const response = await api.get('/order/my');
      return response.data.data;
    },
    enabled: !!user,
  });

  const getIncomingRequestsQuery = useQuery({
    queryKey: ['incoming-requests'],
    queryFn: async () => {
      const response = await api.get('/orderrequest/incoming');
      return response.data.data;
    },
    enabled: userRole === 'farmer',
  });

  const getMyRequestsQuery = useQuery({
    queryKey: ['my-requests'],
    queryFn: async () => {
      const response = await api.get('/orderrequest/my');
      return response.data.data;
    },
    enabled: userRole === 'company',
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
      queryClient.invalidateQueries({ queryKey: ['all-listings'] });
    },
  });

  const proposeSlotsMutation = useMutation({
    mutationFn: async ({ orderId, slots }: { orderId: number; slots: string[] }) => {
      const response = await api.post('/pickup/propose', { order_id: orderId, proposed_slots: slots });
      return response.data;
    },
    onSuccess: () => {
      myOrdersQuery.refetch();
    },
  });

  const confirmSlotMutation = useMutation({
    mutationFn: async ({ orderId, slot }: { orderId: number; slot: string }) => {
      const response = await api.patch(`/pickup/${orderId}/confirm`, { confirmed_slot: slot });
      return response.data;
    },
    onSuccess: () => {
      myOrdersQuery.refetch();
    },
  });

  const initiatePaymentMutation = useMutation({
    mutationFn: async (orderId: number) => {
      const response = await api.post('/payment/create-order', { order_id: orderId });
      return response.data;
    },
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/payment/verify', data);
      return response.data;
    },
    onSuccess: () => {
      myOrdersQuery.refetch();
    },
  });

  const confirmDeliveryMutation = useMutation({
    mutationFn: async (orderId: number) => {
      const response = await api.patch(`/order/${orderId}/confirm-delivery`);
      return response.data;
    },
    onSuccess: () => {
      myOrdersQuery.refetch();
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
    proposeSlots: proposeSlotsMutation.mutate,
    isProposing: proposeSlotsMutation.isPending,
    confirmSlot: confirmSlotMutation.mutate,
    isConfirming: confirmSlotMutation.isPending,
    initiatePayment: initiatePaymentMutation.mutateAsync,
    isInitiatingPayment: initiatePaymentMutation.isPending,
    verifyPayment: verifyPaymentMutation.mutate,
    isVerifyingPayment: verifyPaymentMutation.isPending,
    confirmDelivery: confirmDeliveryMutation.mutate,
    isConfirmingDelivery: confirmDeliveryMutation.isPending,
    refetchOrders: myOrdersQuery.refetch,
    refetchRequests: getIncomingRequestsQuery.refetch,
    refetchMyRequests: getMyRequestsQuery.refetch,
    requestsError: getMyRequestsQuery.error,
  };
};
