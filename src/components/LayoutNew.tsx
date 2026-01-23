// @ts-nocheck
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../services/authService';

const LayoutNew = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = AuthService.getUserData();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: '🏠', roles: ['SUPERADMIN', 'ADMIN', 'EXPERT'] },
    { name: 'Korisnici', path: '/users', icon: '👥', roles: ['SUPERADMIN'], badge: 'SA' },
    { name: 'Eksperti', path: '/experts', icon: '👨‍⚕️', roles: ['SUPERADMIN'], badge: 'SA' },
    { name: 'Forum Kategorije', path: '/forum-categories', icon: '💬', roles: ['SUPERADMIN', 'ADMIN'], badge: 'SA, ADM' },
    { name: 'Specijalizacije', path: '/specializations', icon: '🎯', roles: ['SUPERADMIN'], badge: 'SA' },
    { name: 'Prijavljeni Postovi', path: '/reported-posts', icon: '🚩', roles: ['SUPERADMIN', 'ADMIN'], badge: 'SA, ADM' },
    { name: 'Prijavljeni Komentari', path: '/reported-comments', icon: '🚩', roles: ['SUPERADMIN', 'ADMIN'], badge: 'SA, ADM' },
    { name: 'Odbijeni Postovi', path: '/rejected-posts', icon: '⛔', roles: ['SUPERADMIN', 'ADMIN'], badge: 'SA, ADM' },
    { name: 'Odbijeni Komentari', path: '/rejected-comments', icon: '⛔', roles: ['SUPERADMIN', 'ADMIN'], badge: 'SA, ADM' },
    { name: 'HelpDesk Termini', path: '/helpdesk-slots', icon: '📅', roles: ['SUPERADMIN'], badge: 'SA' },
    { name: 'Expert Termini', path: '/slots', icon: '📆', roles: ['EXPERT'], badge: 'EXP' },
    { name: 'Sastanci', path: '/meetings', icon: '🤝', roles: ['SUPERADMIN', 'ADMIN'], badge: 'SA, ADM' },
  ];

  const hasAccess = (roles: string[]) => {
    return roles.includes(userData?.role);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const currentPage = menuItems.find(item => item.path === location.pathname);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-cyan-600">Parentivo</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const canAccess = hasAccess(item.roles);
              const active = isActive(item.path);
              
              return (
                <li key={item.path}>
                  <button
                    onClick={() => {
                      if (canAccess) {
                        navigate(item.path);
                        setSidebarOpen(false);
                      }
                    }}
                    disabled={!canAccess}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                      ${canAccess 
                        ? active
                          ? 'bg-cyan-50 text-cyan-700 font-medium shadow-sm'
                          : 'hover:bg-gray-50 text-gray-700'
                        : 'text-gray-400 cursor-not-allowed opacity-50'
                      }
                    `}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="block truncate text-sm">{item.name}</span>
                        {!canAccess && (
                          <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      {item.badge && (
                        <span className="text-[10px] text-gray-500 mt-0.5 block">{item.badge}</span>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-16 bg-cyan-500 shadow-md flex items-center justify-between px-6 relative z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-white hover:bg-cyan-600 p-2 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-white text-lg font-medium">
              {currentPage?.name || 'Parentivo Admin'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <div className="text-white text-sm font-medium">{userData?.email}</div>
              <div className="text-xs">
                <span className={`
                  inline-block px-2 py-0.5 rounded-full text-xs font-medium
                  ${userData?.role === 'SUPERADMIN' ? 'bg-purple-600 text-white' : ''}
                  ${userData?.role === 'ADMIN' ? 'bg-blue-600 text-white' : ''}
                  ${userData?.role === 'EXPERT' ? 'bg-green-600 text-white' : ''}
                `}>
                  {userData?.role}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white text-cyan-600 px-4 py-2 rounded-lg hover:bg-cyan-50 transition-colors font-medium text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Odjavi se</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="animate-slide-in">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LayoutNew;
