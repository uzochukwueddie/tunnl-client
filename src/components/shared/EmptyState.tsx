import type { ReactElement } from 'react';
import type { EmptyStateProps } from '../../types';

export function EmptyState({ icon, title, description }: EmptyStateProps): ReactElement {
  return (
    <div className="p-16 text-center">
      <div className="w-20 h-20 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-medium text-slate-300 mb-2">{title}</h3>
      {description && <p className="text-slate-500">{description}</p>}
    </div>
  );
}
