import React from 'react';
import { useQueryClient } from 'react-query';
import { Form, Input, Select, Button, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useBoards } from '@/hooks/api/useBoards';
import { useUsers } from '@/hooks/api/useUsers';
import { QueryKeys } from '@/types/api';
import { useCreateTask, useUpdateTask } from '@/hooks/api/useTask';
import { useTaskForm } from '@/hooks/useTaskForm';
import { Task, TaskPriority, TaskStatus } from '@/types';
import { useModal } from '@/context/ModalContext';

import './TaskForm.scss';

const { TextArea } = Input;
const { Option } = Select;

interface TaskFormProps {
  initialValues?: Partial<Task>;
  onSuccess?: () => void;
}

interface FormValues {
  title: string;
  description: string;
  boardId: number;
  assigneeId: number;
  status?: TaskStatus;
  priority: TaskPriority;
}

const TaskForm: React.FC<TaskFormProps> = ({ initialValues, onSuccess }) => {
  const navigate = useNavigate();
  const { form, isDraft, saveDraft, clearDraft, getCreateTaskValues, getUpdateTaskValues } =
    useTaskForm(initialValues);
  const { redirectToBoardAfterSave } = useModal();

  const { data: boards, isLoading: isLoadingBoards } = useBoards();
  const { data: users, isLoading: isLoadingUsers } = useUsers();

  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const queryClient = useQueryClient();

  const handleValuesChange = (): void => {
    saveDraft();
  };

  const handleSubmit = async (values: FormValues): Promise<void> => {
    try {
      if (initialValues?.id) {
        await updateTaskMutation.mutateAsync({
          id: initialValues.id,
          ...getUpdateTaskValues(),
        });
        if (values.boardId) {
          queryClient.invalidateQueries([QueryKeys.BOARD_TASKS, values.boardId]);
        }
      } else {
        await createTaskMutation.mutateAsync(getCreateTaskValues());
        message.success('Task created successfully');
      }

      clearDraft();

      if (redirectToBoardAfterSave && values.boardId) {
        navigate(`/board/${values.boardId}`);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Failed to save task');
    }
  };

  const handleReset = () => {
    const initialAssigneeId = initialValues?.assignee?.id;

    form.resetFields();

    if (initialAssigneeId) {
      form.setFieldValue('assigneeId', initialAssigneeId);
    }
  };

  const handleGotoBoard = (): void => {
    const formBoardId: unknown = form.getFieldValue('boardId');

    const boardId: string | undefined =
      formBoardId !== undefined && formBoardId !== null
        ? String(formBoardId)
        : initialValues?.boardId !== undefined && initialValues?.boardId !== null
          ? String(initialValues.boardId)
          : undefined;

    if (boardId) {
      if (onSuccess) {
        onSuccess();
      }
      navigate(`/board/${boardId}`);
    } else {
      message.error('Board ID not found');
    }
  };

  const isLoading =
    isLoadingBoards ||
    isLoadingUsers ||
    createTaskMutation.isLoading ||
    updateTaskMutation.isLoading;

  return (
    <Form<FormValues>
      form={form}
      layout="vertical"
      onValuesChange={handleValuesChange}
      onFinish={handleSubmit}
      initialValues={initialValues as FormValues}
      className="task-form"
    >
      {isDraft && !initialValues?.id && (
        <div className="task-form__draft-notice">Loaded draft from previous session</div>
      )}

      <Form.Item
        name="title"
        label="Task name"
        rules={[{ required: true, message: 'Please enter a task name' }]}
      >
        <Input placeholder="Enter a task name" />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <TextArea rows={4} placeholder="Enter a task description" />
      </Form.Item>

      <Form.Item label="Project:">
        {initialValues?.boardId ? (
          <div className="task-form__board-display">
            {initialValues.boardName ||
              (Array.isArray(boards)
                ? boards.find((b) => b.id === initialValues.boardId)?.name
                : `Board #${initialValues.boardId}`)}
          </div>
        ) : (
          <Form.Item
            name="boardId"
            noStyle
            rules={[{ required: true, message: 'Please select a project' }]}
          >
            <Select placeholder="Select a project" loading={isLoadingBoards}>
              {Array.isArray(boards) ? (
                boards.map((board) => (
                  <Option key={board.id} value={board.id}>
                    {board.name}
                  </Option>
                ))
              ) : (
                <Option value={0}>No boards available</Option>
              )}
            </Select>
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item name="status" label="Status">
        <Select placeholder="Select status">
          <Option value="Backlog">To Do</Option>
          <Option value="InProgress">In Progress</Option>
          <Option value="Done">Done</Option>
        </Select>
      </Form.Item>

      <Form.Item name="priority" label="Priority">
        <Select placeholder="Select priority">
          <Option value="Low">Low</Option>
          <Option value="Medium">Medium</Option>
          <Option value="High">High</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="assigneeId"
        label="Asignee"
        rules={[{ required: true, message: 'Please select an assignee' }]}
      >
        <Select placeholder="Select an assignee" loading={isLoadingUsers}>
          {Array.isArray(users) ? (
            users.map((user) => (
              <Option key={user.id} value={user.id}>
                {user.fullName}
              </Option>
            ))
          ) : (
            <Option value={0}>No users available</Option>
          )}
        </Select>
      </Form.Item>

      <div className="task-form__button-group">
        {initialValues?.id && (initialValues.boardId || form.getFieldValue('boardId')) && (
          <Button type="link" onClick={handleGotoBoard} className="task-form__board-link">
            Go to board
          </Button>
        )}

        <Space>
          <Button onClick={handleReset}>Reset</Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {initialValues?.id ? 'Update' : 'Create'} task
          </Button>
        </Space>
      </div>
    </Form>
  );
};

export default TaskForm;
