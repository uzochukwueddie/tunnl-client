import { lazy, useCallback, useEffect, useState, useTransition, type ReactElement } from 'react';
import { StatsSkeleton, TunnelSkeleton } from '../../components/pages/dashboard/overview/StatsSkeleton';
import { HardDrive } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/shared/EmptyState';
import { tunnelService } from '../../services/tunnel.service';
import { overviewQuickActions, overviewStats } from '../../components/pages/dashboard/overview/OverviewStats';

const StatCard = lazy(() =>
  import('../../components/pages/dashboard/overview/StatCard').then((m) => ({ default: m.StatCard }))
);
const ActiveTunnel = lazy(() =>
  import('../../components/pages/dashboard/overview/ActiveTunnelItem').then((m) => ({ default: m.ActiveTunnel }))
);
const QuickActionCard = lazy(() =>
  import('../../components/pages/dashboard/overview/QuickActionCard').then((m) => ({ default: m.QuickActionCard }))
);

async function loadDashboardData() {
  const [statsRes, tunnelsRes] = await Promise.all([tunnelService.getStatistics(), tunnelService.getActiveTunnels()]);
  return {
    stats: statsRes.result,
    activeTunnels: tunnelsRes.result
  };
}

type DashboardData = Awaited<ReturnType<typeof loadDashboardData>>;

export function Overview(): ReactElement {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isPending, startTransition] = useTransition();

  const refresh = useCallback(() => {
    startTransition(async () => {
      try {
        const result = await loadDashboardData();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load data'));
      }
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isInitialLoad = isPending && !data;
  const activeTunnels = data?.activeTunnels ?? [];
  const stats = data?.stats ?? null;

  const statCards = stats ? overviewStats(stats) : [];
  const quickActions = overviewQuickActions(activeTunnels[0]?.id);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-bold text-white">Overview</h2>
          <p className="text-slate-400 mt-1">Monitor your tunnels and statistics</p>
        </div>
        <button
          onClick={refresh}
          disabled={isPending}
          className="text-sm text-tunnel-400 cursor-pointer hover:text-tunnel-300 transition-colors disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-400 text-sm">
          {error.message}
        </div>
      )}

      {isInitialLoad ? (
        <StatsSkeleton />
      ) : stats ? (
        <div className={`transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card) => (
              <StatCard
                key={card.title}
                title={card.title}
                value={card.value}
                icon={card.icon}
                iconColor={card.iconColor}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-semibold text-white">Active Tunnels</h3>
            <Link to="/dashboard/tunnels" className="text-sm text-tunnel-400 hover:text-tunnel-300 transition-colors">
              View all →
            </Link>
          </div>
        </div>
        <div className="card-body p-0">
          {isInitialLoad ? (
            <TunnelSkeleton />
          ) : !activeTunnels.length ? (
            <EmptyState
              icon={<HardDrive className="w-10 h-10 text-slate-600" />}
              title="No active tunnels"
              description="Start a tunnel to see it here"
            />
          ) : (
            <div className={`divide-y divide-slate-800 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
              {activeTunnels.map((tunnel) => (
                <ActiveTunnel key={tunnel.id} tunnel={tunnel} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <QuickActionCard
            key={action.title}
            to={action.to}
            icon={action.icon}
            title={action.title}
            description={action.description}
            iconBgColor={action.iconBgColor}
            iconHoverColor={action.iconHoverColor}
          />
        ))}
      </div>
    </div>
  );
}
