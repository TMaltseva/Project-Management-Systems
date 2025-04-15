import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Skeleton, message } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { DndProvider } from 'react-dnd/dist/core';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { useBoards, useBoardTasks } from '@/hooks/api/useBoards';
import { useUpdateTaskStatus } from '@/hooks/api/useTask';
import { useModal } from '@/context/ModalContext';
import { TaskStatus, Task } from '@/types';

import TaskBoard from '@/components/TaskBoard/TaskBoard';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Loader from '@/components/Loader/Loader';

import './BoardPage.scss';

const { Title } = Typography;

const BoardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const boardId = id ? parseInt(id) : 0;
  const navigate = useNavigate();
  const { openTaskModal } = useModal();

  const { data: boards } = useBoards();
  const { data: tasks, isLoading, isError, refetch } = useBoardTasks(boardId);

  const updateTaskStatusMutation = useUpdateTaskStatus();

  const currentBoard = Array.isArray(boards)
    ? boards.find((board) => board.id === boardId)
    : undefined;

  const [localTasks, setLocalTasks] = useState<Task[]>([]);

  const [isRefetching, setIsRefetching] = useState(false);

  const handleBackClick = () => {
    navigate('/boards');
  };

  useEffect(() => {
    if (Array.isArray(tasks)) {
      setLocalTasks(tasks);
    }
  }, [tasks]);

  const handleTaskDrop = async (taskId: number, newStatus: TaskStatus) => {
    try {
      const updatedTasks = Array.isArray(tasks)
        ? tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
        : [];

      setLocalTasks(updatedTasks);

      await updateTaskStatusMutation.mutateAsync({ id: taskId, status: newStatus });
      message.success('Task status updated');

      refetch();
    } catch (error) {
      console.error('Error updating task status:', error);
      message.error('Failed to update task status');

      setLocalTasks(tasks || []);
    }
  };

  const handleRefetch = async () => {
    setIsRefetching(true);
    await refetch();
    setIsRefetching(false);
  };

  const handleTaskClick = (taskId: number) => {
    const task = Array.isArray(tasks) ? tasks.find((t) => t.id === taskId) : undefined;
    if (task) {
      const enrichedTask = {
        ...task,
        boardId: task.boardId || boardId,
        boardName: task.boardName || currentBoard?.name,
      };
      openTaskModal(enrichedTask);
    }
  };

  useEffect(() => {
    if (isNaN(boardId) || boardId < 1) {
      navigate('/boards');
    }
  }, [boardId, navigate]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <ErrorMessage
        title="Failed to load board"
        message="Could not load the board data. Please check your connection and try again."
        retry={handleRefetch}
      />
    );
  }

  return (
    <div className="board-page">
      <div className="board-page__header">
        <Button icon={<LeftOutlined />} onClick={handleBackClick}>
          Back to boards
        </Button>

        <div className="board-page__title">
          {currentBoard ? (
            <Title level={2}>{currentBoard.name}</Title>
          ) : (
            <Skeleton.Input active style={{ width: 200 }} />
          )}
        </div>
      </div>

      <div className="board-page__content">
        <DndProvider backend={HTML5Backend}>
          <TaskBoard
            tasks={localTasks}
            isLoading={isRefetching}
            onTaskDrop={handleTaskDrop}
            onTaskClick={handleTaskClick}
          />
        </DndProvider>
      </div>
    </div>
  );
};

export default BoardPage;
