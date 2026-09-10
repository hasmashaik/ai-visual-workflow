'use client';

import { useEffect, useState } from 'react';
import { 
  Image as ImageIcon, Search, Eye, Trash2
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await api.get('/images');
      setAssets(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;
    try {
      await api.delete(`/images/${id}`);
      toast.success('Asset deleted');
      fetchAssets();
    } catch (error) {
      toast.error('Failed to delete asset');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const filteredAssets = assets.filter((asset) =>
    asset.originalName?.toLowerCase().includes(search.toLowerCase()) ||
    asset.type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="pt-4 pb-4 border-b border-[#1E293B]">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-[#7C3AED]" />
            Assets
          </h1>
          <p className="text-[#94A3B8] text-sm">Manage all your product images and generated visuals</p>
        </div>

        <div className="px-6 py-4">
          <div className="relative max-w-md mb-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0B1220] border border-[#1E293B] rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-[#64748B] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 text-sm"
              placeholder="Search assets..."
            />
          </div>

          {filteredAssets.length === 0 ? (
            <div className="card text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#7C3AED]/20 flex items-center justify-center mx-auto mb-3">
                <ImageIcon className="w-8 h-8 text-[#7C3AED]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">No assets found</h3>
              <p className="text-[#94A3B8] text-sm">Upload images or generate visuals to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAssets.map((asset) => (
                <div key={asset.id} className="card p-3 group">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-[#0B1220]">
                    <img
                      src={asset.secureUrl}
                      alt={asset.originalName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                        <span className="text-xs bg-[#7C3AED] px-2 py-0.5 rounded-full text-white">
                          {asset.type}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => window.open(asset.secureUrl, '_blank')}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(asset.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[#94A3B8] mt-2 truncate">
                    {asset.originalName || 'Untitled'}
                  </p>
                  <p className="text-xs text-[#64748B]">
                    {new Date(asset.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}