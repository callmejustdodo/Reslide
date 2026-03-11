import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
  slideIndex: number;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SlideErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[Reslide] Error in slide ${this.props.slideIndex + 1}:`, error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--rs-color-background, #0a0a0a)',
            color: 'var(--rs-color-text, #fafafa)',
            fontFamily: 'var(--rs-font-body)',
            padding: '2rem',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }}>
            Slide {this.props.slideIndex + 1}
          </div>
          <div style={{ fontSize: '1.25rem', color: '#ef4444', marginBottom: '0.5rem' }}>
            Error rendering slide
          </div>
          <pre
            style={{
              fontSize: '0.875rem',
              opacity: 0.6,
              maxWidth: '600px',
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
            }}
          >
            {this.state.error?.message}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
