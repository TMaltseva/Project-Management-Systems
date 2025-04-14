import { useDrag, useDrop } from 'react-dnd';
import { TaskStatus } from '../types';
import { DragItem } from '../utils/dragAndDrop';

/**
 * Hook for adding drag functionality to a task
 * @param id - task id
 * @param currentStatus - current task status
 * @returns object with drag interface and ref connection function
 */
export const useTaskDrag = (id: number, currentStatus: TaskStatus) => {
  return useDrag({
    type: 'TASK',
    item: {
      id,
      type: 'TASK',
      status: currentStatus,
    } as const,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
};

/**
 * Hook to add drop functionality to a column
 * @param status - column status
 * @param onDrop - function called when drop occurs
 * @returns object with drop interface and ref connection function
 */
export const useColumnDrop = (
  status: TaskStatus,
  onDrop: (taskId: number, newStatus: TaskStatus) => void
) => {
  return useDrop({
    accept: 'TASK',
    drop: (item: DragItem) => {
      if (item.status !== status) {
        onDrop(item.id, status);
      }
    },
    canDrop: (item: DragItem) => item.status !== status,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
};
