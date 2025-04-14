import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '@/components/Header/Header';
import { ModalContext } from '@/context/ModalContext';
import { describe, test, expect, beforeEach, vi } from 'vitest';

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

describe('Header Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockOpenTaskModal.mockClear();
  });

  const renderWithContext = () => {
    return render(
      <ModalContext.Provider value={{ openTaskModal: mockOpenTaskModal } as any}>
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

  test('selects the correct menu item based on current location', () => {
    vi.mock('react-router-dom', () => ({
      ...vi.importActual('react-router-dom'),
      useLocation: () => ({ pathname: '/tasks' }),
      useNavigate: () => mockNavigate,
      MemoryRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    }));

    vi.resetModules();

    renderWithContext();

    const tasksMenuItem = screen.getByTestId('menu-item-tasks');
    const menuItemLi = tasksMenuItem.closest('li');
    expect(menuItemLi).toHaveClass('ant-menu-item-selected');

    // Since we're mocking the location to be /tasks, the Tasks menu item should be selected
    // This is a bit tricky to test with Ant Design's Menu, so we might need to add a data-testid
    // or find another way to verify the selection
  });
});
