'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, Edit, Trash2, Image as ImageIcon,
  Package, Clock, Calendar, FolderOpen,
  Sparkles, Plus, Upload
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface ProjectDetail {
  id: string;
  name: string;
  description: string | null;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  images: any[];
  imageAssets: any[];
  activities: any[];
  products: any[];
  _count: {
    images: number;
  };
}

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Fashion',
    status: 'DRAFT'
  });

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${projectId}`);
      const data = res.data.data;
      setProject(data);
      setFormData({
        name: data.name,
        description: data.description || '',
        category: data.category,
        status: data.status
      });
    } catch (error) {
      toast.error('Failed to load project');
      router.push('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/projects/${projectId}`, formData);
      toast.success('Project updated successfully');
      setShowEditModal(false);
      fetchProject();
    } catch (error) {
      toast.error('Failed to update project');
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm('Are you sure you want to delete this project? All data will be lost.')) return;
    try {
      await api.delete(`/projects/${projectId}`);
      toast.success('Project deleted');
      router.push('/projects');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <FolderOpen className="w-16 h-16 text-[#64748B] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white">Project not found</h2>
          <button onClick={() => router.push('/projects')} className="btn-primary mt-4">
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const imageAssets = project.images || [];

  return (
    <div>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="pt-4 pb-4 border-b border-[#1E293B]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/projects')}
                className="p-2 rounded-lg hover:bg-[#1E293B] transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[#94A3B8]" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <FolderOpen className="w-6 h-6 text-[#7C3AED]" />
                  {project.name}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-[#94A3B8]">{project.category}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    project.status === 'ACTIVE' ? 'bg-[#22C55E]/20 text-[#22C55E]' :
                    project.status === 'COMPLETED' ? 'bg-[#06B6D4]/20 text-[#06B6D4]' :
                    'bg-[#64748B]/20 text-[#64748B]'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleDeleteProject}
                className="bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors rounded-xl py-2 px-4 text-sm flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="py-4">
          {/* Description */}
          {project.description && (
            <div className="card p-4 mb-4">
              <p className="text-[#94A3B8] text-sm">{project.description}</p>
              <p className="text-xs text-[#64748B] mt-2">
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            <div className="card p-4">
              <p className="text-xs text-[#94A3B8]">Total Assets</p>
              <p className="text-2xl font-bold text-white mt-1">{project._count?.images || 0}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-[#94A3B8]">Category</p>
              <p className="text-lg font-semibold text-white mt-1">{project.category}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-[#94A3B8]">Status</p>
              <p className="text-lg font-semibold text-white mt-1">{project.status}</p>
            </div>
          </div>

          {/* Recent Images */}
          <div className="card p-4">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#7C3AED]" />
              Recent Assets
            </h3>
            {imageAssets.length === 0 ? (
              <div className="text-center py-8">
                <ImageIcon className="w-12 h-12 text-[#64748B] mx-auto mb-2" />
                <p className="text-[#94A3B8] text-sm">No assets yet</p>
                <button onClick={() => router.push('/generate')} className="text-[#7C3AED] text-sm hover:text-[#6D2DE0]">
                  Generate your first visual
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {imageAssets.slice(0, 8).map((image) => (
                  <div key={image.id} className="aspect-square rounded-xl overflow-hidden bg-[#0B1220]">
                    <img
                      src={image.secureUrl}
                      alt={image.originalName}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activities */}
          {project.activities && project.activities.length > 0 && (
            <div className="card p-4 mt-4">
              <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#7C3AED]" />
                Recent Activity
              </h3>
              <div className="space-y-2">
                {project.activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-2 border-b border-[#1E293B] last:border-0">
                    <p className="text-sm text-[#94A3B8]">{activity.description}</p>
                    <span className="text-xs text-[#64748B]">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-[#111827] rounded-2xl p-6 max-w-md w-full border border-[#1E293B]">
            <h2 className="text-xl font-bold text-white mb-4">Edit Project</h2>
            <form onSubmit={handleUpdateProject} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Project Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0B1220] border border-[#1E293B] rounded-xl py-2 px-4 text-white placeholder-[#64748B] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#0B1220] border border-[#1E293B] rounded-xl py-2 px-4 text-white placeholder-[#64748B] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 text-sm"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#0B1220] border border-[#1E293B] rounded-xl py-2 px-4 text-white focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 text-sm"
                >
                  <option value="Fashion">Fashion</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Food">Food</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-[#0B1220] border border-[#1E293B] rounded-xl py-2 px-4 text-white focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 text-sm"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1 text-sm py-2">Update</button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary flex-1 text-sm py-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}