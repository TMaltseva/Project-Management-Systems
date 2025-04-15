import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '@/components/Header/Header';
import { ModalContext } from '@/context/ModalContext';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import type { Task } from '@/types';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/boards' }),
  };
});

const mockNavigate = vi.fn();
const mockOpenTaskModal = vi.fn();

type ModalContextType = {
  isTaskModalOpen: boolean;
  openTaskModal: (task?: Task, redirectToBoardAfterSave?: boolean) => void;
  closeTaskModal: () => void;
  currentTask: Task | null;
  redirectToBoardAfterSave: boolean;
};

describe('Header Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockOpenTaskModal.mockClear();
  });

  const mockContextValue: Partial<ModalContextType> = {
    openTaskModal: mockOpenTaskModal,
    isTaskModalOpen: false,
    closeTaskModal: vi.fn(),
    currentTask: null,
    redirectToBoardAfterSave: false,
  };

  const renderWithContext = () => {
    return render(
      <ModalContext.Provider value={mockContextValue as ModalContextType}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </ModalContext.Provider>
    );
  };

  test('renders header with logo and navigation', () => {
    renderWithContext();

    // Check if logo is visible
    expect(screen.getByText('PMS')).toBeInTheDocument();

    // Check if navigation items exist
    expect(screen.getByText('Boards')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();

    // Check if create task button exists
    expect(screen.getByText('Create task')).toBeInTheDocument();
  });

  test('navigates to boards page when Boards is clicked', () => {
    renderWithContext();

    fireEvent.click(screen.getByText('Boards'));

    expect(mockNavigate).toHaveBeenCalledWith('/boards');
  });

  test('navigates to tasks page when Tasks is clicked', () => {
    renderWithContext();

    fireEvent.click(screen.getByText('Tasks'));

    expect(mockNavigate).toHaveBeenCalledWith('/tasks');
  });

  test('opens task modal when create task button is clicked', () => {
    renderWithContext();

    fireEvent.click(screen.getByText('Create task'));

    expect(mockOpenTaskModal).toHaveBeenCalled();
  });
});
