import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { message } from 'antd';
import { ApiError } from '@/types';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const isApiError = (data: unknown): data is ApiError => {
  return (
    data !== null &&
    typeof data === 'object' &&
    'error' in data &&
    typeof (data as { error: unknown }).error === 'string'
  );
};

api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`📡 ${config.method?.toUpperCase()} ${config.url}`, config.params || config.data);
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `✅ ${response.config.method?.toUpperCase()} ${response.config.url} [${response.status}]`
      );
    }

    if (isApiError(response.data)) {
      message.error(response.data.message || 'API error');
      return Promise.reject(response.data);
    }

    return response;
  },
  (error: AxiosError) => {
    if (!error.response) {
      message.error('Failed to connect to the server. Check the connection.');
      console.error('Network error:', error);
      return Promise.reject(error);
    }

    console.error(
      `❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} [${error.response?.status}]`,
      error.response?.data
    );

    const status = error.response.status;
    let errorMessage = 'An error occurred while executing the request';

    if (isApiError(error.response.data)) {
      errorMessage = error.response.data.message;
    }

    if (status === 400) {
      message.error('Incorrect data: ' + errorMessage);
    } else if (status === 404) {
      message.error('Source not found: ' + errorMessage);
    } else if (status >= 500) {
      message.error('Server Error: ' + errorMessage);
    } else {
      message.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export const createAbortableRequest = <T>(
  config: AxiosRequestConfig
): { request: Promise<AxiosResponse<T>>; abort: () => void } => {
  const controller = new AbortController();
  const signal = controller.signal;
  const request = api.request<T>({ ...config, signal });

  return {
    request,
    abort: () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚫Request cancelled: ${config.method?.toUpperCase()} ${config.url}`);
      }
      controller.abort();
    },
  };
};

export const checkConnection = async (): Promise<boolean> => {
  try {
    await api.get('tasks', { params: { limit: 1 } });
    return true;
  } catch (error) {
    console.error('Connection check error:', error);
    return false;
  }
};

export default api;
