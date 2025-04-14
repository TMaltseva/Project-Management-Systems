export interface Board {
  id: number;
  name: string;
  description: string;
  taskCount: number;
}

export type TaskStatus = 'Backlog' | 'InProgress' | 'Done';

export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface User {
  id: number;
  fullName: string;
  email: string;
  avatarUrl?: string;
  description?: string;
  tasksCount?: number;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: User;
  boardId: number;
  boardName?: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  priority: TaskPriority;
  boardId: number;
  assigneeId: number;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assigneeId?: number;
}

export interface UpdateTaskStatusDto {
  status: TaskStatus;
}

export interface ApiError {
  error: string;
  message: string;
}
