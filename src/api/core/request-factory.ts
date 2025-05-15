import { AxiosRequestConfig } from 'axios';
import axiosInstance from './axios-instance';
import { AbortableRequest } from './types';

export function createAbortableRequest<T>(config: AxiosRequestConfig): AbortableRequest<T> {
  const controller = new AbortController();
  const signal = controller.signal;
  const request = axiosInstance.request<T>({ ...config, signal });

  return {
    request,
    abort: () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚫 Request cancelled: ${config.method?.toUpperCase()} ${config.url}`);
      }
      controller.abort();
    },
  };
}
