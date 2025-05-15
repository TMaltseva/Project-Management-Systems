import axiosInstance from './core/axios-instance';
import setupInterceptors from './core/interceptors';
import { createAbortableRequest } from './core/request-factory';
import { checkConnection } from './core/utils';
import { isApiError } from './core/types';

setupInterceptors();

export { axiosInstance, createAbortableRequest, checkConnection, isApiError };
