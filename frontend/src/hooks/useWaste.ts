import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from './useAuth';

export const useWaste = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = user?.role;

  // Fetch categories (Assuming we might need to add this route or it exists)
  const categoriesQuery = useQuery({
    queryKey: ['waste-categories'],
    queryFn: async () => {
      const response = await api.get('/wastecategory'); // I'll assume this exists or will be added
      return response.data.data;
    },
  });

  const createListingMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post('/wastelistings/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      navigate('/farmer/listings');
    },
  });

  const updateListingMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
      const response = await api.put(`/wastelistings/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      navigate('/farmer/listings');
    },
  });

  const deleteListingMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.put(`/wastelistings/delete/${id}`);
      return response.data;
    },
  });

  const getAllListingsQuery = useQuery({
    queryKey: ['all-listings'],
    queryFn: async () => {
      const response = await api.get('/wastelistings');
      return response.data.data;
    },
    // Only fetch for roles that need the marketplace
    enabled: !!user && (userRole === 'company' || userRole === 'admin' || userRole === 'farmer'),
  });
 
  const getMyListingsQuery = useQuery({
    queryKey: ['my-listings'],
    queryFn: async () => {
      const response = await api.get('/wastelistings/my');
      return response.data.data;
    },
    // Only fetch for farmers
    enabled: userRole === 'farmer',
  });
 
  const getListingByIdQuery = (id: number) => useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const response = await api.get(`/wastelistings/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });

  return {
    categories: categoriesQuery.data || [],
    isCategoriesLoading: categoriesQuery.isLoading,
    createListing: createListingMutation.mutate,
    isCreating: createListingMutation.isPending,
    createError: createListingMutation.error,
    updateListing: updateListingMutation.mutate,
    isUpdating: updateListingMutation.isPending,
    deleteListing: deleteListingMutation.mutate,
    isDeleting: deleteListingMutation.isPending,
    deleteError: deleteListingMutation.error,
    myListings: getMyListingsQuery.data || [],
    listings: getAllListingsQuery.data || [],
    isMyListingsLoading: getMyListingsQuery.isLoading,
    isAllListingsLoading: getAllListingsQuery.isLoading,
    isListingsLoading: getAllListingsQuery.isLoading || categoriesQuery.isLoading,
    listingsError: getAllListingsQuery.error,
    refetchListings: getMyListingsQuery.refetch,
    refetchAllListings: getAllListingsQuery.refetch,
    getListingById: getListingByIdQuery,
  };
};
