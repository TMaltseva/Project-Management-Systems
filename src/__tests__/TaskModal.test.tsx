import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import TaskModal from '@/components/TaskModal/TaskModal';
import { Task, TaskPriority, TaskStatus } from '@/types';
import * as ModalContextModule from '@/context/ModalContext';

interface TaskFormProps {
  initialValues?: Partial<Task>;
  onSuccess?: () => void;
}

vi.mock('@/components/TaskForm/TaskForm', () => ({
  default: ({ initialValues }: TaskFormProps) => (
    <div data-testid="task-form">
      {initialValues ? `Editing: ${initialValues.title}` : 'Creating new task'}
    </div>
  ),
}));

vi.mock('@/context/ModalContext', () => {
  return {
    useModal: vi.fn(),
  };
});

describe('TaskModal Component', () => {
  const mockCloseTaskModal = vi.fn();
  const mockOpenTaskModal = vi.fn();

  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    status: 'InProgress' as TaskStatus,
    priority: 'Medium' as TaskPriority,
    assignee: { id: 1, fullName: 'John Doe', email: 'john@example.com' },
    boardId: 1,
    boardName: 'Project Board',
  };

  beforeEach(() => {
    mockCloseTaskModal.mockClear();
    mockOpenTaskModal.mockClear();
  });

  test('renders modal with create task title when no current task', () => {
    vi.mocked(ModalContextModule.useModal).mockReturnValue({
      isTaskModalOpen: true,
      closeTaskModal: mockCloseTaskModal,
      currentTask: null,
      openTaskModal: mockOpenTaskModal,
      redirectToBoardAfterSave: false,
    });

    render(<TaskModal />);

    expect(screen.getByText('Creating a new task')).toBeInTheDocument();
    expect(screen.getByTestId('task-form')).toBeInTheDocument();
    expect(screen.getByText('Creating new task')).toBeInTheDocument();
  });

  test('renders modal with edit task title when current task exists', () => {
    vi.mocked(ModalContextModule.useModal).mockReturnValue({
      isTaskModalOpen: true,
      closeTaskModal: mockCloseTaskModal,
      currentTask: mockTask,
      openTaskModal: mockOpenTaskModal,
      redirectToBoardAfterSave: false,
    });

    render(<TaskModal />);

    expect(screen.getByText('Editing a task: Test Task')).toBeInTheDocument();
    expect(screen.getByTestId('task-form')).toBeInTheDocument();
    expect(screen.getByText('Editing: Test Task')).toBeInTheDocument();
  });

  test('does not render modal when isTaskModalOpen is false', () => {
    vi.mocked(ModalContextModule.useModal).mockReturnValue({
      isTaskModalOpen: false,
      closeTaskModal: mockCloseTaskModal,
      currentTask: null,
      openTaskModal: mockOpenTaskModal,
      redirectToBoardAfterSave: false,
    });

    render(<TaskModal />);

    expect(screen.queryByText('Creating a new task')).not.toBeInTheDocument();
  });
});
