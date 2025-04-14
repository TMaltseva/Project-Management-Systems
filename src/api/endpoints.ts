import { createAbortableRequest } from './api';
import { Board, Task, User, CreateTaskDto, UpdateTaskDto } from '@/types';
import { GetTasksParams, UpdateTaskResponse, CreateTaskResponse } from '@/types/api';

/**
 * Getting a list of all boards
 * @returns {Promise<Board[]>} List of boards with information and number of tasks
 */
export const getBoards = () => {
  return createAbortableRequest<Board[]>({
    method: 'GET',
    url: '/boards',
  });
};

/**
 * Receive board tasks by ID
 * @param {number} id - board ID
 * @returns {Promise<Task[]>} Board tasks
 */
export const getBoardTasks = (id: number) => {
  return createAbortableRequest<Task[]>({
    method: 'GET',
    url: `/boards/${id}`,
  });
};

/**
 * Getting a list of all tasks
 * @param {GetTasksParams} params - Request parameters (search, status, etc.)
 * @returns {Promise<Task[]>} List of tasks
 */
export const getTasks = (params?: GetTasksParams) => {
  return createAbortableRequest<Task[]>({
    method: 'GET',
    url: '/tasks',
    params,
  });
};

/**
 * Receiving a task by ID
 * @param {number} id - task ID
 * @returns {Promise<Task>} Task data
 */
export const getTaskById = (id: number) => {
  return createAbortableRequest<Task>({
    method: 'GET',
    url: `/tasks/${id}`,
  });
};

/**
 * Create a new task
 * @param {CreateTaskDto} task - Data for creating a task
 * @returns {Promise<CreateTaskResponse>} ID of the created task
 */
export const createTask = (task: CreateTaskDto) => {
  return createAbortableRequest<CreateTaskResponse>({
    method: 'POST',
    url: '/tasks/create',
    data: task,
  });
};

/**
 * Updating an existing task
 * @param {number} id - task ID
 * @param {UpdateTaskDto} task - Data to update
 * @returns {Promise<UpdateTaskResponse>} Message about successful update
 */
export const updateTask = (id: number, task: UpdateTaskDto) => {
  return createAbortableRequest<UpdateTaskResponse>({
    method: 'PUT',
    url: `/tasks/update/${id}`,
    data: task,
  });
};

/**
 * Update task status
 * @param {number} id - task ID
 * @param {string} status - New status
 * @returns {Promise<UpdateTaskResponse>} Message about successful update
 */
export const updateTaskStatus = (id: number, status: string) => {
  return createAbortableRequest<UpdateTaskResponse>({
    method: 'PUT',
    url: `/tasks/updateStatus/${id}`,
    data: { status },
  });
};

/**
 * Getting a list of all users
 * @returns {Promise<User[]>} List of users
 */
export const getUsers = () => {
  return createAbortableRequest<User[]>({
    method: 'GET',
    url: '/users',
  });
};

/**
 * Retrieving user tasks
 * @param {number} id - user ID
 * @returns {Promise<Task[]>} List of user tasks
 */
export const getUserTasks = (id: number) => {
  return createAbortableRequest<Task[]>({
    method: 'GET',
    url: `/users/${id}/tasks`,
  });
};
