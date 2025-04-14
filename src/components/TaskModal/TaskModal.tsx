import React from 'react';
import { Modal } from 'antd';
import TaskForm from '../TaskForm/TaskForm';
import { useModal } from '@/context/ModalContext';

import './TaskModal.scss';

const TaskModal: React.FC = () => {
  const { isTaskModalOpen, closeTaskModal, currentTask } = useModal();

  return (
    <Modal
      title={currentTask ? `Editing a task: ${currentTask.title}` : 'Creating a new task'}
      open={isTaskModalOpen}
      onCancel={closeTaskModal}
      footer={null}
      width={700}
      destroyOnClose
      className="task-modal"
    >
      <TaskForm initialValues={currentTask || undefined} onSuccess={closeTaskModal} />
    </Modal>
  );
};

export default TaskModal;
