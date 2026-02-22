import { ChartNoAxesColumnIncreasing, HardDrive, KeyRound, LaptopMinimalCheck, SquareKanban } from 'lucide-react';
import type { Statistics } from '../../../../types';
import { formatNumber } from '../../../../utils/formatters';
import type { JSX } from 'react';

interface OverviewStats {
  title: string;
  value: number | string;
  icon: JSX.Element;
  iconColor?: string;
}

interface QuickAction {
  to: string;
  icon: JSX.Element;
  title: string;
  description: string;
  iconBgColor?: string;
  iconHoverColor?: string;
}

export function overviewStats(stats: Statistics): OverviewStats[] {
  return [
    {
      title: 'Total Tunnels',
      value: stats.total_tunnels,
      icon: <HardDrive className="w-5 h-5" />
    },
    {
      title: 'Active Now',
      value: stats.active_tunnels,
      icon: <div className="status-indicator status-active" />,
      iconColor: 'text-green-400'
    },
    {
      title: 'Inactive',
      value: stats.closed,
      icon: <div className="status-indicator bg-red-600" />,
      iconColor: 'text-red-400'
    },
    {
      title: 'Total Requests',
      value: formatNumber(stats.total_requests),
      icon: <LaptopMinimalCheck className="w-5 h-5" />,
      iconColor: 'text-purple-500'
    }
  ];
}

export function overviewQuickActions(activeTunnelId: string): QuickAction[] {
  return [
    {
      to: '/dashboard/tokens',
      icon: <KeyRound className="w-6 h-6 text-tunnel-400" />,
      title: 'Manage Tokens',
      description: 'Create & revoke API tokens'
    },
    {
      to: '/dashboard/tunnels',
      icon: <ChartNoAxesColumnIncreasing className="w-6 h-6 text-green-400" />,
      title: 'Tunnel History',
      description: 'View all tunnels',
      iconBgColor: 'bg-green-500/20',
      iconHoverColor: 'group-hover:bg-green-500/30'
    },
    {
      to: activeTunnelId ? `/dashboard/connection-map/${activeTunnelId}` : '/dashboard/connection-map',
      icon: <SquareKanban className="w-6 h-6 text-pink-400" />,
      title: 'Tunnel Connection Map',
      description: 'View all tunnel connections map',
      iconBgColor: 'bg-pink-500/20',
      iconHoverColor: 'group-hover:bg-pink-500/30'
    }
  ];
}
