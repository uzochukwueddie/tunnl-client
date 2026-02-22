import type { ErrorAlertProps } from '../../../types';

export function ErrorAlert({ message }: ErrorAlertProps) {
  if (!message) return null;

  return (
    <div className="mb-4 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm animate-slide-in">
      {message}
    </div>
  );
}
