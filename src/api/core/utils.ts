import axiosInstance from './axios-instance';

export const checkConnection = async (): Promise<boolean> => {
  try {
    await axiosInstance.get('tasks', { params: { limit: 1 } });
    return true;
  } catch (error) {
    console.error('Connection check error:', error);
    return false;
  }
};
