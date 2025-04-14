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
        <ProjectFilled
          style={{
            fontSize: '24px',
            color: 'white',
            marginRight: '8px',
          }}
        />
        <span className="logo-text">PMS</span>
      </div>
      <div className="app-header__nav">
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[getSelectedKey()]}
          items={[
            {
              key: 'boards',
              icon: <ProjectOutlined />,
              label: 'Boards',
              onClick: () => navigate('/boards'),
            },
            {
              key: 'tasks',
              icon: <UnorderedListOutlined />,
              label: 'Tasks',
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
