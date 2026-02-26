import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { login, logout, register } from '@/modules/auth/api/auth.api';

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Successfully logged in!');
      navigate('/tasks');
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
  const navigate = useNavigate();

  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      navigate('/login');
      toast.success('Successfully registered!');
    },
    onError: () => {
      toast.error('Registration failed');
      console.error('Registration failed');
    },
  });
}
