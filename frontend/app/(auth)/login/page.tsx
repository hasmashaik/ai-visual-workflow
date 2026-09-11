'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Mail, Lock, Sparkles, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', data);
      const token = res.data.data.token;

      // 1. Store token in localStorage (for API client)
      localStorage.setItem('token', token);

      // 2. Store token in cookie (for middleware route protection)
      document.cookie = `token=${token}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax`;

      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A12] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#7C3AED]/10 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#06B6D4]/10 blur-[120px]"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-0 items-center min-h-[600px]">

          {/* LEFT SIDE - Branding */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 p-8 pr-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#6D2DE0] flex items-center justify-center shadow-lg shadow-[#7C3AED]/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight">VisualForge AI</span>
                <p className="text-xs text-[#64748B]">Create. Review. Approve. Deliver.</p>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl font-bold leading-tight text-white">
                Turn products into{' '}
                <span className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">
                  powerful visuals
                </span>
              </h1>
              <p className="text-[#94A3B8] text-lg leading-relaxed max-w-md">
                Create, review, approve, and deliver stunning product visuals with an AI-powered workflow.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#111827] bg-gradient-to-br from-[#7C3AED]/20 to-[#06B6D4]/20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] opacity-60"></div>
                  </div>
                ))}
              </div>
              <div className="h-8 w-px bg-[#1E293B]"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#06B6D4] animate-pulse"></div>
                <span className="text-[#94A3B8] text-sm">AI Ready</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Login Card */}
          <div className="flex items-center justify-center p-4 lg:p-8">
            <div className="w-full max-w-[420px]">
              <div className="bg-[#111827] rounded-2xl p-8 border border-[#1E293B] shadow-2xl shadow-black/40">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white tracking-tight">Welcome back</h2>
                  <p className="text-[#94A3B8] text-sm mt-1.5">Sign in to continue creating</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <input
                        {...register('email')}
                        type="email"
                        className="w-full bg-[#0B1220] border border-[#1E293B] rounded-xl py-3 pl-11 pr-4 text-white placeholder-[#64748B] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all duration-200"
                        placeholder="you@example.com"
                      />
                    </div>
                    {errors.email && <p className="text-sm text-[#EF4444] mt-1.5">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        className="w-full bg-[#0B1220] border border-[#1E293B] rounded-xl py-3 pl-11 pr-12 text-white placeholder-[#64748B] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all duration-200"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8] transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-[#EF4444] mt-1.5">{errors.password.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#7C3AED] to-[#6D2DE0] text-white font-semibold py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#7C3AED]/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-[#94A3B8] text-sm">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-[#7C3AED] hover:text-[#6D2DE0] transition-colors font-medium hover:underline">
                      Create one
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}