import { TaskStatus } from '../types';

export interface DragItem {
  id: number;
  type: string;
  status: TaskStatus;
}

/**
 * Defines a class for a column during drag-and-drop process
 * @param isOver - the dragged element is above the column
 * @param canDrop - you can drop an element into this column
 * @returns a string with classes to style
 */
export const getColumnClassName = (isOver: boolean, canDrop: boolean): string => {
  let className = 'task-column';

  if (canDrop) {
    className += ' task-column--can-drop';
  }

  if (isOver && canDrop) {
    className += ' task-column--is-over';
  }

  return className;
};

/**
 * Returns styles for the dragged card
 * @param isDragging - the element is being dragged
 * @returns styles object
 */
export const getDragItemStyles = (isDragging: boolean): React.CSSProperties => {
  return {
    opacity: isDragging ? 0.4 : 1,
    cursor: 'move',
  };
};
