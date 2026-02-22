import type { ReactElement } from 'react';
import type { StatusIndicatorProps } from '../../types';

export function StatusIndicator({ status, animated = false }: StatusIndicatorProps): ReactElement {
  return (
    <div
      className={`status-indicator mt-2 ${status === 'active' ? 'status-active' : 'status-inactive'} ${
        animated ? 'animated-glow' : ''
      }`}
    ></div>
  );
}
