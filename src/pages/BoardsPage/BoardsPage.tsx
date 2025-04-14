import React from 'react';
import { Card, List, Typography, Skeleton, Button, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowRightOutlined, ProjectOutlined } from '@ant-design/icons';
import { useBoards } from '@/hooks/useQueries';

import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

import './BoardsPage.scss';

const { Title, Paragraph, Text } = Typography;

const BoardsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: boards = [], isLoading, isError, refetch } = useBoards();

  const handleBoardClick = (boardId: number) => {
    navigate(`/board/${boardId}`);
  };

  if (isError) {
    return (
      <ErrorMessage
        title="Failed to load boards"
        message="Could not load the project boards. Please check your connection and try again."
        retry={() => refetch()}
      />
    );
  }

  return (
    <div className="boards-page">
      <div className="boards-page__header">
        <Title level={2}>Project boards</Title>
      </div>

      <div className="boards-page__content">
        {isLoading ? (
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 4 }}
            dataSource={Array(4).fill(0)}
            renderItem={() => (
              <List.Item>
                <Card>
                  <Skeleton active paragraph={{ rows: 2 }} />
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 4 }}
            dataSource={Array.isArray(boards) ? boards : []}
            renderItem={(board) =>
              board ? (
                <List.Item>
                  <Card hoverable className="board-card" onClick={() => handleBoardClick(board.id)}>
                    <div className="board-card__icon">
                      <ProjectOutlined />
                    </div>
                    <Title level={4} className="board-card__title">
                      {board.name}
                    </Title>
                    <Paragraph
                      ellipsis={{ rows: 2, expandable: false }}
                      className="board-card__description"
                    >
                      {board.description || 'No description'}
                    </Paragraph>
                    <div className="board-card__footer">
                      <Text type="secondary">Tasks: {board.taskCount}</Text>
                      <Tooltip title="Go to the board">
                        <Button
                          type="text"
                          icon={<ArrowRightOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBoardClick(board.id);
                          }}
                        />
                      </Tooltip>
                    </div>
                  </Card>
                </List.Item>
              ) : null
            }
          />
        )}
      </div>
    </div>
  );
};

export default BoardsPage;
