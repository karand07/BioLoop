import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useMemo } from 'react';

export const useAuth = () => {
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/user/signin', data);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      
      // Redirect based on role
      if (data.role === 'farmer') navigate('/farmer/dashboard');
      else if (data.role === 'company') navigate('/company/dashboard');
      else if (data.role === 'logistics') navigate('/logistics/dashboard');
      else if (data.role === 'admin') navigate('/admin/dashboard');
      else navigate('/');
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/user/signup', data);
      return response.data;
    },
    onSuccess: () => {
      navigate('/login');
    },
  });

  const onboardFarmerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/farmer/create', data);
      return response.data;
    },
    onSuccess: () => {
      navigate('/farmer/dashboard');
    },
  });

  const onboardCompanyMutation = useMutation({
    mutationFn: async (formData: any) => {
      const response = await api.post('/company/create', formData);
      return response.data;
    },
    onSuccess: () => {
      navigate('/company/marketplace');
    },
  });

  const onboardLogisticsMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/logistics/create', data);
      return response.data;
    },
    onSuccess: () => {
      navigate('/logistics/dashboard');
    },
  });

  const updateFarmerMutation = useMutation({
    mutationFn: async (formData: any) => {
      const response = await api.put('/farmer/update', formData);
      return response.data;
    },
    onSuccess: () => {
      userQuery.refetch();
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: async (formData: any) => {
      const response = await api.put('/company/update', formData);
      return response.data;
    },
    onSuccess: () => {
      userQuery.refetch();
    },
  });

  const updateLogisticsMutation = useMutation({
    mutationFn: async (formData: any) => {
      const response = await api.put('/logistics/update', formData);
      return response.data;
    },
    onSuccess: () => {
      userQuery.refetch();
    },
  });

  const userQuery = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await api.get('/user/me');
      return response.data.data;
    },
    enabled: !!localStorage.getItem('token'),
  });

  const queryClient = useQueryClient();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    queryClient.clear();
    navigate('/login');
  };

  return useMemo(() => ({
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    onboardFarmer: onboardFarmerMutation.mutate,
    onboardCompany: onboardCompanyMutation.mutate,
    onboardLogistics: onboardLogisticsMutation.mutate,
    updateFarmerProfile: updateFarmerMutation.mutate,
    updateCompanyProfile: updateCompanyMutation.mutate,
    updateLogisticsProfile: updateLogisticsMutation.mutate,
    user: userQuery.data,
    isLoading: loginMutation.isPending || signupMutation.isPending || onboardFarmerMutation.isPending || onboardCompanyMutation.isPending || onboardLogisticsMutation.isPending || updateFarmerMutation.isPending || updateCompanyMutation.isPending || updateLogisticsMutation.isPending || userQuery.isLoading,
    error: loginMutation.error || signupMutation.error || onboardFarmerMutation.error || onboardCompanyMutation.error || onboardLogisticsMutation.error || updateFarmerMutation.error || updateCompanyMutation.error || updateLogisticsMutation.error,
    logout,
  }), [loginMutation.mutate, signupMutation.mutate, onboardFarmerMutation.mutate, onboardCompanyMutation.mutate, onboardLogisticsMutation.mutate, updateFarmerMutation.mutate, updateCompanyMutation.mutate, updateLogisticsMutation.mutate, userQuery.data, loginMutation.isPending, signupMutation.isPending, onboardFarmerMutation.isPending, onboardCompanyMutation.isPending, onboardLogisticsMutation.isPending, updateFarmerMutation.isPending, updateCompanyMutation.isPending, updateLogisticsMutation.isPending, userQuery.isLoading, loginMutation.error, signupMutation.error, onboardFarmerMutation.error, onboardCompanyMutation.error, onboardLogisticsMutation.error, updateFarmerMutation.error, updateCompanyMutation.error, updateLogisticsMutation.error]);
};
