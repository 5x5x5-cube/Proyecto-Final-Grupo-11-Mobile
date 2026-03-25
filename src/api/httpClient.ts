import { mockHandlers } from './mockHandlers';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestConfig {
  params?: Record<string, unknown>;
  body?: unknown;
}

interface MockHandler {
  method: Method;
  pattern: RegExp;
  handler: (
    config: RequestConfig | undefined,
    match: RegExpMatchArray
  ) => { status: number; data: unknown };
}

function findMockHandler(
  method: Method,
  path: string
): { handler: MockHandler['handler']; match: RegExpMatchArray } | null {
  for (const route of mockHandlers) {
    if (route.method !== method) continue;
    const match = path.match(route.pattern);
    if (match) return { handler: route.handler, match };
  }
  return null;
}

async function request<T>(method: Method, path: string, config?: RequestConfig): Promise<T> {
  const found = findMockHandler(method, path);
  if (!found) throw new Error(`No mock handler for ${method} ${path}`);
  await new Promise(r => setTimeout(r, 800 + Math.random() * 400));
  const result = found.handler(config, found.match);
  if (result.status >= 400) throw result;
  return result.data as T;
}

export const httpClient = {
  get: <T>(path: string, config?: RequestConfig) => request<T>('GET', path, config),
  post: <T>(path: string, config?: RequestConfig) => request<T>('POST', path, config),
  put: <T>(path: string, config?: RequestConfig) => request<T>('PUT', path, config),
  patch: <T>(path: string, config?: RequestConfig) => request<T>('PATCH', path, config),
  delete: <T>(path: string, config?: RequestConfig) => request<T>('DELETE', path, config),
};
