import React, { useRef, useEffect } from 'react';
import { Typography, Skeleton } from 'antd';
import { useDrop } from 'react-dnd';
import { Task, TaskStatus } from '@/types';
import TaskCard from '../TaskCard/TaskCard';

import './TaskColumn.scss';

interface TaskColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  isLoading: boolean;
  onTaskDrop: (taskId: number, newStatus: TaskStatus) => void;
  onTaskClick: (taskId: number) => void;
}

interface DragItem {
  id: number;
  status: TaskStatus;
}

interface DropCollectedProps {
  isOver: boolean;
  canDrop: boolean;
}

const { Title } = Typography;

const TaskColumn: React.FC<TaskColumnProps> = ({
  status,
  title,
  tasks,
  isLoading,
  onTaskDrop,
  onTaskClick,
}) => {
  const dropRef = useRef<HTMLDivElement>(null);

  const [collected, connectDrop] = useDrop<DragItem, DropCollectedProps>({
    accept: 'TASK',
    drop: (item) => {
      onTaskDrop(item.id, status);
    },
    canDrop: (item) => item.status !== status,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const { isOver, canDrop } = collected;

  useEffect(() => {
    if (connectDrop) {
      connectDrop(dropRef);
    }
  }, [connectDrop]);

  useEffect(() => {
    console.log('Tasks updated in column:', status, tasks);
  }, [tasks, status]);

  const getColumnClass = () => {
    let className = 'task-column';

    if (canDrop) {
      className += ' task-column--can-drop';
    }

    if (isOver && canDrop) {
      className += ' task-column--is-over';
    }

    return className;
  };

  return (
    <div ref={dropRef} className={getColumnClass()}>
      <div className="task-column__header">
        <Title level={4} className="task-column__title">
          {title}
        </Title>
        <div className="task-column__counter">
          {isLoading ? <Skeleton.Button active size="small" /> : tasks.length}
        </div>
      </div>

      <div className="task-column__content">
        {isLoading ? (
          Array(3)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="task-column__skeleton">
                <Skeleton active paragraph={{ rows: 2 }} />
              </div>
            ))
        ) : (
          <>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task.id)} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
