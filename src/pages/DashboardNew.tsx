// @ts-nocheck
import React from 'react';
import AuthService from '../services/authService';

const DashboardNew = () => {
  const userData = AuthService.getUserData();


  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dobrodošli, {userData?.fullName || userData?.email}!
        </h1>
        <p className="text-gray-600">
          Pregled vašeg admin panela
        </p>
      </div>


      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Info */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Informacije o nalogu
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Ime:</span>
              <span className="font-medium text-gray-900">{userData?.fullName || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-900">{userData?.email}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Rola:</span>
              <span className={`
                badge
                ${userData?.role === 'SUPERADMIN' ? 'badge-superadmin' : ''}
                ${userData?.role === 'ADMIN' ? 'badge-admin' : ''}
                ${userData?.role === 'EXPERT' ? 'badge-expert' : ''}
                ${userData?.role === 'USER' ? 'badge-user' : ''}
              `}>
                {userData?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Brzi pristup
          </h3>
          <div className="space-y-2">
            {userData?.role === 'SUPERADMIN' && (
              <>
                <a 
                  href="/users" 
                  className="block px-4 py-3 bg-gray-50 rounded-lg hover:bg-cyan-50 hover:text-cyan-700 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">👥</span>
                    <span className="font-medium">Upravljanje korisnicima</span>
                  </div>
                </a>
                <a 
                  href="/experts" 
                  className="block px-4 py-3 bg-gray-50 rounded-lg hover:bg-cyan-50 hover:text-cyan-700 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">👨‍⚕️</span>
                    <span className="font-medium">Upravljanje ekspertima</span>
                  </div>
                </a>
              </>
            )}
            {['SUPERADMIN', 'ADMIN'].includes(userData?.role) && (
              <>
                <a 
                  href="/forum-categories" 
                  className="block px-4 py-3 bg-gray-50 rounded-lg hover:bg-cyan-50 hover:text-cyan-700 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">💬</span>
                    <span className="font-medium">Forum kategorije</span>
                  </div>
                </a>
                <a 
                  href="/reported-posts" 
                  className="block px-4 py-3 bg-gray-50 rounded-lg hover:bg-cyan-50 hover:text-cyan-700 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🚩</span>
                    <span className="font-medium">Prijavljeni postovi</span>
                  </div>
                </a>
              </>
            )}
            {userData?.role === 'EXPERT' && (
              <a 
                href="/slots" 
                className="block px-4 py-3 bg-gray-50 rounded-lg hover:bg-cyan-50 hover:text-cyan-700 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">📆</span>
                  <span className="font-medium">Moji termini</span>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNew;
