import React from 'react';
import { Empty } from 'antd';
import { Task, TaskStatus } from '@/types';
import TaskColumn from '../TaskColumn/TaskColumn';

import './TaskBoard.scss';

interface TaskBoardProps {
  tasks: Task[];
  isLoading: boolean;
  onTaskDrop: (taskId: number, newStatus: TaskStatus) => void;
  onTaskClick: (taskId: number) => void;
}

const STATUSES: { id: TaskStatus; label: string }[] = [
  { id: 'Backlog', label: 'To Do' },
  { id: 'InProgress', label: 'In Progress' },
  { id: 'Done', label: 'Done' },
];

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, isLoading, onTaskDrop, onTaskClick }) => {
  const hasNoTasks = !isLoading && (!tasks || tasks.length === 0);

  const getTasksByStatus = (status: TaskStatus): Task[] => {
    return Array.isArray(tasks) ? tasks.filter((task) => task.status === status) : [];
  };

  return (
    <div className="task-board">
      {hasNoTasks ? (
        <div className="task-board__empty">
          <Empty
            description="There are no tasks on this board"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      ) : (
        <div className="task-board__columns">
          {STATUSES.map((status) => (
            <TaskColumn
              key={status.id}
              status={status.id}
              title={status.label}
              tasks={getTasksByStatus(status.id)}
              isLoading={isLoading}
              onTaskDrop={onTaskDrop}
              onTaskClick={onTaskClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
