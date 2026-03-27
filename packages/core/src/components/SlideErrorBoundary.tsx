import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert.js';
import { Badge } from '@/components/ui/badge.js';

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
          <Badge variant="outline" className="mb-4 text-lg px-4 py-1">
            Slide {this.props.slideIndex + 1}
          </Badge>
          <Alert variant="destructive" className="max-w-xl">
            <AlertTitle>Error rendering slide</AlertTitle>
            <AlertDescription>
              <pre className="text-sm mt-2 whitespace-pre-wrap opacity-80">
                {this.state.error?.message}
              </pre>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
