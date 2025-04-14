import { TaskStatus, ApiError } from '.';

export interface GetTasksParams {
  search?: string;
  status?: TaskStatus;
  assignee?: number;
  board?: number;
}

export interface UpdateTaskResponse {
  message: string;
}

export type ApiResponse<T> = T | ApiError;

export interface CreateTaskResponse {
  id: number;
}
