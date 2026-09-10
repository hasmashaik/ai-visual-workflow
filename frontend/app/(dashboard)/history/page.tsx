'use client';

import { useEffect, useState } from 'react';
import {
  History as HistoryIcon,
  Activity, Clock, CheckCircle,
  Upload, Sparkles, Trash2, Edit
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function HistoryPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/activities');
      setActivities(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    const icons: any = {
      CREATE: Sparkles,
      UPDATE: Edit,
      DELETE: Trash2,
      UPLOAD: Upload,
      GENERATE: Sparkles,
      REVIEW: CheckCircle,
    };
    return icons[action] || Activity;
  };

  const getActionColor = (action: string) => {
    const colors: any = {
      CREATE: 'text-green-400 bg-green-500/20',
      UPDATE: 'text-blue-400 bg-blue-500/20',
      DELETE: 'text-red-400 bg-red-500/20',
      UPLOAD: 'text-cyan-400 bg-cyan-500/20',
      GENERATE: 'text-purple-400 bg-purple-500/20',
      REVIEW: 'text-yellow-400 bg-yellow-500/20',
    };
    return colors[action] || 'text-gray-400 bg-gray-500/20';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="pt-4 pb-4 border-b border-[#1E293B]">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 text-[#7C3AED]" />
            Activity History
          </h1>
          <p className="text-[#94A3B8] text-sm">Complete timeline of all your activities</p>
        </div>

        <div className="py-4">
          {activities.length === 0 ? (
            <div className="card text-center py-16">
              <div className="w-20 h-20 rounded-full bg-[#7C3AED]/20 flex items-center justify-center mx-auto mb-4">
                <HistoryIcon className="w-10 h-10 text-[#7C3AED]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No activities yet</h3>
              <p className="text-[#94A3B8] text-sm">Start creating projects to see activity</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-[#1E293B]"></div>

              <div className="space-y-3">
                {activities.map((activity, index) => {
                  const Icon = getActionIcon(activity.action);
                  const colors = getActionColor(activity.action).split(' ');
                  const textColor = colors[0];
                  const bgColor = colors[1];

                  return (
                    <div key={activity.id} className="relative pl-14">
                      <div className={`absolute left-3 top-3 w-6 h-6 rounded-full border-2 border-[#111827] flex items-center justify-center ${bgColor} z-10`}>
                        <Icon className={`w-3 h-3 ${textColor}`} />
                      </div>

                      <div className="card p-4 hover:border-[#7C3AED]/30 transition-all">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-white text-sm font-medium">{activity.description}</p>
                            {activity.project?.name && (
                              <p className="text-xs text-[#94A3B8] mt-1">
                                Project: <span className="text-[#7C3AED]">{activity.project.name}</span>
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-[#64748B] whitespace-nowrap">
                            <Clock className="w-3 h-3" />
                            {new Date(activity.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}