'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Package, Image, Sparkles, 
  Clock, History, Settings, LogOut, Menu, X,
  MessageSquare, FolderOpen, Bell, User, ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Projects', icon: FolderOpen, href: '/projects' },
  { label: 'Generate', icon: Sparkles, href: '/generate' },
  { label: 'Assets', icon: Image, href: '/assets' },
  { label: 'Reviews', icon: MessageSquare, href: '/reviews' },
  { label: 'History', icon: History, href: '/history' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New project created', read: false },
    { id: 2, message: 'Image generated successfully', read: false },
    { id: 3, message: 'Review pending', read: true },
  ]);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      await fetch(`${apiUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      // Ignore error if API fails
    }

    // Clear localStorage
    localStorage.removeItem('token');

    // Clear all cookies
    document.cookie.split(';').forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });

    toast.success('Logged out successfully');
    router.push('/login');
  };

  const toggleNotifications = () => {
    setNotificationOpen(!notificationOpen);
    setProfileDropdownOpen(false);
  };

  const toggleProfile = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
    setNotificationOpen(false);
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#070A12]">
      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-[#0D111C] border-r border-[#1E293B]
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col h-full
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[#1E293B] flex-shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#6D2DE0] flex items-center justify-center shadow-lg shadow-[#7C3AED]/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">
                VisualForge AI
              </span>
              <p className="text-xs text-[#64748B]">Create. Review. Approve.</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200
                  ${
                    isActive
                      ? 'bg-[#7C3AED]/20 text-[#7C3AED]'
                      : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#1E293B] flex-shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-[#94A3B8] hover:bg-[#1E293B] hover:text-white transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0D111C] border-b border-[#1E293B] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#6D2DE0] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white">VisualForge AI</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Top Navbar - Only icons on right side */}
        <div className="flex items-center justify-end px-6 py-4 border-b border-[#1E293B] bg-[#0D111C] flex-shrink-0 h-[72px]">
          <div className="flex items-center gap-3">
            {/* Notification Icon */}
            <div ref={notificationRef} className="relative">
              <button
                onClick={toggleNotifications}
                className="relative p-2.5 rounded-lg hover:bg-[#1E293B] transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-[#94A3B8]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-[#0D111C]"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#111827] border border-[#1E293B] rounded-xl shadow-2xl shadow-black/50 z-50">
                  <div className="flex items-center justify-between p-4 border-b border-[#1E293B]">
                    <h3 className="text-sm font-semibold text-white">
                      Notifications
                    </h3>
                    <button
                      onClick={markAllRead}
                      className="text-xs text-[#7C3AED] hover:text-[#6D2DE0] transition-colors"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-[#94A3B8] text-sm">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 border-b border-[#1E293B] last:border-0 hover:bg-[#1E293B] transition-colors ${
                            !notification.read ? 'bg-[#7C3AED]/5' : ''
                          }`}
                        >
                          <p
                            className={`text-sm ${
                              !notification.read ? 'text-white' : 'text-[#94A3B8]'
                            }`}
                          >
                            {notification.message}
                          </p>
                          <span
                            className={`text-xs ${
                              !notification.read
                                ? 'text-[#7C3AED]'
                                : 'text-[#64748B]'
                            }`}
                          >
                            {!notification.read ? 'New' : 'Read'}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Icon */}
            <div ref={profileRef} className="relative">
              <button
                onClick={toggleProfile}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#1E293B] transition-colors"
                aria-label="Profile"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#6D2DE0] flex items-center justify-center">
                  <User className="w-4.5 h-4.5 text-white" />
                </div>
                <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#111827] border border-[#1E293B] rounded-xl shadow-2xl shadow-black/50 z-50">
                  <div className="p-3 border-b border-[#1E293B]">
                    <p className="text-sm font-medium text-white">Account</p>
                    <p className="text-xs text-[#64748B]">
                      Manage your profile
                    </p>
                  </div>
                  <div className="p-1">
                    <Link
                      href="/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#94A3B8] hover:bg-[#1E293B] hover:text-white transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto bg-[#070A12]">
          {children}
        </main>
      </div>
    </div>
  );
}