import { useQuery, useMutation, useQueryClient, UseQueryOptions } from 'react-query';
import {
  getBoardTasks,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  getUserTasks,
} from '@/api/endpoints';
import { Task, CreateTaskDto, UpdateTaskDto, TaskStatus } from '@/types';
import { GetTasksParams } from '@/types/api';
import { message } from 'antd';
import { useState, useEffect } from 'react';
import { useUsers } from './useUsers';
import { useBoards } from './useBoards';
import { QueryKeys } from '@/types/api';

export const useTasks = (
  params?: GetTasksParams,
  options?: UseQueryOptions<Task[], unknown, Task[], [string, GetTasksParams | undefined]>
) => {
  const [debouncedParams, setDebouncedParams] = useState<GetTasksParams | undefined>(params);

  const { data: usersData } = useUsers();
  const { data: boardsData } = useBoards();

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedParams(params);
    }, 300);

    return () => clearTimeout(timerId);
  }, [params]);

  const queryFn = async () => {
    try {
      let response;
      let tasks: Task[] = [];

      if (debouncedParams?.board && debouncedParams?.assignee) {
        const { request } = getBoardTasks(debouncedParams.board);
        response = await request;

        if (
          response.data &&
          typeof response.data === 'object' &&
          'data' in response.data &&
          Array.isArray(response.data.data)
        ) {
          tasks = response.data.data as Task[];
        } else if (Array.isArray(response.data)) {
          tasks = response.data;
        }

        tasks = tasks.filter(
          (task) => task.assignee && task.assignee.id === debouncedParams.assignee
        );
      } else if (debouncedParams?.board) {
        const { request } = getBoardTasks(debouncedParams.board);
        response = await request;

        if (
          response.data &&
          typeof response.data === 'object' &&
          'data' in response.data &&
          Array.isArray(response.data.data)
        ) {
          tasks = response.data.data as Task[];
        } else if (Array.isArray(response.data)) {
          tasks = response.data;
        }
      } else if (debouncedParams?.assignee) {
        const { request } = getUserTasks(debouncedParams.assignee);
        response = await request;

        if (
          response.data &&
          typeof response.data === 'object' &&
          'data' in response.data &&
          Array.isArray(response.data.data)
        ) {
          tasks = response.data.data as Task[];
        } else if (Array.isArray(response.data)) {
          tasks = response.data;
        }
      } else {
        const { request } = getTasks();
        response = await request;

        if (
          response.data &&
          typeof response.data === 'object' &&
          'data' in response.data &&
          Array.isArray(response.data.data)
        ) {
          tasks = response.data.data as Task[];
        } else if (Array.isArray(response.data)) {
          tasks = response.data;
        }
      }

      if (Array.isArray(boardsData)) {
        tasks = tasks.map((task) => {
          const enrichedTask = { ...task };

          if (task.boardName && !task.boardId) {
            const board = boardsData.find((b) => b.name === task.boardName);
            if (board) {
              enrichedTask.boardId = board.id;
            }
          }

          if (task.boardId && !task.boardName) {
            const board = boardsData.find((b) => b.id === task.boardId);
            if (board) {
              enrichedTask.boardName = board.name;
            }
          }

          return enrichedTask;
        });
      }

      if (Array.isArray(usersData)) {
        tasks = tasks.map((task) => {
          const enrichedTask = { ...task };

          if (!task.assignee && debouncedParams?.assignee) {
            const user = usersData.find((u) => u.id === debouncedParams.assignee);
            if (user) {
              enrichedTask.assignee = user;
            }
          }

          return enrichedTask;
        });
      }

      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [] as Task[];
    }
  };

  return useQuery<Task[], unknown, Task[], [string, GetTasksParams | undefined]>(
    [QueryKeys.TASKS, debouncedParams],
    queryFn,
    {
      keepPreviousData: true,
      ...options,
      select: (data) => {
        if (!Array.isArray(data)) return [];

        return data.filter((task) => {
          if (debouncedParams?.status && task.status !== debouncedParams.status) {
            return false;
          }

          if (
            debouncedParams?.search &&
            !task.title.toLowerCase().includes(debouncedParams.search.toLowerCase())
          ) {
            return false;
          }

          return true;
        });
      },
    }
  );
};

export const useTask = (
  id: number,
  options?: UseQueryOptions<Task, unknown, Task, [string, number]>
) => {
  return useQuery<Task, unknown, Task, [string, number]>(
    [QueryKeys.TASK, id],
    async () => {
      try {
        const { request } = getTaskById(id);
        const response = await request;

        if (response.data && typeof response.data === 'object' && 'data' in response.data) {
          return response.data.data as Task;
        } else {
          return response.data;
        }
      } catch (error) {
        console.error('Error fetching task:', error);
        throw error;
      }
    },
    {
      enabled: !!id,
      ...options,
    }
  );
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (newTask: CreateTaskDto) => {
      const { request } = createTask(newTask);
      return request;
    },
    {
      onSuccess: (_, newTask) => {
        queryClient.invalidateQueries(QueryKeys.TASKS);
        queryClient.invalidateQueries([QueryKeys.BOARD_TASKS, newTask.boardId]);
      },
      onError: () => {
        message.error('Failed to create task');
      },
    }
  );
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, ...task }: { id: number } & UpdateTaskDto) => {
      const { request } = updateTask(id, task);
      return request;
    },
    {
      onMutate: async ({ id, ...updatedTask }) => {
        await queryClient.cancelQueries([QueryKeys.TASK, id]);
        await queryClient.cancelQueries(QueryKeys.TASKS);

        if (updatedTask.status) {
          await queryClient.cancelQueries([QueryKeys.BOARD_TASKS]);
        }

        const previousTask = queryClient.getQueryData<Task>([QueryKeys.TASK, id]);

        if (previousTask) {
          const newTask: Task = { ...previousTask, ...updatedTask };

          queryClient.setQueryData<Task>([QueryKeys.TASK, id], newTask);

          queryClient.setQueryData<Task[]>(QueryKeys.TASKS, (oldData) => {
            if (!oldData) return [] as Task[];
            return oldData.map((task) => (task.id === id ? newTask : task));
          });

          if (previousTask.boardId) {
            queryClient.setQueryData<Task[]>(
              [QueryKeys.BOARD_TASKS, previousTask.boardId],
              (oldData) => {
                if (!oldData) return [] as Task[];
                return oldData.map((task) => (task.id === id ? newTask : task));
              }
            );
          }
        }

        return { previousTask };
      },

      onSuccess: (_, variables) => {
        queryClient.invalidateQueries([QueryKeys.TASK, variables.id]);
        queryClient.invalidateQueries(QueryKeys.TASKS);
        queryClient.invalidateQueries([QueryKeys.BOARD_TASKS]);

        message.success('Task updated successfully');
      },

      onError: (_, variables, context) => {
        if (context?.previousTask) {
          queryClient.setQueryData<Task>([QueryKeys.TASK, variables.id], context.previousTask);
        }
        message.error('Failed to update task');
      },
    }
  );
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, status }: { id: number; status: TaskStatus }) => {
      const { request } = updateTaskStatus(id, status);
      return request;
    },
    {
      onMutate: async ({ id, status }) => {
        await queryClient.cancelQueries([QueryKeys.TASK, id]);
        await queryClient.cancelQueries(QueryKeys.TASKS);

        const previousTask = queryClient.getQueryData<Task>([QueryKeys.TASK, id]);

        if (previousTask) {
          const newTask: Task = { ...previousTask, status };
          queryClient.setQueryData<Task>([QueryKeys.TASK, id], newTask);

          queryClient.setQueryData<Task[]>(QueryKeys.TASKS, (oldData) => {
            if (!oldData) return [] as Task[];
            return oldData.map((task) => (task.id === id ? { ...task, status } : task));
          });

          if (previousTask.boardId) {
            queryClient.setQueryData<Task[]>(
              [QueryKeys.BOARD_TASKS, previousTask.boardId],
              (oldData) => {
                if (!oldData) return [] as Task[];
                return oldData.map((task) => (task.id === id ? { ...task, status } : task));
              }
            );
          }
        }

        return { previousTask };
      },

      onSettled: (_, __, variables) => {
        queryClient.invalidateQueries([QueryKeys.TASK, variables.id]);
        queryClient.invalidateQueries(QueryKeys.TASKS);

        const task = queryClient.getQueryData<Task>([QueryKeys.TASK, variables.id]);
        if (task?.boardId) {
          queryClient.invalidateQueries([QueryKeys.BOARD_TASKS, task.boardId]);
        }
      },

      onError: (_, variables, context) => {
        if (context?.previousTask) {
          queryClient.setQueryData<Task>([QueryKeys.TASK, variables.id], context.previousTask);
        }
        message.error('Failed to update task status');
      },
    }
  );
};
