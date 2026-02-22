import { UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AuthFormProps } from '../../../types';

export function AuthForm({ title, subtitle, children }: AuthFormProps) {
  return (
    <div className="min-h-screen flex items-center justify-center grid-pattern py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-tunnel-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-tunnel-500/20"
          >
            <UserPlus className="w-10 h-10 text-white" />
          </Link>
          <h2 className="text-4xl font-display font-bold text-white mb-2">{title}</h2>
          <p className="text-slate-400 font-body">{subtitle}</p>
        </div>

        <div className="card tunnel-glow">
          <div className="card-body">{children}</div>
        </div>
      </div>
    </div>
  );
}
