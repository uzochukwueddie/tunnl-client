import type { ReactElement } from 'react';

export function StatsSkeleton(): ReactElement {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="stat-card animate-pulse">
          <div className="h-4 bg-slate-800 rounded w-1/2 mb-4" />
          <div className="h-8 bg-slate-800 rounded w-3/4" />
        </div>
      ))}
    </div>
  );
}

export function TunnelSkeleton(): ReactElement {
  return (
    <div className="p-6 space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center space-x-4 animate-pulse">
          <div className="w-2 h-2 bg-slate-800 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-800 rounded w-1/3" />
            <div className="h-3 bg-slate-800 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
