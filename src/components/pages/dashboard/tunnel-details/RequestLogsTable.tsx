import { HardDrive } from 'lucide-react';
import type { RequestLog } from '../../../../types';
import { formatLocalizedDate } from '../../../../utils/date';
import { EmptyState } from '../../../shared/EmptyState';

export function RequestLogsTable({ requestLogs, loading }: { requestLogs: RequestLog[]; loading: boolean }) {
  const getMethodClass = (method: string): string => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'badge-info';
      case 'POST':
        return 'badge-success';
      case 'PUT':
      case 'PATCH':
        return 'badge-warning';
      case 'DELETE':
        return 'badge-error';
      default:
        return 'badge';
    }
  };

  const getStatusClass = (statusCode: number): string => {
    if (statusCode >= 200 && statusCode < 300) return 'badge-success';
    if (statusCode >= 300 && statusCode < 400) return 'badge-info';
    if (statusCode >= 400 && statusCode < 500) return 'badge-warning';
    if (statusCode >= 500) return 'badge-error';
    return 'badge';
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-xl font-display font-semibold text-white">Request Logs</h3>
        <p className="text-sm text-slate-400 mt-1">Showing the last 20 logs</p>
      </div>
      <div className="card-body p-0">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="w-16 h-4 bg-slate-800 rounded"></div>
                <div className="flex-1 h-4 bg-slate-800 rounded"></div>
              </div>
            ))}
          </div>
        ) : !loading && requestLogs.length === 0 ? (
          <EmptyState
            icon={<HardDrive className="w-16 h-16 mx-auto text-slate-700 mb-4" />}
            title="No request logs available"
            description=""
          />
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Client IP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Path
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Response Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {requestLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        {formatLocalizedDate(log.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{log.ipAddress || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${getMethodClass(log.method)}`}>{log.method}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white font-mono truncate max-w-xs" title={log.path}>
                          {log.path}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${getStatusClass(log.statusCode)}`}>{log.statusCode}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{log.responseTime}ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-slate-800">
              {requestLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex gap-2">
                      <span className={`badge ${getMethodClass(log.method)}`}>{log.method}</span>
                      <span className={`badge ${getStatusClass(log.statusCode)}`}>{log.statusCode}</span>
                    </div>
                    <span className="text-xs text-slate-400">{formatLocalizedDate(log.timestamp)}</span>
                  </div>
                  <div className="text-sm text-white font-mono mb-2 break-all">{log.path}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">{log.responseTime}ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
