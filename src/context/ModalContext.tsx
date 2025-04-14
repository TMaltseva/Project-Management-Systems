import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Task } from '@/types';

interface ModalContextType {
  isTaskModalOpen: boolean;
  openTaskModal: (task?: Task, redirectToBoardAfterSave?: boolean) => void;
  closeTaskModal: () => void;
  currentTask: Task | null;
  redirectToBoardAfterSave: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [redirectToBoardAfterSave, setRedirectToBoardAfterSave] = useState(false);

  const openTaskModal = (task?: Task, redirectToBoard = false) => {
    setCurrentTask(task || null);
    setIsTaskModalOpen(true);
    setRedirectToBoardAfterSave(redirectToBoard);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setCurrentTask(null);
    setRedirectToBoardAfterSave(false);
  };

  return (
    <ModalContext.Provider
      value={{
        isTaskModalOpen,
        openTaskModal,
        closeTaskModal,
        currentTask,
        redirectToBoardAfterSave,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
