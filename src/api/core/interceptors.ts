import { AxiosError } from 'axios';
import { message } from 'antd';
import axiosInstance from './axios-instance';
import { isApiError } from './types';

const setupInterceptors = (): void => {
  axiosInstance.interceptors.request.use(
    (config) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `📡 ${config.method?.toUpperCase()} ${config.url}`,
          config.params || config.data
        );
      }
      return config;
    },
    (error: AxiosError) => {
      console.error('Request Error:', error);
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
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
};

export default setupInterceptors;
