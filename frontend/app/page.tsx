'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Server, 
  Database, 
  Cpu, 
  Globe, 
  Code,
  Terminal,
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';
import { getHealthStatus, HealthResponse } from '@/lib/api';

export default function Home() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let active = true;
    
    async function checkHealth() {
      if (active) setStatus('loading');
      try {
        const data = await getHealthStatus();
        if (active) {
          setHealthData(data);
          setStatus('connected');
        }
      } catch (err) {
        if (active) {
          setHealthData(null);
          setStatus('error');
        }
      } finally {
        if (active) setIsRefreshing(false);
      }
    }

    checkHealth();
    
    return () => {
      active = false;
    };
  }, [retryCount]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRetryCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/20 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30">
              T
            </div>
            <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Typeform Builder
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              SDE Fullstack Assignment
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 flex flex-col gap-10 z-10">
        
        {/* Hero Section */}
        <section className="flex flex-col gap-4 text-center md:text-left md:max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent">
              Project Foundation
            </h1>
            <p className="mt-4 text-lg text-slate-400 leading-relaxed">
              Welcome to the foundation of your Typeform-inspired form builder. The Next.js frontend has been bootstrapped, styled with Tailwind CSS, and is ready to communicate with the FastAPI backend.
            </p>
          </motion.div>
        </section>

        {/* Status Dashboard Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Status Panel (Spans 2 columns) */}
          <motion.div 
            className="md:col-span-2 rounded-2xl border border-slate-900 bg-slate-900/30 backdrop-blur-xl p-6 flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-indigo-400" />
                  <h2 className="text-lg font-semibold">Live Integration Status</h2>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {/* API Connection Indicator */}
              <div className="mt-8 p-6 rounded-xl bg-slate-950 border border-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {status === 'loading' && (
                      <div className="h-6 w-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                    )}
                    {status === 'connected' && (
                      <CheckCircle2 className="h-6 w-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]" />
                    )}
                    {status === 'error' && (
                      <XCircle className="h-6 w-6 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                      Backend Connection
                      <span className="text-xs text-slate-500 font-normal">GET /api/health</span>
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {status === 'loading' && 'Verifying network availability...'}
                      {status === 'connected' && 'Successfully connected to Python FastAPI backend.'}
                      {status === 'error' && 'Failed to connect. Please verify backend is running on port 8000.'}
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <AnimatePresence mode="wait">
                    {status === 'loading' && (
                      <motion.span 
                        key="loading"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700"
                      >
                        Checking...
                      </motion.span>
                    )}
                    {status === 'connected' && (
                      <motion.span 
                        key="connected"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      >
                        Online
                      </motion.span>
                    )}
                    {status === 'error' && (
                      <motion.span 
                        key="error"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      >
                        Offline
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Health payload */}
            <div className="mt-6 pt-6 border-t border-slate-900/60">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">API Response Body</span>
              <pre className="mt-2 p-4 rounded-lg bg-slate-950 border border-slate-900 text-xs font-mono overflow-x-auto text-slate-300">
                {status === 'loading' && '// Fetching data...'}
                {status === 'connected' && JSON.stringify(healthData, null, 2)}
                {status === 'error' && `{
  "error": "AxiosError: Network Error",
  "message": "Verify FastAPI backend server is active at http://127.0.0.1:8000"
}`}
              </pre>
            </div>
          </motion.div>

          {/* Quick Stats / Tech Stack Card */}
          <motion.div 
            className="rounded-2xl border border-slate-900 bg-slate-900/30 backdrop-blur-xl p-6 flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div>
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-400" />
                <h2 className="text-lg font-semibold">Tech Stack Stack</h2>
              </div>
              <p className="mt-2 text-sm text-slate-400">
                Foundation environment has been configured with these core libraries:
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/40 border border-slate-900">
                  <span className="text-xs font-medium text-slate-300 flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-indigo-400" /> Next.js 16/15
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Frontend Framework</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/40 border border-slate-900">
                  <span className="text-xs font-medium text-slate-300 flex items-center gap-2">
                    <Server className="h-3.5 w-3.5 text-indigo-400" /> FastAPI
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Python API</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/40 border border-slate-900">
                  <span className="text-xs font-medium text-slate-300 flex items-center gap-2">
                    <Database className="h-3.5 w-3.5 text-indigo-400" /> SQLite + SQLAlchemy
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">ORM / Database</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/40 border border-slate-900">
                  <span className="text-xs font-medium text-slate-300 flex items-center gap-2">
                    <Code className="h-3.5 w-3.5 text-indigo-400" /> TypeScript
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Strict Types</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-900/60 text-xs text-slate-500">
              SQLite database location:<br />
              <code className="text-[10px] text-indigo-300 font-mono">backend/typeform.db</code>
            </div>
          </motion.div>
        </section>

        {/* Documentation / Project Guide Section */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-indigo-400" />
            <h2 className="text-xl font-bold">Local Development Setup Instructions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Backend Instructions */}
            <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-900 backdrop-blur-sm flex flex-col gap-4">
              <div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Step 1: Start Python Backend
                </span>
                <h3 className="mt-2 font-semibold text-slate-200">Start FastAPI Development Server</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Create a virtual environment, install requirements, and run the server using Uvicorn.
                </p>
              </div>

              <div className="flex flex-col gap-2 font-mono text-xs">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 relative">
                  <span className="absolute right-3 top-2 text-[10px] text-slate-600 uppercase font-semibold">Terminal 1</span>
                  <div className="text-slate-500"># Navigate to backend and setup venv</div>
                  <div className="text-indigo-400">cd backend</div>
                  <div className="text-indigo-400">python -m venv venv</div>
                  <div className="text-indigo-400">.\venv\Scripts\activate</div>
                  <div className="text-slate-500 mt-2"># Install dependencies and start</div>
                  <div className="text-indigo-400">pip install -r requirements.txt</div>
                  <div className="text-indigo-400">python -m uvicorn app.main:app --reload --port 8000</div>
                </div>
              </div>
            </div>

            {/* Frontend Instructions */}
            <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-900 backdrop-blur-sm flex flex-col gap-4">
              <div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Step 2: Start Next.js Frontend
                </span>
                <h3 className="mt-2 font-semibold text-slate-200">Start Frontend Development Server</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Run the Next.js development server to compile pages and launch the builder client.
                </p>
              </div>

              <div className="flex flex-col gap-2 font-mono text-xs">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 relative">
                  <span className="absolute right-3 top-2 text-[10px] text-slate-600 uppercase font-semibold">Terminal 2</span>
                  <div className="text-slate-500"># Navigate to frontend</div>
                  <div className="text-indigo-400">cd frontend</div>
                  <div className="text-slate-500 mt-2"># Run the development environment</div>
                  <div className="text-indigo-400">npm run dev</div>
                  <div className="text-slate-500 mt-2"># App will list on:</div>
                  <div className="text-emerald-400">http://localhost:3000</div>
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 py-8 text-center text-xs text-slate-500 bg-slate-950">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>Typeform Builder Foundation Setup &bull; Escalator Team</span>
          <div className="flex gap-4">
            <span className="hover:text-slate-300 transition cursor-help">SQLite Connected</span>
            <span>&bull;</span>
            <span className="hover:text-slate-300 transition cursor-help">FastAPI 0.110.0+</span>
            <span>&bull;</span>
            <span className="hover:text-slate-300 transition cursor-help">React 19</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
