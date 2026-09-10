'use client';

import { useEffect, useState } from 'react';
import {
  MessageSquare, Clock, CheckCircle, XCircle, RefreshCw,
  ThumbsUp, ThumbsDown, Calendar, FolderOpen
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Review {
  id: string;
  status: string;
  comment: string | null;
  createdAt: string;
  image: {
    id: string;
    secureUrl: string;
    originalName: string;
    type: string;
  };
  project?: {
    id: string;
    name: string;
  };
}

interface Counts {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  revision: number;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [counts, setCounts] = useState<Counts>({
    total: 0, pending: 0, approved: 0, rejected: 0, revision: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/reviews?status=${filter}`);
      setReviews(res.data.data || []);
      setCounts(res.data.counts || counts);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, status: string, comment?: string) => {
    try {
      await api.put(`/reviews/${id}`, { status, comment });
      toast.success(`Review ${status.toLowerCase().replace('_', ' ')}`);
      fetchReviews();
    } catch (error) {
      toast.error('Failed to update review');
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: any = {
      PENDING: { color: 'text-yellow-500', bg: 'bg-yellow-500/20', icon: Clock, label: 'Pending' },
      APPROVED: { color: 'text-green-500', bg: 'bg-green-500/20', icon: CheckCircle, label: 'Approved' },
      REJECTED: { color: 'text-red-500', bg: 'bg-red-500/20', icon: XCircle, label: 'Rejected' },
      REVISION_REQUESTED: { color: 'text-blue-500', bg: 'bg-blue-500/20', icon: RefreshCw, label: 'Revision Requested' },
    };
    return configs[status] || configs.PENDING;
  };

  const filterTabs = [
    { key: 'all', label: 'All', count: counts.total },
    { key: 'pending', label: 'Pending', count: counts.pending },
    { key: 'approved', label: 'Approved', count: counts.approved },
    { key: 'rejected', label: 'Rejected', count: counts.rejected },
    { key: 'revision_requested', label: 'Revision', count: counts.revision },
  ];

  return (
    <div>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="pt-4 pb-4 border-b border-[#1E293B]">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#7C3AED]" />
            Reviews
          </h1>
          <p className="text-[#94A3B8] text-sm">Review and approve generated product visuals</p>
        </div>

        {/* Filter Tabs */}
        <div className="py-4">
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  filter === tab.key
                    ? 'bg-[#7C3AED] text-white'
                    : 'bg-[#111827] text-[#94A3B8] hover:bg-[#1E293B] border border-[#1E293B]'
                }`}
              >
                {tab.label}
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  filter === tab.key ? 'bg-white/20' : 'bg-[#0D111C]'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="card text-center py-16">
            <div className="w-20 h-20 rounded-full bg-[#7C3AED]/20 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-10 h-10 text-[#7C3AED]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {filter === 'all' ? 'No reviews yet' : `No ${filter.replace('_', ' ')} reviews`}
            </h3>
            <p className="text-[#94A3B8] text-sm mb-4">
              {filter === 'all'
                ? 'Generate images from the Generate page to start reviewing'
                : 'Try a different filter to see other reviews'}
            </p>
            {filter !== 'all' && (
              <button onClick={() => setFilter('all')} className="btn-primary text-sm py-2 px-4">
                View All Reviews
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => {
              const config = getStatusConfig(review.status);
              const StatusIcon = config.icon;

              return (
                <div key={review.id} className="card p-4 hover:border-[#7C3AED]/30 transition-all">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Image Preview */}
                    <div className="w-full md:w-40 h-40 rounded-xl overflow-hidden bg-[#0B1220] flex-shrink-0">
                      <img
                        src={review.image.secureUrl}
                        alt={review.image.originalName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0">
                          <h4 className="font-semibold text-white text-sm truncate">
                            {review.image.originalName || 'Untitled'}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-[#94A3B8] mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                            {review.project && (
                              <span className="flex items-center gap-1">
                                <FolderOpen className="w-3 h-3" />
                                {review.project.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${config.bg} ${config.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {config.label}
                        </div>
                      </div>

                      {/* Comment */}
                      {review.comment && (
                        <div className="bg-[#0B1220] border border-[#1E293B] rounded-lg p-3 mt-2">
                          <p className="text-xs text-[#94A3B8] italic">"{review.comment}"</p>
                        </div>
                      )}

                      {/* Actions */}
                      {review.status === 'PENDING' && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          <button
                            onClick={() => handleAction(review.id, 'APPROVED')}
                            className="bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors rounded-lg py-2 px-4 text-xs font-medium flex items-center gap-1.5"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(review.id, 'REJECTED')}
                            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors rounded-lg py-2 px-4 text-xs font-medium flex items-center gap-1.5"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                            Reject
                          </button>
                          <button
                            onClick={() => {
                              const comment = prompt('Enter revision request:');
                              if (comment) handleAction(review.id, 'REVISION_REQUESTED', comment);
                            }}
                            className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors rounded-lg py-2 px-4 text-xs font-medium flex items-center gap-1.5"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Request Revision
                          </button>
                        </div>
                      )}

                      {/* Re-open for approved/rejected */}
                      {review.status !== 'PENDING' && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          <button
                            onClick={() => handleAction(review.id, 'PENDING', '')}
                            className="bg-[#1E293B] text-[#94A3B8] hover:bg-[#2D3B4F] transition-colors rounded-lg py-2 px-4 text-xs font-medium flex items-center gap-1.5"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            Re-open for Review
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}