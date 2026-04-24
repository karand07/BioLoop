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
      const response = await api.post('/waste-category/create', formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: number) => {
      const response = await api.delete(`/waste-category/delete/${categoryId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
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
    deleteCategory: deleteCategoryMutation.mutate,
    updateSettings: updateSettingsMutation.mutate,
    isMutating: verifyUserMutation.isPending || blockUserMutation.isPending || createCategoryMutation.isPending || deleteCategoryMutation.isPending || updateSettingsMutation.isPending,
  };
};
