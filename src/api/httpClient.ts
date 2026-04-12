import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockHandlers } from './mockHandlers';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestConfig {
  params?: Record<string, unknown>;
  body?: unknown;
}

// For React Native, configure via app config or .env
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

function buildUrl(path: string, params?: Record<string, unknown>): string {
  let url = `${API_BASE_URL}${path}`;
  if (params) {
    const searchParams = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');
    if (searchParams) {
      url = `${url}?${searchParams}`;
    }
  }
  return url;
}

async function tryMockFallback<T>(
  method: Method,
  path: string,
  config?: RequestConfig
): Promise<T> {
  const route = mockHandlers.find(r => r.method === method && r.pattern.test(path));
  if (!route) throw { status: 503, data: { message: 'Service unavailable' } };
  await new Promise(r => setTimeout(r, 300 + Math.random() * 200));
  const match = path.match(route.pattern)!;
  const result = route.handler(config, match);
  if (result.status >= 400) throw { status: result.status, data: result.data };
  return result.data as T;
}

async function request<T>(method: Method, path: string, config?: RequestConfig): Promise<T> {
  const url = buildUrl(path, config?.params);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = await AsyncStorage.getItem('auth_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const userId = await AsyncStorage.getItem('user_id');
  if (userId) headers['X-User-Id'] = userId;

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (config?.body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, fetchOptions);

    if (response.status === 501) {
      return tryMockFallback(method, path, config);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw { status: response.status, data: errorData, ...errorData };
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  } catch (error: unknown) {
    // If it's already an API error (has status), re-throw
    if (error && typeof error === 'object' && 'status' in error) {
      throw error;
    }
    // Network error — try mock fallback
    return tryMockFallback(method, path, config);
  }
}

export const httpClient = {
  get: <T>(path: string, config?: RequestConfig) => request<T>('GET', path, config),
  post: <T>(path: string, config?: RequestConfig) => request<T>('POST', path, config),
  put: <T>(path: string, config?: RequestConfig) => request<T>('PUT', path, config),
  patch: <T>(path: string, config?: RequestConfig) => request<T>('PATCH', path, config),
  delete: <T>(path: string, config?: RequestConfig) => request<T>('DELETE', path, config),
};
