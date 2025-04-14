import React from 'react';
import { Result, Button } from 'antd';

import './ErrorMessage.scss';

interface ErrorMessageProps {
  title: string;
  message: string;
  retry?: () => void;
}

/**
 * Component for displaying error messages
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ title, message, retry }) => {
  return (
    <div className="error-message">
      <Result
        status="error"
        title={title}
        subTitle={message}
        extra={
          retry && (
            <Button type="primary" onClick={retry}>
              Try again
            </Button>
          )
        }
      />
    </div>
  );
};

export default ErrorMessage;
