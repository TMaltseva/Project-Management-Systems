import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  PlusOutlined,
  ProjectOutlined,
  UnorderedListOutlined,
  ProjectFilled,
} from '@ant-design/icons';
import { useModal } from '@/context/ModalContext';

import './Header.scss';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { openTaskModal } = useModal();

  const getSelectedKey = () => {
    const pathname = location.pathname;
    if (pathname.startsWith('/board/')) return 'boards';
    if (pathname.startsWith('/boards')) return 'boards';
    if (pathname.startsWith('/tasks')) return 'tasks';
    return '';
  };

  return (
    <AntHeader className="app-header">
      <div className="app-header__logo">
        <ProjectFilled className="logo-icon" />
        <span className="logo-text">PMS</span>
      </div>
      <div className="app-header__nav">
        <Menu
          data-testid="main-menu"
          theme="dark"
          mode="horizontal"
          selectedKeys={[getSelectedKey()]}
          items={[
            {
              key: 'boards',
              icon: <ProjectOutlined />,
              label: <span data-testid="menu-item-boards">Boards</span>,
              onClick: () => navigate('/boards'),
            },
            {
              key: 'tasks',
              icon: <UnorderedListOutlined />,
              label: <span data-testid="menu-item-tasks">Tasks</span>,
              onClick: () => navigate('/tasks'),
            },
          ]}
        />
      </div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => openTaskModal()}
        className="create-task-btn"
      >
        <span className="desktop-only">Create task</span>
      </Button>
    </AntHeader>
  );
};

export default Header;
