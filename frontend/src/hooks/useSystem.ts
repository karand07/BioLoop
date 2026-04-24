import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export const useSystem = () => {
  const settingsQuery = useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      const response = await api.get('/system/settings');
      return response.data.data;
    },
  });

  return {
    settings: settingsQuery.data,
    isSettingsLoading: settingsQuery.isLoading,
  };
};
