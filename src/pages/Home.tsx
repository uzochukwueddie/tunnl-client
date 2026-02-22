import { ChartNoAxesColumnIncreasing, LockKeyhole, Zap } from 'lucide-react';
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';

export function Home(): ReactElement {
  return (
    <div className="min-h-screen grid-pattern">
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-linear-to-br from-tunnel-500 to-purple-600 rounded-3xl mb-8 shadow-2xl shadow-tunnel-500/30 animate-glow">
              <Zap className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-6xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
              Secure Tunneling
              <br />
              <span className="bg-linear-to-r from-tunnel-400 to-purple-500 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto font-body">
              Expose your local development server to the internet instantly. Share your work, test webhooks, and
              collaborate seamlessly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/auth/register"
                className="btn btn-primary text-lg px-8 py-4 relative overflow-hidden group cursor-pointer"
              >
                <span className="relative z-10">Get Started Free</span>
                <div className="absolute inset-0 bg-linear-to-r from-tunnel-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </Link>
              <Link to="/auth/login" className="btn btn-secondary text-lg px-8 py-4">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-white mb-4">Why Choose Tunnl?</h2>
          <p className="text-xl text-slate-400">Everything you need for secure and reliable tunneling</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="stat-card group hover:scale-105 transition-transform">
            <div className="w-16 h-16 bg-tunnel-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-tunnel-500/30 transition-colors">
              <Zap className="w-8 h-8 text-tunnel-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">Lightning Fast</h3>
            <p className="text-slate-400">
              Instant tunnel creation with minimal latency. Get your local app online in seconds.
            </p>
          </div>

          <div className="stat-card group hover:scale-105 transition-transform">
            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition-colors">
              <LockKeyhole className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">Secure by Default</h3>
            <p className="text-slate-400">
              End-to-end encryption and secure token-based authentication keep your data safe.
            </p>
          </div>

          <div className="stat-card group hover:scale-105 transition-transform">
            <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500/30 transition-colors">
              <ChartNoAxesColumnIncreasing className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">Real-time Analytics</h3>
            <p className="text-slate-400">
              Monitor requests, track performance, and debug with detailed logs in real-time.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-white mb-4">Get Started in 3 Steps</h2>
          <p className="text-xl text-slate-400">Start tunneling in less than a minute</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-tunnel-500/20 rounded-full mb-6 border-2 border-tunnel-500">
              <span className="text-2xl font-bold text-tunnel-400">1</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Create Account</h3>
            <p className="text-slate-400">Sign up for free and get your API token instantly</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-tunnel-500/20 rounded-full mb-6 border-2 border-tunnel-500">
              <span className="text-2xl font-bold text-tunnel-400">2</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Install CLI</h3>
            <p className="text-slate-400">Download and install the Tunnl CLI agent on your machine</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-tunnel-500/20 rounded-full mb-6 border-2 border-tunnel-500">
              <span className="text-2xl font-bold text-tunnel-400">3</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Start Tunneling</h3>
            <p className="text-slate-400">Run the command and share your local app with the world</p>
          </div>
        </div>

        <div className="mt-16 card max-w-2xl mx-auto">
          <div className="card-body">
            <div className="bg-slate-900/50 rounded-lg p-6 font-display">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <code className="text-tunnel-400">
                <span className="text-slate-500">$</span> npm install -g tunnl
                <br />
                <span className="text-slate-500">$</span> tunnl http 4000 -t token
                <br />
                <br />
                <span className="text-green-400">✓ Tunnel created successfully!</span>
                <br />
                <span className="text-slate-400">Public URL: https://abc123.tunnl.dev</span>
              </code>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="card tunnel-glow">
          <div className="card-body text-center py-16">
            <h2 className="text-4xl font-display font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join developers worldwide who trust Tunnl for secure and reliable tunneling
            </p>
            <Link
              to="/auth/register"
              className="btn btn-primary text-lg px-8 py-4 relative overflow-hidden group cursor-pointer inline-block"
            >
              <span className="relative z-10">Create Free Account</span>
              <div className="absolute inset-0 bg-linear-to-r from-tunnel-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-800 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-slate-400">
            <p>&copy; {new Date().getFullYear()} Tunnl. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
