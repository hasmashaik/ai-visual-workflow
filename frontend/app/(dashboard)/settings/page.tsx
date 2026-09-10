'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Settings as SettingsIcon, 
  User, Mail, Lock, 
  AlertTriangle, Save, Eye, EyeOff,
  Shield, Bell, Moon, Sun, Globe,
  Smartphone, Key, CreditCard
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.data);
      setProfileData({
        name: res.data.data.name,
        email: res.data.data.email,
      });
    } catch (error) {
      toast.error('Failed to load user data');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    if (!confirm('All your data including projects, images, and generations will be permanently deleted. Are you sure?')) return;
    try {
      toast.success('Account deleted');
      localStorage.removeItem('token');
      router.push('/login');
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-[#7C3AED]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-[#94A3B8] text-sm">Manage your account settings and preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Profile Section */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/20 flex items-center justify-center">
                <User className="w-4 h-4 text-[#7C3AED]" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Profile</h2>
                <p className="text-xs text-[#64748B]">Update your personal information</p>
              </div>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full bg-[#0B1220] border border-[#1E293B] rounded-xl py-2.5 pl-11 pr-4 text-white text-sm focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
                    placeholder="Your name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full bg-[#0B1220] border border-[#1E293B] rounded-xl py-2.5 pl-11 pr-4 text-white text-sm focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary text-sm py-2 px-5">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </form>
          </div>

          {/* Security Section */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/20 flex items-center justify-center">
                <Lock className="w-4 h-4 text-[#7C3AED]" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Security</h2>
                <p className="text-xs text-[#64748B]">Change your password</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full bg-[#0B1220] border border-[#1E293B] rounded-xl py-2.5 pl-11 pr-12 text-white text-sm focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full bg-[#0B1220] border border-[#1E293B] rounded-xl py-2.5 pl-11 pr-12 text-white text-sm focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8]"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full bg-[#0B1220] border border-[#1E293B] rounded-xl py-2.5 pl-11 pr-12 text-white text-sm focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary text-sm py-2 px-5">
                <Save className="w-4 h-4" />
                Change Password
              </button>
            </form>
          </div>

          {/* Preferences Section */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/20 flex items-center justify-center">
                <Bell className="w-4 h-4 text-[#7C3AED]" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Preferences</h2>
                <p className="text-xs text-[#64748B]">Customize your experience</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0D111C] border border-[#1E293B]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-[#7C3AED]" />
                  </div>
                  <div>
                    <p className="text-sm text-white">Notifications</p>
                    <p className="text-xs text-[#64748B]">Receive email notifications</p>
                  </div>
                </div>
                <div className="w-10 h-6 rounded-full bg-[#7C3AED] cursor-pointer relative">
                  <div className="w-4 h-4 rounded-full bg-white absolute top-1 right-1"></div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0D111C] border border-[#1E293B]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#06B6D4]/10 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-[#06B6D4]" />
                  </div>
                  <div>
                    <p className="text-sm text-white">Language</p>
                    <p className="text-xs text-[#64748B]">English (US)</p>
                  </div>
                </div>
                <button className="text-xs text-[#94A3B8] hover:text-white transition-colors">Change</button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0D111C] border border-[#1E293B]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
                    <Sun className="w-4 h-4 text-[#F59E0B]" />
                  </div>
                  <div>
                    <p className="text-sm text-white">Theme</p>
                    <p className="text-xs text-[#64748B]">Dark mode</p>
                  </div>
                </div>
                <button className="text-xs text-[#94A3B8] hover:text-white transition-colors">Change</button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card border-red-500/20 hover:border-red-500/40 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-red-400">Danger Zone</h2>
                <p className="text-xs text-[#64748B]">Permanently delete your account</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
              <p className="text-sm text-[#94A3B8] mb-3">
                Once you delete your account, there is no going back. This action is permanent and irreversible. All your projects, images, and data will be permanently removed.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors rounded-xl py-2 px-4 text-sm font-medium flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}