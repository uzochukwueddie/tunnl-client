import type { ReactElement } from 'react';
import type { LoadingSpinnerProps } from '../../types';

export function LoadingSpinner({ text }: LoadingSpinnerProps): ReactElement {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tunnel-500"></div>
      {text && <p className="text-slate-400 mt-3">{text}</p>}
    </div>
  );
}
