import type { ReactElement } from 'react';
import type { TabType, TunnelTabsProps } from '../../../../types';

const tabs: { id: TabType; label: string }[] = [
  { id: 'active', label: 'Active Tunnels' },
  { id: 'history', label: 'History' }
];

export function TunnelTabs({ activeTab, activeTunnelsCount, onTabChange }: TunnelTabsProps): ReactElement {
  return (
    <div className="flex space-x-4 border-b border-slate-800">
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          role="tab"
          aria-selected={activeTab === id}
          className={`border-b-2 px-4 py-3 cursor-pointer font-medium text-sm transition-all hover:text-white ${
            activeTab === id ? 'border-tunnel-500 text-tunnel-400' : 'border-transparent text-slate-400'
          }`}
        >
          {label}
          {id === 'active' && activeTunnelsCount > 0 && (
            <span className="ml-2 badge badge-success">{activeTunnelsCount}</span>
          )}
        </button>
      ))}
    </div>
  );
}
