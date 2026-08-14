'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginUser } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('auth_token')) {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      localStorage.setItem('auth_token', res.token);
      localStorage.setItem('user_name', res.user.name);
      localStorage.setItem('user_email', res.user.email);
      toast.success(`Welcome back, ${res.user.name}!`);
      router.push('/');
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Failed to login. Please check your credentials.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-slate-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center text-white font-extrabold text-xl shadow-md">
            T
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
          Sign in to Typeform Builder
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Or{' '}
          <Link href="/signup" className="font-semibold text-slate-900 hover:text-slate-800 underline underline-offset-4 decoration-2">
            create a new workspace account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent text-sm transition-all bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent text-sm transition-all bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs text-slate-500">
            <span className="font-semibold text-slate-700 block mb-1">Demo Access Credentials:</span>
            Email: <code className="bg-slate-200/60 px-1 rounded font-mono text-slate-800">john@example.com</code><br/>
            Password: <code className="bg-slate-200/60 px-1 rounded font-mono text-slate-800">password123</code>
          </div>
        </div>
      </div>
    </div>
  );
}
