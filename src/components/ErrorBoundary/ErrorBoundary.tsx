import { Component, ErrorInfo } from 'react';
import './ErrorBoundary.scss';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error Boundary caught:', error, errorInfo);
    this.setState({
      hasError: true,
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2 className="error-boundary__title">Something went wrong</h2>
          <details className="error-boundary__details">
            {this.state.error?.toString()}
            <br />
            {this.state.errorInfo?.componentStack}
          </details>
          <button onClick={this.handleReset}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}
