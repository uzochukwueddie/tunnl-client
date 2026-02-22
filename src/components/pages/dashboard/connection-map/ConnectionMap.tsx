import { memo, useMemo, type ReactElement } from 'react';
import type { TunnelStatusData } from '../../../../types';
import { Background, Controls, MarkerType, ReactFlow, ReactFlowProvider, type Edge, type Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './dashLine.css';

export const ConnectionMap = memo(
  function ConnectionMap({ activeTunnelStatus }: { activeTunnelStatus: TunnelStatusData | null }): ReactElement {
    const publicUrl = activeTunnelStatus?.publicUrl;
    const isShuttingDown = activeTunnelStatus?.shuttingDown;
    const isActive = activeTunnelStatus?.status == 'active' && !isShuttingDown;
    const isLocalServiceConnected = activeTunnelStatus?.localServiceConnected ?? true;

    const nodes = useMemo<Node[]>(() => {
      const tunnelData = activeTunnelStatus;

      return [
        {
          id: 'internet',
          type: 'default',
          position: { x: 50, y: 150 },
          data: {
            label: (
              <div className="flex flex-col items-center">
                <div className="text-3xl mb-2">🌐</div>
                <div className="font-semibold text-sm">Internet</div>
              </div>
            )
          },
          style: {
            background: '#1e293b',
            color: '#e2e8f0',
            border: '2px solid #475569',
            borderRadius: '12px',
            padding: '16px',
            width: 120
          }
        },
        {
          id: 'server',
          type: 'default',
          position: { x: 300, y: 150 },
          data: {
            label: (
              <div className="flex flex-col items-center">
                <div className="text-3xl mb-2">🖥️</div>
                <div className="font-semibold text-sm">Server</div>
                <div className="text-xs text-slate-400 mt-1">Relay</div>
              </div>
            )
          },
          style: {
            background: '#1e293b',
            color: '#e2e8f0',
            border: '2px solid #3b82f6',
            borderRadius: '12px',
            padding: '16px',
            width: 140,
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
          }
        },
        {
          id: 'agent',
          type: 'default',
          position: { x: 550, y: 150 },
          data: {
            label: (
              <div className="flex flex-col items-center">
                <div className="text-3xl mb-2">💻</div>
                <div className="font-semibold text-sm">Agent</div>
                <div className="text-xs text-slate-400 mt-1">{tunnelData?.subdomain || 'N/A'}</div>
              </div>
            )
          },
          style: {
            background: '#1e293b',
            color: '#e2e8f0',
            border: `2px solid ${isActive ? '#10b981' : '#64748b'}`,
            borderRadius: '12px',
            padding: '16px',
            width: 140,
            boxShadow: isActive ? '0 0 20px rgba(16, 185, 129, 0.3)' : '',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
          }
        },
        {
          id: 'local-service',
          type: 'default',
          position: { x: 800, y: 150 },
          data: {
            label: (
              <div className="flex flex-col items-center">
                <div className="text-3xl mb-2">🚀</div>
                <div className="font-semibold text-sm">Local Service</div>
                <div className="text-xs text-slate-400 mt-1">:{tunnelData?.localPort || '----'}</div>
              </div>
            )
          },
          style: {
            background: '#1e293b',
            color: '#e2e8f0',
            border: `2px solid ${isActive && isLocalServiceConnected ? '#8b5cf6' : isActive && !isLocalServiceConnected ? '#6b7280' : '#64748b'}`,
            borderRadius: '12px',
            padding: '16px',
            width: 140,
            opacity: isActive && !isLocalServiceConnected ? 0.4 : isActive ? 1 : 0.5,
            transition: 'opacity 0.3s ease, border-color 0.3s ease'
          }
        }
      ];
    }, [activeTunnelStatus, isActive, isLocalServiceConnected]);

    const edges = useMemo<Edge[]>(() => {
      return [
        {
          id: 'internet-server',
          source: 'internet',
          target: 'server',
          type: 'smoothstep',
          className: isActive ? 'internet-server-flow-active' : 'internet-server-flow-inactive',
          style: {
            stroke: '#64748b',
            strokeWidth: 2
          },
          label: 'HTTP/HTTPS',
          labelStyle: {
            fill: '#94a3b8',
            fontSize: 10
          }
        },
        {
          id: 'server-agent',
          source: 'server',
          target: 'agent',
          type: 'smoothstep',
          className: isActive ? 'active-flow' : 'inactive-flow',
          style: {
            stroke: isActive ? '#10b981' : '#64748b',
            strokeWidth: 3
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: isActive ? '#10b981' : '#64748b'
          },
          label: isActive ? 'ACTIVE TUNNEL' : 'INACTIVE',
          labelStyle: {
            fill: isActive ? '#10b981' : '#64748b',
            fontSize: 10,
            fontWeight: 600
          }
        },
        {
          id: 'agent-local',
          source: 'agent',
          target: 'local-service',
          type: 'smoothstep',
          className: isActive && isLocalServiceConnected ? 'active-flow' : 'inactive-flow',
          style: {
            stroke:
              isActive && isLocalServiceConnected
                ? '#8b5cf6'
                : isActive && !isLocalServiceConnected
                  ? '#6b7280'
                  : '#64748b',
            strokeWidth: 2,
            opacity: isActive && !isLocalServiceConnected ? 0.4 : isActive ? 1 : 0.5
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color:
              isActive && isLocalServiceConnected
                ? '#8b5cf6'
                : isActive && !isLocalServiceConnected
                  ? '#6b7280'
                  : '#64748b'
          },
          label: isActive && isLocalServiceConnected ? 'PROXY' : 'DISCONNECTED',
          labelStyle: {
            fill: isActive && isLocalServiceConnected ? '#8b5cf6' : isActive ? '#ef4444' : '#64748b',
            fontSize: 10,
            fontWeight: 600
          }
        }
      ];
    }, [isActive, isLocalServiceConnected]);

    return (
      <div className="flex flex-col h-full w-full gap-4">
        {publicUrl && (
          <div className="bg-slate-900 rounded-lg border border-slate-800 p-4">
            <div className="flex items-center gap-3">
              <div className="text-sm font-semibold text-slate-300">PUBLIC URL:</div>
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded border border-slate-700"
              >
                <span className="text-blue-400 font-mono text-sm">{publicUrl}</span>
              </a>
            </div>
          </div>
        )}

        <div className="flex-1 bg-slate-950 rounded-lg border-slate-800">
          <ReactFlowProvider key={crypto.randomUUID()}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
              attributionPosition="bottom-left"
              proOptions={{ hideAttribution: true }}
              preventScrolling={true}
              zoomOnScroll={false}
              panOnScroll={false}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
            >
              <Background color="#334155" gap={16} />
              <Controls
                showZoom={true}
                showFitView={true}
                showInteractive={false}
                position="bottom-right"
                className="text-black"
              />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    const prev = prevProps.activeTunnelStatus;
    const next = nextProps.activeTunnelStatus;

    // If both are null, no re-render needed
    if (prev === null && next === null) return true;

    // If one is null and the other isn't, re-render needed
    if (prev === null || next === null) return false;

    return (
      prev.status === next.status &&
      prev.localServiceConnected === next.localServiceConnected &&
      prev.shuttingDown === next.shuttingDown &&
      prev.subdomain === next.subdomain &&
      prev.localPort === next.localPort &&
      prev.publicUrl === next.publicUrl
    );
  }
);
