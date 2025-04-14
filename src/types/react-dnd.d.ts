declare module 'react-dnd' {
  import { RefObject } from 'react';

  export interface DndProviderProps {
    backend: unknown;
    context?: unknown;
    options?: unknown;
    children: React.ReactNode;
  }

  export const DndProvider: React.FC<DndProviderProps>;

  export interface DragSourceMonitor {
    canDrag(): boolean;
    isDragging(): boolean;
    getItemType(): string;
    getItem<T>(): T;
    getDropResult<T>(): T | null;
    didDrop(): boolean;
  }

  export interface DropTargetMonitor {
    canDrop(): boolean;
    isOver(options?: { shallow?: boolean }): boolean;
    getItemType(): string;
    getItem<T>(): T;
    getDropResult<T>(): T | null;
    didDrop(): boolean;
  }

  type ConnectDragSource = <T extends HTMLElement>(elementRef: RefObject<T>) => void;
  type ConnectDropTarget = <T extends HTMLElement>(elementRef: RefObject<T>) => void;

  export function useDrag<DragObject, CollectedProps>(spec: {
    type: string;
    item: DragObject | ((monitor: DragSourceMonitor) => DragObject);
    collect: (monitor: DragSourceMonitor) => CollectedProps;
    canDrag?: boolean | ((monitor: DragSourceMonitor) => boolean);
    isDragging?: boolean | ((monitor: DragSourceMonitor) => boolean);
  }): [CollectedProps, ConnectDragSource];

  export function useDrop<DragObject, CollectedProps>(spec: {
    accept: string | string[];
    collect: (monitor: DropTargetMonitor) => CollectedProps;
    drop?: (item: DragObject, monitor: DropTargetMonitor) => void;
    hover?: (item: DragObject, monitor: DropTargetMonitor) => void;
    canDrop?: boolean | ((item: DragObject, monitor: DropTargetMonitor) => boolean);
  }): [CollectedProps, ConnectDropTarget];
}

declare module 'react-dnd/dist/core' {
  export * from 'react-dnd';
}

declare module 'react-dnd-html5-backend' {
  const HTML5Backend: unknown;
  export { HTML5Backend };
}
