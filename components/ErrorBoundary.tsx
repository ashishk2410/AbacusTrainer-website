'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: '#F9FAFB'
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            maxWidth: '600px',
            textAlign: 'center'
          }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#EF4444' }}>
              Something went wrong
            </h1>
            <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                color: 'white',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

