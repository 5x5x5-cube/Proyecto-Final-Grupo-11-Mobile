import { useQuery, useMutation } from '@tanstack/react-query';
import { httpClient } from '../httpClient';

interface RegisterTokenRequest {
  expoPushToken: string;
  deviceId: string;
  platform?: string;
}

export function useRegisterPushToken() {
  return useMutation({
    mutationFn: (data: RegisterTokenRequest) =>
      httpClient.post('/notifications/register-token', { body: data }),
  });
}

export function useNotificationHistory() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => httpClient.get('/notifications/history'),
  });
}
