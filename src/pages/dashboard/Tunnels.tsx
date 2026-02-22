import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useOptimistic,
  useState,
  useTransition,
  type ReactElement
} from 'react';
import type { ActiveandHistoryTunnel, TabType, Tunnel } from '../../types';
import { HardDrive } from 'lucide-react';
import { tunnelService } from '../../services/tunnel.service';
import { TunnelSkeleton } from '../../components/pages/dashboard/overview/StatsSkeleton';

const TunnelTabs = lazy(() =>
  import('../../components/pages/dashboard/tunnels/TunnelTabs').then((m) => ({ default: m.TunnelTabs }))
);
const TunnelList = lazy(() =>
  import('../../components/pages/dashboard/tunnels/TunnelList').then((m) => ({ default: m.TunnelList }))
);
const ConfirmationModal = lazy(() =>
  import('../../components/shared/ConfirmationModal').then((m) => ({ default: m.ConfirmationModal }))
);

async function loadTunnelData() {
  const [activeTunnelRes, historyTunnelRes] = await Promise.all([
    tunnelService.getActiveTunnels(),
    tunnelService.getAllUserTunnels()
  ]);
  return {
    activeTunnelsResponse: activeTunnelRes.result,
    historyTunnelsResponse: historyTunnelRes.result
  };
}

export function Tunnels(): ReactElement {
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [tunnels, setTunnels] = useState<ActiveandHistoryTunnel>({
    activeTunnels: [],
    historyTunnels: []
  });
  const [tunnelToDelete, setTunnelToDelete] = useState<Tunnel | null>(null);

  const [isPendingTransition, startTunnelTransition] = useTransition();
  const [isPendingDelete, startDeleteTransition] = useTransition();

  const [optimisticHistory, setOptimisticHistory] = useOptimistic(
    tunnels.historyTunnels,
    (current, deletedId: string) => current.filter((t) => t.id !== deletedId)
  );

  const loadTunnels = useCallback(() => {
    startTunnelTransition(async () => {
      try {
        const response = await loadTunnelData();
        setTunnels({
          activeTunnels: response.activeTunnelsResponse,
          historyTunnels: response.historyTunnelsResponse
        });
      } catch (error) {
        console.log('Failed to load tunnels:', error);
      }
    });
  }, []);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  const confirmDelete = useCallback((tunnel: Tunnel, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setTunnelToDelete(tunnel);
  }, []);

  const cancelDelete = useCallback(() => {
    setTunnelToDelete(null);
  }, []);

  const deleteTunnel = () => {
    if (!tunnelToDelete) return;

    startDeleteTransition(async () => {
      setOptimisticHistory(tunnelToDelete.id);

      try {
        await tunnelService.deleteTunnel(tunnelToDelete.id);
        setTunnelToDelete(null);
        loadTunnels();
      } catch (error) {
        console.log(error);
        alert('Failed to delete tunnel. Please try again.');
      }
    });
  };

  useEffect(() => {
    loadTunnels();
  }, [loadTunnels]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-display font-bold text-white">Tunnels</h2>
        <p className="text-slate-400 mt-1">Manage and monitor your tunnel connections</p>
      </div>

      <Suspense fallback={null}>
        <TunnelTabs
          activeTab={activeTab}
          activeTunnelsCount={tunnels.activeTunnels.length}
          onTabChange={handleTabChange}
        />
      </Suspense>

      {activeTab === 'active' && (
        <div className="card">
          <Suspense fallback={<TunnelSkeleton />}>
            <TunnelList
              tunnels={tunnels.activeTunnels}
              loading={isPendingTransition}
              isActive={true}
              emptyIcon={<HardDrive className="w-10 h-10 text-slate-600" />}
              emptyTitle="No Active Tunnels"
              emptyDescription="Start a tunnel to it appear here"
            />
          </Suspense>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="card">
          <Suspense fallback={<TunnelSkeleton />}>
            <TunnelList
              tunnels={optimisticHistory}
              loading={isPendingTransition}
              isActive={false}
              emptyIcon={<HardDrive className="w-10 h-10 text-slate-600" />}
              emptyTitle="No Tunnel History"
              emptyDescription="Your tunnel history will appear here"
              onDelete={confirmDelete}
              deletingInProgress={isPendingDelete}
            />
          </Suspense>
        </div>
      )}

      <Suspense fallback={null}>
        <ConfirmationModal
          isOpen={!!tunnelToDelete}
          title="Delete Token?"
          message={`Are you sure you want to delete the tunnel "${tunnelToDelete?.subdomain}"?`}
          description="This action cannot be undone. The tunnel will be permanently removed from your account."
          confirmText={isPendingDelete ? 'Deleting...' : 'Delete Tunnel'}
          cancelText="Cancel"
          onConfirm={deleteTunnel}
          onCancel={cancelDelete}
          isLoading={isPendingDelete}
          variant="danger"
        />
      </Suspense>
    </div>
  );
}
