import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import TaskColumn from '@/components/TaskColumn/TaskColumn';
import { Task, TaskPriority, TaskStatus } from '@/types';

vi.mock('react-dnd', () => ({
  useDrop: () => [{ isOver: false, canDrop: false }, vi.fn()],
}));

vi.mock('@/components/TaskCard/TaskCard', () => ({
  default: ({ task, onClick }: { task: Task; onClick: () => void }) => (
    <div data-testid={`task-card-${task.id}`} onClick={onClick}>
      {task.title}
    </div>
  ),
}));

describe('TaskColumn Component', () => {
  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      status: 'InProgress' as TaskStatus,
      priority: 'Medium' as TaskPriority,
      assignee: { id: 1, fullName: 'John Doe', email: 'john@example.com' },
      boardId: 1,
      boardName: 'Project A',
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Description 2',
      status: 'InProgress' as TaskStatus,
      priority: 'High' as TaskPriority,
      assignee: { id: 2, fullName: 'Jane Smith', email: 'jane@example.com' },
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

  test('renders column with title and task count', () => {
    render(
      <TaskColumn
        status="InProgress"
        title="In Progress"
        tasks={mockTasks}
        isLoading={false}
        onTaskDrop={mockOnTaskDrop}
        onTaskClick={mockOnTaskClick}
      />
    );

    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Task count
  });

  test('renders skeleton loaders when loading', () => {
    render(
      <TaskColumn
        status="InProgress"
        title="In Progress"
        tasks={mockTasks}
        isLoading={true}
        onTaskDrop={mockOnTaskDrop}
        onTaskClick={mockOnTaskClick}
      />
    );

    expect(screen.queryByTestId('task-card-1')).not.toBeInTheDocument();
  });

  test('renders task cards when not loading', () => {
    render(
      <TaskColumn
        status="InProgress"
        title="In Progress"
        tasks={mockTasks}
        isLoading={false}
        onTaskDrop={mockOnTaskDrop}
        onTaskClick={mockOnTaskClick}
      />
    );

    expect(screen.getByTestId('task-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('task-card-2')).toBeInTheDocument();
  });

  test('calls onTaskClick when a task is clicked', () => {
    render(
      <TaskColumn
        status="InProgress"
        title="In Progress"
        tasks={mockTasks}
        isLoading={false}
        onTaskDrop={mockOnTaskDrop}
        onTaskClick={mockOnTaskClick}
      />
    );

    fireEvent.click(screen.getByTestId('task-card-1'));

    expect(mockOnTaskClick).toHaveBeenCalledWith(1);
  });

  test('renders empty column with no tasks', () => {
    render(
      <TaskColumn
        status="InProgress"
        title="In Progress"
        tasks={[]}
        isLoading={false}
        onTaskDrop={mockOnTaskDrop}
        onTaskClick={mockOnTaskClick}
      />
    );

    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument(); // Task count
    expect(screen.queryByTestId('task-card-1')).not.toBeInTheDocument();
  });
});
