'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FolderOpen, Plus, MoreVertical, Trash2, 
  ArrowRight, Image
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Project {
  id: string;
  name: string;
  description: string | null;
  category: string;
  status: string;
  createdAt: string;
  _count: { images: number };
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', category: 'Fashion' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/projects', formData);
      toast.success('Project created successfully');
      setShowCreateModal(false);
      setFormData({ name: '', description: '', category: 'Fashion' });
      fetchProjects();
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted');
      fetchProjects();
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

  return (
    <div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="pt-4 pb-4 border-b border-[#1E293B]">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-[#7C3AED]" />
            Projects
          </h1>
          <p className="text-[#94A3B8] text-sm">Manage all your projects in one place</p>
        </div>

        <div className="px-6 py-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2 text-sm py-2 px-4 mb-4"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>

          {projects.length === 0 ? (
            <div className="card text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#7C3AED]/20 flex items-center justify-center mx-auto mb-3">
                <FolderOpen className="w-8 h-8 text-[#7C3AED]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">No projects yet</h3>
              <p className="text-[#94A3B8] text-sm mb-3">Create your first project to get started</p>
              <button onClick={() => setShowCreateModal(true)} className="btn-primary text-sm py-2 px-4">
                Create Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {projects.map((project) => (
                <div key={project.id} className="card p-4 group hover:border-[#7C3AED]/30 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[#7C3AED]/20 flex items-center justify-center flex-shrink-0">
                        <FolderOpen className="w-4 h-4 text-[#7C3AED]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-white text-sm truncate">{project.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${project.status === 'ACTIVE' ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-[#64748B]/20 text-[#64748B]'}`}>
                          {project.status || 'DRAFT'}
                        </span>
                      </div>
                    </div>
                    <button className="p-1 rounded-lg hover:bg-[#1E293B] transition-colors flex-shrink-0">
                      <MoreVertical className="w-4 h-4 text-[#94A3B8]" />
                    </button>
                  </div>
                  
                  <p className="text-sm text-[#94A3B8] mb-3 line-clamp-2 text-xs">
                    {project.description || 'No description'}
                  </p>
                  
                  <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
                    <span className="flex items-center gap-1">
                      <Image className="w-3 h-3" />
                      {project._count?.images || 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1E293B]">
                    <span className="text-xs text-[#64748B]">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/projects/${project.id}`)}
                        className="text-xs text-[#7C3AED] hover:text-[#6D2DE0] transition-colors flex items-center gap-1"
                      >
                        View
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-xs text-[#EF4444] hover:text-[#DC2626] transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-[#111827] rounded-2xl p-6 max-w-md w-full border border-[#1E293B]">
            <h2 className="text-xl font-bold text-white mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Project Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0B1220] border border-[#1E293B] rounded-xl py-2 px-4 text-white placeholder-[#64748B] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 text-sm"
                  placeholder="My Project"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#0B1220] border border-[#1E293B] rounded-xl py-2 px-4 text-white placeholder-[#64748B] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 text-sm"
                  placeholder="Project description"
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
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1 text-sm py-2">Create</button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
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