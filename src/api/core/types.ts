import { AxiosResponse } from 'axios';

export interface ApiError {
  error: string;
  message: string;
}

export interface ApiRequestOptions {
  abortOnUnmount?: boolean;
  silent?: boolean;
}

export interface AbortableRequest<T> {
  request: Promise<AxiosResponse<T>>;
  abort: () => void;
}

export const isApiError = (data: unknown): data is ApiError => {
  return (
    data !== null &&
    typeof data === 'object' &&
    'error' in data &&
    typeof (data as { error: unknown }).error === 'string'
  );
};
