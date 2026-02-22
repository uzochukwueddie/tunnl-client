import { Check, CircleCheck } from 'lucide-react';
import type { TokenSuccessAlertProps } from '../../../../types';

export function TokenSuccessAlert({ token, copied, onCopy }: TokenSuccessAlertProps) {
  if (!token) return null;

  return (
    <div className="mt-6 p-4 bg-green-900/20 border border-green-800 rounded-lg animate-slide-in">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <CircleCheck className="w-5 h-5 text-green-400" />
          <p className="font-semibold text-green-400">Token Created!</p>
        </div>
      </div>
      <p className="text-sm text-green-300 mb-3">Save this token now. You won't be able to see it again!</p>
      <div className="flex items-center space-x-2">
        <code className="flex-1 bg-slate-950 px-4 py-3 rounded font-display text-sm text-green-400 break-all">
          {token}
        </code>
        <button onClick={onCopy} className={`btn btn-secondary shrink-0 ${copied ? 'bg-green-600' : ''}`}>
          {copied ? <Check className="w-5 h-5" /> : 'Copy'}
        </button>
      </div>
    </div>
  );
}
