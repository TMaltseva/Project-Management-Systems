import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, message } from 'antd';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import Header from './components/Header/Header';
import Loader from './components/Loader/Loader';
import NotFound from './components/404/NotFound';
import TaskModal from './components/TaskModal/TaskModal';

import { ModalProvider } from './context/ModalContext';

import { checkConnection } from './api/api';

import BoardsPage from './pages/BoardsPage/BoardsPage';
import BoardPage from './pages/BoardPage/BoardPage';
import TasksPage from './pages/TasksPage/TasksPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const { Content } = Layout;

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkServerConnection = async () => {
      try {
        const connected = await checkConnection();
        setIsConnected(connected);

        if (!connected) {
          message.error('Failed to connect to the server. Check that the server is running.');
        }
      } catch {
        setIsConnected(false);
        message.error('An error occurred while connecting to the server.');
      }
    };

    checkServerConnection();
  }, []);

  if (isConnected === null) {
    return <Loader />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <Layout className="app-layout">
          <Header />
          <Content className="app-content">
            <Routes>
              <Route path="/" element={<Navigate to="/boards" replace />} />
              <Route path="/boards" element={<BoardsPage />} />
              <Route path="/board/:id" element={<BoardPage />} />
              <Route path="/issues" element={<TasksPage />} />
              <Route path="/tasks" element={<Navigate to="/issues" replace />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Content>
          <TaskModal />
        </Layout>
      </ModalProvider>

      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
};

export default App;
