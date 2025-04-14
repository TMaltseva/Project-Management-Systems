import { useState, useEffect } from 'react';
import { Form } from 'antd';
import { Task, CreateTaskDto, TaskStatus, UpdateTaskDto } from '@/types';

const DRAFT_KEY = 'task-form-draft';

interface TaskFormValues extends CreateTaskDto {
  status?: TaskStatus;
}

export const useTaskForm = (initialValues?: Partial<Task>) => {
  const [form] = Form.useForm<TaskFormValues>();
  const [isDraft, setIsDraft] = useState(false);

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      const formValues: TaskFormValues = {
        title: initialValues.title || '',
        description: initialValues.description || '',
        priority: initialValues.priority || 'Medium',
        boardId: initialValues.boardId || 0,
        assigneeId: initialValues.assignee?.id || 0,
        status: initialValues.status,
      };

      form.setFieldsValue(formValues);
      return;
    }

    const draftJson = localStorage.getItem(DRAFT_KEY);
    if (draftJson) {
      try {
        const draft = JSON.parse(draftJson) as TaskFormValues;
        form.setFieldsValue(draft);
        setIsDraft(true);
      } catch (e) {
        console.error('Error parsing draft', e);
        localStorage.removeItem(DRAFT_KEY);
      }
    }
  }, [form, initialValues]);

  const saveDraft = () => {
    if (initialValues?.id) {
      return;
    }

    const values = form.getFieldsValue();

    const hasValues = Object.values(values).some(
      (val) => val !== undefined && val !== null && val !== ''
    );

    if (hasValues) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
      setIsDraft(true);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setIsDraft(false);
  };

  const getCreateTaskValues = (): CreateTaskDto => {
    const values = form.getFieldsValue();
    return {
      title: values.title,
      description: values.description,
      priority: values.priority,
      boardId: values.boardId,
      assigneeId: values.assigneeId,
    };
  };

  const getUpdateTaskValues = (): UpdateTaskDto => {
    const values = form.getFieldsValue();
    return {
      title: values.title,
      description: values.description,
      priority: values.priority,
      status: values.status,
      assigneeId: values.assigneeId,
    };
  };

  return {
    form,
    isDraft,
    saveDraft,
    clearDraft,
    getCreateTaskValues,
    getUpdateTaskValues,
  };
};

export default useTaskForm;
