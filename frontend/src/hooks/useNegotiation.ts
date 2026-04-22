import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export const useNegotiation = (requestId?: number) => {
  const historyQuery = useQuery({
    queryKey: ['negotiation-history', requestId],
    queryFn: async () => {
      if (!requestId) return [];
      const response = await api.get(`/negotiation/${requestId}`);
      return response.data.data;
    },
    enabled: !!requestId,
  });

  const sendOfferMutation = useMutation({
    mutationFn: async ({ requestId, price, message }: { requestId: number; price: number; message?: string }) => {
      const response = await api.post('/negotiation', { request_id: requestId, proposed_price: price, message });
      return response.data;
    },
    onSuccess: () => {
      historyQuery.refetch();
    },
  });

  const finalizeMutation = useMutation({
    mutationFn: async (requestId: number) => {
      const response = await api.patch(`/negotiation/${requestId}/finalize`);
      return response.data;
    },
    onSuccess: () => {
      historyQuery.refetch();
    },
  });

  return {
    history: historyQuery.data || [],
    isHistoryLoading: historyQuery.isLoading,
    sendOffer: sendOfferMutation.mutate,
    isSending: sendOfferMutation.isPending,
    finalize: finalizeMutation.mutate,
    isFinalizing: finalizeMutation.isPending,
  };
};
