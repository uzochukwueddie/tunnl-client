import type { ReactElement } from 'react';
import type { TunnelListProps } from '../../../../types';
import { TunnelSkeleton } from '../overview/StatsSkeleton';
import { EmptyState } from '../../../shared/EmptyState';
import { TunnelListItem } from './TunnelListItem';

export function TunnelList({
  tunnels,
  loading,
  isActive,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  onDelete,
  deletingInProgress = false
}: TunnelListProps): ReactElement {
  if (loading && !tunnels.length) return <TunnelSkeleton />;

  if (!tunnels.length) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <>
      <div className="divide-y divide-slate-800">
        {tunnels.map((tunnel) => (
          <TunnelListItem
            key={tunnel.id}
            tunnel={tunnel}
            isActive={isActive}
            onDelete={onDelete}
            deletingInProgress={deletingInProgress}
          />
        ))}
      </div>
    </>
  );
}
