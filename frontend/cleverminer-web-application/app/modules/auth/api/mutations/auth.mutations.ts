import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { login, logout, register } from '@/modules/auth/api/auth.api';
import { storage } from '@/modules/auth/utils/storage';
import axios from 'axios';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      storage.setTokens(data.access, data.refresh);
      toast.success('Successfully logged in!');
      queryClient.setQueryData(['me'], data.user);
    },
    onError: () => {
      toast.error('Invalid email or password');
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(['me'], null);
      navigate('/login');
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      storage.setTokens(data.access, data.refresh);
      queryClient.setQueryData(['me'], data.user);
      toast.success('Successfully registered!');
      navigate('/');
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        const message = data ? Object.values(data).flat().join(' ') : error.message;
        toast.error('Registration failed: ' + message);
      }
    },
  });
}
