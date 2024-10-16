import React, { Component } from 'react';

class MyErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Une erreur s'est produite. Veuillez réessayer plus tard.</div>;
    }

    return this.props.children;
  }
}

export default MyErrorBoundary;
