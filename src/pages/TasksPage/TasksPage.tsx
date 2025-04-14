import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Select,
  Tag,
  Typography,
  Tooltip,
  Row,
  Col,
  Card,
} from 'antd';
import { SearchOutlined, FilterOutlined, EyeOutlined, ProjectOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTasks, useBoards, useUsers } from '@/hooks/useQueries';
import { useModal } from '@/context/ModalContext';
import { Task, TaskPriority, TaskStatus } from '@/types';
import { GetTasksParams } from '@/types/api';
import Loader from '@/components/Loader/Loader';

import './TasksPage.scss';

const { Title } = Typography;
const { Option } = Select;

const PriorityTag: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
  const colorMap: Record<TaskPriority, string> = {
    Low: 'green',
    Medium: 'blue',
    High: 'red',
  };

  return <Tag color={colorMap[priority]}>{priority}</Tag>;
};

const StatusTag: React.FC<{ status: TaskStatus }> = ({ status }) => {
  const colorMap: Record<TaskStatus, string> = {
    Backlog: 'default',
    InProgress: 'processing',
    Done: 'success',
  };

  const labelMap: Record<TaskStatus, string> = {
    Backlog: 'To Do',
    InProgress: 'In Progress',
    Done: 'Done',
  };

  return <Tag color={colorMap[status]}>{labelMap[status]}</Tag>;
};

type EmptyString = '';

const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  const { openTaskModal } = useModal();

  const [params, setParams] = useState<GetTasksParams>({});

  const [searchValue, setSearchValue] = useState<string>('');

  const { data: tasks, isLoading } = useTasks(params);
  const { data: boards } = useBoards();
  const { data: users } = useUsers();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setParams((prev) => ({ ...prev, search: searchValue }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleStatusChange = (status: TaskStatus | EmptyString): void => {
    setParams((prev) => ({
      ...prev,
      status: status || undefined,
    }));
  };

  const handleBoardChange = (boardId: number | EmptyString): void => {
    setParams((prev) => ({
      ...prev,
      board: boardId || undefined,
    }));
  };

  const handleAssigneeChange = (assigneeId: number | EmptyString): void => {
    setParams((prev) => ({
      ...prev,
      assignee: assigneeId || undefined,
    }));
  };

  const handleResetFilters = (): void => {
    setParams({});
    setSearchValue('');
  };

  const handleRowClick = (task: Task): void => {
    const enrichedTask = { ...task };

    if (params.board && !task.boardId) {
      enrichedTask.boardId = params.board;

      if (Array.isArray(boards)) {
        const board = boards.find((b) => b.id === params.board);
        if (board) {
          enrichedTask.boardName = board.name;
        }
      }
    }

    if (!task.boardId && task.boardName && Array.isArray(boards)) {
      const board = boards.find((b) => b.name === task.boardName);
      if (board) {
        enrichedTask.boardId = board.id;
      }
    }

    if (params.assignee && !task.assignee) {
      if (Array.isArray(users)) {
        const user = users.find((u) => u.id === params.assignee);
        if (user) {
          enrichedTask.assignee = user;
        }
      }
    }

    openTaskModal(enrichedTask);
  };

  const handleGoToBoard = (
    boardId: number | undefined,
    taskId: number,
    boardName?: string
  ): void => {
    console.log('GoToBoard called with:', { boardId, taskId, boardName, params });

    if (!boardId && params.board) {
      navigate(`/board/${params.board}`, { state: { taskId } });
      return;
    }

    if (!boardId && boardName && Array.isArray(boards)) {
      const board = boards.find((b) => b.name === boardName);
      if (board) {
        navigate(`/board/${board.id}`, { state: { taskId } });
        return;
      }
    }

    if (boardId) {
      navigate(`/board/${boardId}`, { state: { taskId } });
    }
  };

  type RenderFunction<T> = (value: T, record: Task, index: number) => React.ReactNode;

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: ((text: string) => <strong>{text}</strong>) as RenderFunction<string>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: ((status: TaskStatus) => <StatusTag status={status} />) as RenderFunction<TaskStatus>,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 120,
      render: ((priority: TaskPriority) => (
        <PriorityTag priority={priority} />
      )) as RenderFunction<TaskPriority>,
    },
    {
      title: 'Board',
      dataIndex: 'boardName',
      key: 'boardName',
      width: 200,
      render: ((boardName: string) => {
        if (params.board && !boardName) {
          const board = boards?.find((b) => b.id === params.board);
          return board ? board.name : `Board #${params.board}`;
        }
        return boardName || '-';
      }) as RenderFunction<string>,
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      key: 'assignee',
      width: 200,
      render: ((assignee: Task['assignee']) => {
        if (assignee) {
          if (typeof assignee === 'object' && assignee.fullName) {
            return assignee.fullName;
          } else if (typeof assignee === 'number') {
            const user = users?.find((u) => u.id === assignee);
            return user ? user.fullName : `User #${assignee}`;
          }
        }
        return '-';
      }) as RenderFunction<Task['assignee']>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: ((_: unknown, record: Task) => (
        <Space>
          <Tooltip title="View task">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleRowClick(record);
              }}
            />
          </Tooltip>
          <Tooltip title="Go to board">
            <Button
              icon={<ProjectOutlined />}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                const boardId = record.boardId || params.board;
                if (boardId) {
                  handleGoToBoard(boardId, record.id, record.boardName);
                } else if (record.boardName) {
                  handleGoToBoard(undefined, record.id, record.boardName);
                }
              }}
              disabled={!record.boardId && !record.boardName && !params.board}
            />
          </Tooltip>
        </Space>
      )) as RenderFunction<unknown>,
    },
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="tasks-page">
      <div className="tasks-page__header">
        <Title level={2}>All tasks</Title>
      </div>

      <Card className="tasks-page__filters">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            <Input
              placeholder="Search by task title"
              value={searchValue}
              onChange={handleSearchChange}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} sm={8} md={6} lg={5} xl={4}>
            <Select<TaskStatus | EmptyString>
              placeholder="Filter by status"
              style={{ width: '100%' }}
              allowClear
              value={params.status || undefined}
              onChange={handleStatusChange}
            >
              <Option value="Backlog">To Do</Option>
              <Option value="InProgress">In Progress</Option>
              <Option value="Done">Done</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={6} lg={5} xl={4}>
            <Select<number | EmptyString>
              placeholder="Filter by board"
              style={{ width: '100%' }}
              allowClear
              value={params.board || undefined}
              onChange={handleBoardChange}
            >
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
          </Col>
          <Col xs={24} sm={8} md={6} lg={5} xl={4}>
            <Select<number | EmptyString>
              placeholder="Filter by assignee"
              style={{ width: '100%' }}
              allowClear
              value={params.assignee || undefined}
              onChange={handleAssigneeChange}
            >
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
          </Col>
          <Col>
            <Button icon={<FilterOutlined />} onClick={handleResetFilters}>
              Reset
            </Button>
          </Col>
        </Row>
      </Card>

      <div className="tasks-page__content">
        <Table<Task>
          dataSource={Array.isArray(tasks) ? tasks : []}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
          }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
          locale={{ emptyText: 'There are no tasks matching the filters' }}
          loading={isLoading}
          className="tasks-table"
        />
      </div>
    </div>
  );
};

export default TasksPage;
