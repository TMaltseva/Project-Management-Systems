import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import TaskCard from '@/components/TaskCard/TaskCard';
import { Task, TaskPriority, TaskStatus } from '@/types';

vi.mock('react-dnd', () => ({
  useDrag: () => [{ isDragging: false }, vi.fn()],
}));

describe('TaskCard Component', () => {
  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'This is a test task description',
    status: 'InProgress' as TaskStatus,
    priority: 'Medium' as TaskPriority,
    assignee: {
      id: 1,
      fullName: 'John Doe',
      email: 'john@example.com',
    },
    boardId: 1,
    boardName: 'Project Board',
  };

  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  test('renders task card with correct information', () => {
    render(<TaskCard task={mockTask} onClick={mockOnClick} />);

    // Check if task details are visible
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('This is a test task description')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('calls onClick when card is clicked', () => {
    render(<TaskCard task={mockTask} onClick={mockOnClick} />);

    fireEvent.click(screen.getByText('Test Task'));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('renders task with empty description', () => {
    const taskWithEmptyDescription = { ...mockTask, description: '' };
    render(<TaskCard task={taskWithEmptyDescription} onClick={mockOnClick} />);

    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('This is a test task description')).not.toBeInTheDocument();
  });

  test('renders task without assignee', () => {
    const taskWithoutAssignee = { ...mockTask, assignee: undefined };
    render(<TaskCard task={taskWithoutAssignee} onClick={mockOnClick} />);

    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  test('renders different priority colors', () => {
    const highPriorityTask = { ...mockTask, priority: 'High' as TaskPriority };
    const { rerender } = render(<TaskCard task={highPriorityTask} onClick={mockOnClick} />);

    expect(screen.getByText('High')).toBeInTheDocument();

    const lowPriorityTask = { ...mockTask, priority: 'Low' as TaskPriority };
    rerender(<TaskCard task={lowPriorityTask} onClick={mockOnClick} />);

    expect(screen.getByText('Low')).toBeInTheDocument();
  });
});
