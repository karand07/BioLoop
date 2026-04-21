import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

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

  const updateFarmerMutation = useMutation({
    mutationFn: async (formData: any) => {
      const response = await api.put('/farmer/update', formData);
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

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return {
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    onboardFarmer: onboardFarmerMutation.mutate,
    updateFarmerProfile: updateFarmerMutation.mutate,
    user: userQuery.data,
    isLoading: loginMutation.isPending || signupMutation.isPending || onboardFarmerMutation.isPending || updateFarmerMutation.isPending || userQuery.isLoading,
    error: loginMutation.error || signupMutation.error || onboardFarmerMutation.error || updateFarmerMutation.error,
    logout,
  };
};
