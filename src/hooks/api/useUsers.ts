import { useQuery, UseQueryOptions } from 'react-query';
import { getUsers, getUserTasks } from '@/api/endpoints';
import { Task, User } from '@/types';
import { QueryKeys } from '@/types/api';

export const useUsers = (options?: UseQueryOptions<User[], unknown, User[], string>) => {
  return useQuery<User[], unknown, User[], string>(
    QueryKeys.USERS,
    async () => {
      try {
        const { request } = getUsers();
        const response = await request;

        if (
          response.data &&
          typeof response.data === 'object' &&
          'data' in response.data &&
          Array.isArray(response.data.data)
        ) {
          return response.data.data as User[];
        } else if (Array.isArray(response.data)) {
          return response.data;
        }

        console.warn('Unexpected data format from API:', response.data);
        return [] as User[];
      } catch (error) {
        console.error('Error fetching users:', error);
        return [] as User[];
      }
    },
    options
  );
};

export const useUserTasks = (
  userId: number,
  options?: UseQueryOptions<Task[], unknown, Task[], [string, number]>
) => {
  return useQuery<Task[], unknown, Task[], [string, number]>(
    [QueryKeys.USER_TASKS, userId],
    async () => {
      try {
        const { request } = getUserTasks(userId);
        const response = await request;

        if (
          response.data &&
          typeof response.data === 'object' &&
          'data' in response.data &&
          Array.isArray(response.data.data)
        ) {
          return response.data.data as Task[];
        } else if (Array.isArray(response.data)) {
          return response.data;
        }

        console.warn('Unexpected data format from API:', response.data);
        return [] as Task[];
      } catch (error) {
        console.error('Error fetching user tasks:', error);
        return [] as Task[];
      }
    },
    {
      enabled: !!userId,
      ...options,
    }
  );
};
