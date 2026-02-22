import type { StatusBadgeProps } from '../../types';

export function StatusBadge({ status, children, uppercase = true }: StatusBadgeProps) {
  const getStatusClass = () => {
    switch (status) {
      case 'active':
      case 'success':
        return 'badge-success';
      case 'inactive':
      case 'error':
        return 'badge-error';
      case 'warning':
        return 'badge-warning';
      case 'info':
        return 'badge-info';
      default:
        return 'badge';
    }
  };

  return <span className={`badge ${getStatusClass()} ${uppercase ? 'uppercase' : ''}`}>{children}</span>;
}
