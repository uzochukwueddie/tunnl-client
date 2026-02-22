import { Clock, Trash2, Undo, Zap } from 'lucide-react';
import type { TokenListItemProps } from '../../../../types';
import { formatDate } from '../../../../utils/formatters';
import { StatusBadge } from '../../../shared/StatusBadge';

export function TokenListItem({ token, onRevoke, onDelete }: TokenListItemProps) {
  return (
    <div className="p-6 hover:bg-slate-800/30 transition-all group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h4 className="font-display text-lg font-semibold text-white">{token.name}</h4>
            <StatusBadge status={token.is_active ? 'active' : 'inactive'} uppercase>
              {token.is_active ? 'Active' : 'Inactive'}
            </StatusBadge>
          </div>

          <div className="flex items-center space-x-6 text-sm text-slate-400">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Created {formatDate(token.created_at)}</span>
            </div>
            {token.last_used && (
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Last used {formatDate(token.last_used)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onRevoke(token)}
            className="flex gap-2 btn btn-secondary cursor-pointer text-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Undo size={16} />
            Revoke
          </button>
          <button
            onClick={() => onDelete(token)}
            className="flex gap-2 cursor-pointer btn btn-danger text-sm opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete token"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
