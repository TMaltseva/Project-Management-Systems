import { useQuery, UseQueryOptions } from 'react-query';
import { getBoards, getBoardTasks } from '@/api/endpoints';
import { Board, Task } from '@/types';
import { QueryKeys } from '@/types/api';

export const useBoards = (options?: UseQueryOptions<Board[], unknown, Board[], string>) => {
  return useQuery<Board[], unknown, Board[], string>(
    QueryKeys.BOARDS,
    async () => {
      try {
        const { request } = getBoards();
        const response = await request;

        if (
          response.data &&
          typeof response.data === 'object' &&
          'data' in response.data &&
          Array.isArray(response.data.data)
        ) {
          return response.data.data as Board[];
        } else if (Array.isArray(response.data)) {
          return response.data;
        }

        console.warn('Unexpected data format from API:', response.data);
        return [] as Board[];
      } catch (error) {
        console.error('Error fetching boards:', error);
        return [] as Board[];
      }
    },
    options
  );
};

export const useBoardTasks = (
  boardId: number,
  options?: UseQueryOptions<Task[], unknown, Task[], [string, number]>
) => {
  return useQuery<Task[], unknown, Task[], [string, number]>(
    [QueryKeys.BOARD_TASKS, boardId],
    async () => {
      try {
        const { request } = getBoardTasks(boardId);
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
        console.error('Error fetching board tasks:', error);
        return [] as Task[];
      }
    },
    {
      enabled: !!boardId,
      ...options,
    }
  );
};
