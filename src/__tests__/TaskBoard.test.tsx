import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import TaskBoard from '@/components/TaskBoard/TaskBoard';
import { Task, TaskPriority, TaskStatus } from '@/types';

interface TaskColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  isLoading: boolean;
  onTaskDrop: (taskId: number, newStatus: TaskStatus) => void;
  onTaskClick: (taskId: number) => void;
}

vi.mock('@/components/TaskColumn/TaskColumn', () => ({
  default: ({ status, title, tasks }: TaskColumnProps) => (
    <div data-testid={`column-${status}`}>
      <h2>{title}</h2>
      <div>Tasks: {tasks.length}</div>
    </div>
  ),
}));

describe('TaskBoard Component', () => {
  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'Backlog Task',
      description: 'Description 1',
      status: 'Backlog' as TaskStatus,
      priority: 'Medium' as TaskPriority,
      assignee: { id: 1, fullName: 'John Doe', email: 'john@example.com' },
      boardId: 1,
      boardName: 'Project A',
    },
    {
      id: 2,
      title: 'In Progress Task',
      description: 'Description 2',
      status: 'InProgress' as TaskStatus,
      priority: 'High' as TaskPriority,
      assignee: { id: 2, fullName: 'Jane Smith', email: 'jane@example.com' },
      boardId: 1,
      boardName: 'Project A',
    },
    {
      id: 3,
      title: 'Done Task',
      description: 'Description 3',
      status: 'Done' as TaskStatus,
      priority: 'Low' as TaskPriority,
      assignee: { id: 1, fullName: 'John Doe', email: 'john@example.com' },
      boardId: 1,
      boardName: 'Project A',
    },
  ];

  const mockOnTaskDrop = vi.fn();
  const mockOnTaskClick = vi.fn();

  beforeEach(() => {
    mockOnTaskDrop.mockClear();
    mockOnTaskClick.mockClear();
  });

  test('renders three columns when tasks exist', () => {
    render(
      <TaskBoard
        tasks={mockTasks}
        isLoading={false}
        onTaskDrop={mockOnTaskDrop}
        onTaskClick={mockOnTaskClick}
      />
    );

    expect(screen.getByTestId('column-Backlog')).toBeInTheDocument();
    expect(screen.getByTestId('column-InProgress')).toBeInTheDocument();
    expect(screen.getByTestId('column-Done')).toBeInTheDocument();
  });

  test('renders empty state when no tasks', () => {
    render(
      <TaskBoard
        tasks={[]}
        isLoading={false}
        onTaskDrop={mockOnTaskDrop}
        onTaskClick={mockOnTaskClick}
      />
    );

    expect(screen.getByText('There are no tasks on this board')).toBeInTheDocument();
  });

  test('renders columns even when loading', () => {
    render(
      <TaskBoard
        tasks={mockTasks}
        isLoading={true}
        onTaskDrop={mockOnTaskDrop}
        onTaskClick={mockOnTaskClick}
      />
    );

    expect(screen.getByTestId('column-Backlog')).toBeInTheDocument();
    expect(screen.getByTestId('column-InProgress')).toBeInTheDocument();
    expect(screen.getByTestId('column-Done')).toBeInTheDocument();
  });

  test('does not show empty state when loading', () => {
    render(
      <TaskBoard
        tasks={[]}
        isLoading={true}
        onTaskDrop={mockOnTaskDrop}
        onTaskClick={mockOnTaskClick}
      />
    );

    expect(screen.queryByText('There are no tasks on this board')).not.toBeInTheDocument();
  });
});
