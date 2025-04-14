import React, { useRef } from 'react';
import { Card, Typography, Avatar, Tag, Tooltip } from 'antd';
import { useDrag } from 'react-dnd';
import { Task, TaskPriority, TaskStatus } from '@/types';

import './TaskCard.scss';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

interface DragItem {
  id: number;
  status: TaskStatus;
}

interface DraggedItemProps {
  isDragging: boolean;
}

const { Text, Paragraph } = Typography;

const PriorityTag: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
  const colorMap: Record<TaskPriority, string> = {
    Low: 'green',
    Medium: 'blue',
    High: 'red',
  };

  return <Tag color={colorMap[priority]}>{priority}</Tag>;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const dragRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, connectDrag] = useDrag<DragItem, DraggedItemProps>({
    type: 'TASK',
    item: {
      id: task.id,
      status: task.status,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  React.useEffect(() => {
    if (connectDrag) {
      connectDrag(dragRef);
    }
  }, [connectDrag]);

  const cardStyle: React.CSSProperties = {
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={dragRef} style={cardStyle} className="task-card-wrapper">
      <Card onClick={onClick} hoverable className="task-card" size="small">
        <div className="task-card__header">
          <div className="task-card__id">#{task.id}</div>
          <PriorityTag priority={task.priority} />
        </div>

        <Paragraph ellipsis={{ rows: 2, expandable: false }} className="task-card__title">
          {task.title}
        </Paragraph>

        {task.description && (
          <Paragraph
            ellipsis={{ rows: 2, expandable: false }}
            type="secondary"
            className="task-card__description"
          >
            {task.description}
          </Paragraph>
        )}

        {task.assignee && (
          <div className="task-card__footer">
            <Tooltip title={task.assignee.fullName}>
              <div className="task-card__assignee">
                {task.assignee.avatarUrl ? (
                  <Avatar src={task.assignee.avatarUrl} size="small" alt={task.assignee.fullName} />
                ) : (
                  <Avatar size="small" alt={task.assignee.fullName}>
                    {task.assignee.fullName.charAt(0).toUpperCase()}
                  </Avatar>
                )}
                <Text ellipsis className="task-card__assignee-name">
                  {task.assignee.fullName}
                </Text>
              </div>
            </Tooltip>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TaskCard;
