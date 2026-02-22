import { LoaderCircle } from 'lucide-react';
import type { ReactElement } from 'react';
import type { TokenFormProps } from '../../../../types';

export function TokenForm({ formAction, isPending, error }: TokenFormProps): ReactElement {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-xl font-display font-semibold text-white">Create New Token</h3>
      </div>
      <div className="card-body">
        <form action={formAction} className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              name="name"
              placeholder="Token name (e.g., Production Server)"
              className="input"
              disabled={isPending}
              required
            />
          </div>
          <button type="submit" disabled={isPending} className="btn btn-primary">
            {isPending ? <LoaderCircle className="animate-spin h-5 w-5" /> : 'Create Token'}
          </button>
        </form>
        {error && <div className="mt-4 text-sm text-red-400">{error}</div>}
      </div>
    </div>
  );
}
