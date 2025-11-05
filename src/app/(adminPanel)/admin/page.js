'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalTenants: 0,
    activeTenants: 0,
    totalUsers: 0,
    pendingTenants: 0
  });

  useEffect(() => {
    // Demo stats
    setStats({
      totalTenants: 1,
      activeTenants: 1,
      totalUsers: 1,
      pendingTenants: 0
    });
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to Karkhana.shop administration panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Tenants"
          value={stats.totalTenants}
          icon="🏢"
          color="blue"
        />
        <StatCard
          title="Active Tenants"
          value={stats.activeTenants}
          icon="✅"
          color="green"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="👥"
          color="purple"
        />
        <StatCard
          title="Pending Approval"
          value={stats.pendingTenants}
          icon="⏳"
          color="yellow"
        />
      </div>

      {/* Quick Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">System Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Current Mode</h3>
            <p className="text-gray-900">Demo Mode (Memory Database)</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Database</h3>
            <p className="text-gray-900">In-Memory Storage</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Authentication</h3>
            <p className="text-gray-900">Demo Mode (Auto-login)</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Status</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${colorClasses[color]} bg-opacity-10`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}