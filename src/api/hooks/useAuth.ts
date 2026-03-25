import { useQuery, useMutation } from '@tanstack/react-query';
import { httpClient } from '../httpClient';

export function useLogin() {
  return useMutation({
    mutationFn: (creds: { email: string; password: string }) =>
      httpClient.post('/auth/login', { body: creds }),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: { name: string; email: string; password: string; phone?: string }) =>
      httpClient.post('/auth/register', { body: data }),
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => httpClient.get<{ id: number; name: string; email: string; initials: string }>('/auth/me'),
  });
}
