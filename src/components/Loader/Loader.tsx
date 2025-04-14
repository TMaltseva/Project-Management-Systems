import React from 'react';

import './Loader.scss';

const Loading: React.FC = () => {
  return (
    <div className="loading">
      <div className="loading__spinner" />
      <p className="loading__text">Loading...</p>
    </div>
  );
};

export default Loading;
