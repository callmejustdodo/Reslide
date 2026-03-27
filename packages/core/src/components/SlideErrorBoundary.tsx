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
        <div className="w-full h-full flex flex-col items-center justify-center bg-rs-background text-rs-text font-body p-8">
          <div className="text-3xl mb-4 opacity-50">
            Slide {this.props.slideIndex + 1}
          </div>
          <div className="text-xl text-destructive mb-2">
            Error rendering slide
          </div>
          <pre className="text-sm opacity-60 max-w-xl overflow-auto whitespace-pre-wrap">
            {this.state.error?.message}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
