import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for not exist or has been moved.</p>
      <Link to="/" className="home-link">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
