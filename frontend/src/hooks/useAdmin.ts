import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export const useAdmin = () => {
  const queryClient = useQueryClient();

  const dashboardStatsQuery = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await api.get('/admin/dashboard');
      return response.data.data;
    },
  });

  const allUsersQuery = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await api.get('/admin/users');
      return response.data.data;
    },
  });

  const allOrdersQuery = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const response = await api.get('/admin/orders');
      return response.data.data;
    },
  });

  const verifyUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await api.patch(`/admin/users/${userId}/verify`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const blockUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await api.patch(`/admin/users/${userId}/block`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (formData: any) => {
      const response = await api.post('/wastecategory/create', formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waste-categories'] });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: any }) => {
      const response = await api.put(`/wastecategory/update/${id}`, formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waste-categories'] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: number) => {
      const response = await api.delete(`/wastecategory/delete/${categoryId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waste-categories'] });
    },
  });

  const assignLogisticsMutation = useMutation({
    mutationFn: async ({ orderId, logisticsId }: { orderId: number; logisticsId: number }) => {
      const response = await api.patch(`/admin/orders/${orderId}/assign-logistics`, { logistics_id: logisticsId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });

  const platformSettingsQuery = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const response = await api.get('/admin/settings');
      return response.data.data;
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.patch('/admin/settings', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
    },
  });

  return {
    stats: dashboardStatsQuery.data,
    isStatsLoading: dashboardStatsQuery.isLoading,
    users: allUsersQuery.data || [],
    isUsersLoading: allUsersQuery.isLoading,
    orders: allOrdersQuery.data || [],
    isOrdersLoading: allOrdersQuery.isLoading,
    settings: platformSettingsQuery.data,
    isSettingsLoading: platformSettingsQuery.isLoading,
    verifyUser: verifyUserMutation.mutate,
    blockUser: blockUserMutation.mutate,
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    assignLogistics: assignLogisticsMutation.mutate,
    updateSettings: updateSettingsMutation.mutate,
    logistics: allUsersQuery.data?.filter((u: any) => u.role === 'logistics') || [],
    isMutating: verifyUserMutation.isPending || blockUserMutation.isPending || createCategoryMutation.isPending || updateCategoryMutation.isPending || deleteCategoryMutation.isPending || assignLogisticsMutation.isPending || updateSettingsMutation.isPending,
  };
};
