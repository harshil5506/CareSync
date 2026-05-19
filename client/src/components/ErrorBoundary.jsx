import React from "react";
import { AlertTriangle } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by boundary:", error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
            <div className="flex justify-center mb-4">
              <AlertTriangle
                className="text-red-600 dark:text-red-400"
                size={48}
              />
            </div>
            <h1 className="text-2xl font-bold text-center mb-4 text-foreground">
              Oops! Something went wrong
            </h1>
            <p className="text-center text-muted-foreground mb-2">
              An unexpected error has occurred.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="bg-gray-100 dark:bg-gray-700 rounded p-3 mb-4 text-sm text-foreground overflow-auto max-h-32">
                <p className="font-mono text-xs">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 font-medium"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
