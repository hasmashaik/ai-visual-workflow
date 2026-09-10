'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Package, Image, Clock, CheckCircle, Sparkles, Plus
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [projectsRes, imagesRes] = await Promise.all([
        api.get('/projects'),
        api.get('/images')
      ]);
      
      const projects = projectsRes.data?.data || [];
      const images = imagesRes.data?.data || [];
      
      setStats({
        totalProjects: projects.length,
        totalAssets: images.length,
        pendingReviews: images.filter((i: any) => i.reviews?.some((r: any) => r.status === 'PENDING')).length || 0,
        approvedAssets: images.filter((i: any) => i.reviews?.some((r: any) => r.status === 'APPROVED')).length || 0,
      });
    } catch (error: any) {
      toast.error('Failed to load dashboard');
      setStats({
        totalProjects: 0,
        totalAssets: 0,
        pendingReviews: 0,
        approvedAssets: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Projects', value: stats?.totalProjects || 0, icon: Package },
    { label: 'Total Assets', value: stats?.totalAssets || 0, icon: Image },
    { label: 'Pending Reviews', value: stats?.pendingReviews || 0, icon: Clock },
    { label: 'Approved Assets', value: stats?.approvedAssets || 0, icon: CheckCircle },
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#7C3AED]" />
              Dashboard
            </h1>
            <p className="text-[#94A3B8] text-sm">Welcome back! Here's what's happening with your projects.</p>
          </div>
          <button
            onClick={() => router.push('/generate')}
            className="btn-primary flex items-center gap-2 text-sm py-2 px-4 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            New Generation
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((stat, index) => (
            <div key={index} className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#94A3B8]">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 flex items-center justify-center flex-shrink-0">
                  <stat.icon className="w-5 h-5 text-[#7C3AED]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="card p-4">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#7C3AED]" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'New Project', icon: Package, onClick: () => router.push('/projects') },
              { label: 'Upload Asset', icon: Image, onClick: () => router.push('/assets') },
              { label: 'Generate AI', icon: Sparkles, onClick: () => router.push('/generate') },
              { label: 'Reviews', icon: Clock, onClick: () => router.push('/reviews') },
            ].map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="group p-3 rounded-xl bg-[#0D111C] border border-[#1E293B] hover:border-[#7C3AED]/30 transition-all hover:shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 flex items-center justify-center mx-auto mb-1 group-hover:scale-110 transition-transform">
                  <action.icon className="w-5 h-5 text-[#7C3AED]" />
                </div>
                <p className="text-xs font-medium text-white text-center">{action.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}