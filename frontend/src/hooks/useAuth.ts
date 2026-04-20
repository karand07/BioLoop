import { useMutation } from '@tanstack/react-query';
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

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return {
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    isLoading: loginMutation.isPending || signupMutation.isPending,
    error: loginMutation.error || signupMutation.error,
    logout,
  };
};
