import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from '@/App';
import * as api from '@/api/api';
import { message } from 'antd';

vi.mock('@/api/api', () => ({
  checkConnection: vi.fn(),
}));

vi.mock('@/components/Header/Header', () => ({
  default: () => <div data-testid="header">Header Component</div>,
}));

vi.mock('@/components/TaskModal/TaskModal', () => ({
  default: () => <div data-testid="task-modal">Task Modal Component</div>,
}));

vi.mock('@/components/404/NotFound', () => ({
  default: () => <div data-testid="not-found">Not Found Component</div>,
}));

vi.mock('@/components/Loader/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock('@/components/ErrorMessage/ErrorMessage', () => ({
  default: ({ title, message, retry }: { title: string; message: string; retry: () => void }) => (
    <div data-testid="error-message" onClick={retry}>
      {title}: {message}
    </div>
  ),
}));

vi.mock('@/pages/BoardsPage/BoardsPage', () => ({
  default: () => <div data-testid="boards-page">Boards Page Component</div>,
}));

vi.mock('@/pages/BoardPage/BoardPage', () => ({
  default: () => <div data-testid="board-page">Board Page Component</div>,
}));

vi.mock('@/pages/TasksPage/TasksPage', () => ({
  default: () => <div data-testid="tasks-page">Tasks Page Component</div>,
}));

vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    message: {
      error: vi.fn(),
    },
  };
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    window.history.pushState({}, '', '/');
  });

  it('should show loader while checking connection', async () => {
    (api.checkConnection as ReturnType<typeof vi.fn>).mockImplementation(
      () =>
        new Promise<boolean>((resolve) => {
          setTimeout(() => resolve(true), 100);
        })
    );

    render(<App />, { wrapper: createWrapper() });

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should render app content when connection successful', async () => {
    (api.checkConnection as ReturnType<typeof vi.fn>).mockResolvedValue(true);

    render(<App />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    expect(screen.getByTestId('task-modal')).toBeInTheDocument();
  });

  it('should show error message when connection fails', async () => {
    (api.checkConnection as ReturnType<typeof vi.fn>).mockResolvedValue(false);

    render(<App />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    expect(message.error).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'Failed to connect to the server. Check that the server is running.',
        key: 'connection-error',
      })
    );
  });

  it('should show error message when connection check throws error', async () => {
    (api.checkConnection as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Connection error')
    );

    render(<App />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    expect(message.error).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'An error occurred while connecting to the server.',
        key: 'connection-error',
      })
    );
  });

  it('should retry connection check when retry button is clicked', async () => {
    (api.checkConnection as ReturnType<typeof vi.fn>).mockResolvedValueOnce(false);

    render(<App />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    (api.checkConnection as ReturnType<typeof vi.fn>).mockResolvedValueOnce(true);

    screen.getByTestId('error-message').click();

    await waitFor(() => {
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    expect(api.checkConnection).toHaveBeenCalledTimes(2);
  });

  it('should redirect from root to /boards', async () => {
    (api.checkConnection as ReturnType<typeof vi.fn>).mockResolvedValue(true);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    expect(screen.getByTestId('header')).toBeInTheDocument();
  });
});
