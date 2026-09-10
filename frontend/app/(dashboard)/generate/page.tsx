'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, Upload, Image as ImageIcon, 
  Palette, Zap, ArrowRight, Loader2
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const styles = ['Studio', 'Luxury', 'Minimal', 'Lifestyle', 'Outdoor', 'E-commerce', 'Fashion', 'Premium', 'Cinematic'];

export default function GeneratePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    projectId: '',
    prompt: '',
    style: 'Studio',
    variations: 1,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load projects');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      toast.error('Please upload a product image first');
      return;
    }
    if (!formData.projectId) {
      toast.error('Please select a project');
      return;
    }

    setLoading(true);
    try {
      // 1. Upload the product image
      const formDataImage = new FormData();
      formDataImage.append('image', selectedImage);
      formDataImage.append('projectId', formData.projectId);
      formDataImage.append('type', 'PRODUCT');
      
      console.log('Uploading product image...');
      const uploadRes = await api.post('/images/upload', formDataImage, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      console.log('Image uploaded:', uploadRes.data.data.id);

      // 2. Generate visuals - call the generation API directly
      console.log('Generating visuals...');
      const generateRes = await api.post('/generations', {
        projectId: formData.projectId,
        prompt: formData.prompt || 'Create a premium e-commerce product visual with soft studio lighting, clean background, realistic shadows and luxury advertising style.',
        style: formData.style,
        imageId: uploadRes.data.data.id,
      });

      console.log('Generation complete:', generateRes.data);

      toast.success('Visuals generated successfully!');
      router.push('/assets');
    } catch (error: any) {
      console.error('Generation error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="pt-4 pb-4 border-b border-[#1E293B]">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#7C3AED]" />
            Generate
          </h1>
          <p className="text-[#94A3B8] text-sm">Create stunning product visuals with AI</p>
        </div>

        <div className="px-6 py-4">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left - Upload & Settings */}
            <div className="space-y-6">
              {/* Upload */}
              <div className="card">
                <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-[#7C3AED]" />
                  Upload Product Image
                </h3>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="border-2 border-dashed border-[#1E293B] rounded-xl p-6 text-center hover:border-[#7C3AED]/50 transition-colors">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="max-h-40 mx-auto rounded-lg" />
                    ) : (
                      <>
                        <ImageIcon className="w-10 h-10 text-[#64748B] mx-auto mb-2" />
                        <p className="text-[#94A3B8] text-sm">Drop your image here or click to browse</p>
                        <p className="text-xs text-[#64748B] mt-1">PNG, JPG, WEBP up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="card">
                <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-[#7C3AED]" />
                  Settings
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Project</label>
                    <select
                      value={formData.projectId}
                      onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                      className="w-full bg-[#0B1220] border border-[#1E293B] rounded-xl py-2.5 px-4 text-white focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 text-sm"
                    >
                      <option value="">Select a project</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Style</label>
                    <select
                      value={formData.style}
                      onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                      className="w-full bg-[#0B1220] border border-[#1E293B] rounded-xl py-2.5 px-4 text-white focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 text-sm"
                    >
                      {styles.map((style) => (
                        <option key={style} value={style}>{style}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Prompt</label>
                    <textarea
                      value={formData.prompt}
                      onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                      className="w-full bg-[#0B1220] border border-[#1E293B] rounded-xl py-2.5 px-4 text-white placeholder-[#64748B] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 text-sm"
                      placeholder="Describe the visual you want to create..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Number of Variations</label>
                    <select
                      value={formData.variations}
                      onChange={(e) => setFormData({ ...formData, variations: Number(e.target.value) })}
                      className="w-full bg-[#0B1220] border border-[#1E293B] rounded-xl py-2.5 px-4 text-white focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 text-sm"
                    >
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Preview & Generate */}
            <div className="space-y-6">
              <div className="card h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 rounded-full bg-[#7C3AED]/20 flex items-center justify-center mb-4">
                  <Zap className="w-10 h-10 text-[#7C3AED]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Ready to Generate</h3>
                <p className="text-[#94A3B8] text-sm max-w-md">
                  Upload a product image, select your settings, and let AI create stunning visuals for your product.
                </p>
                
                {previewUrl && (
                  <div className="mt-4 w-full">
                    <img src={previewUrl} alt="Product" className="w-full max-h-48 object-contain rounded-lg bg-[#0B1220] p-4" />
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={loading || !selectedImage}
                  className="btn-primary w-full max-w-md mt-6 text-sm py-2.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Visuals
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}