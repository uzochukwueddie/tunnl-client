import type { ReactElement } from 'react';
import type { AuthButtonProps } from '../../../types';
import { LoaderCircle } from 'lucide-react';

export function AuthButton({ loading, disabled, loadingText, text }: AuthButtonProps): ReactElement {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="btn btn-primary w-full relative overflow-hidden group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="relative z-10">
        {loading ? (
          <span className="flex items-center justify-center">
            <LoaderCircle className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            {loadingText}
          </span>
        ) : (
          text
        )}
      </span>
      <div className="absolute inset-0 bg-linear-to-r from-tunnel-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
    </button>
  );
}
