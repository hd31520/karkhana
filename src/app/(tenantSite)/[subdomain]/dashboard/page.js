'use client';
import { useState, useEffect } from 'react';

export default function DashboardHome({ params }) {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalEmployees: 0,
    todayAttendance: 0,
    pendingTasks: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Demo data
    setStats({
      totalProducts: 2,
      totalEmployees: 1,
      todayAttendance: 1,
      pendingTasks: 0
    });
    
    setRecentActivity([
      {
        description: 'New product "Business Solution Package" added',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        description: 'User demo@example.com registered',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
      },
      {
        description: 'Website traffic increased by 15%',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      }
    ]);
    
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon="📦"
          color="blue"
          link="#products"
        />
        <StatCard
          title="Team Members"
          value={stats.totalEmployees}
          icon="👥"
          color="green"
          link="#team"
        />
        <StatCard
          title="Today's Attendance"
          value={stats.todayAttendance}
          icon="⏰"
          color="purple"
          link="#attendance"
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pendingTasks}
          icon="📋"
          color="yellow"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <RecentActivity activities={recentActivity} />

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </div>
  );
}

function QuickActions() {
  const actions = [
    {
      title: 'Add Product',
      description: 'Add new product to your catalog',
      icon: '➕',
      href: '#products',
      color: 'blue',
    },
    {
      title: 'Add Team Member',
      description: 'Invite new employee to your team',
      icon: '👤',
      href: '#team',
      color: 'green',
    },
    {
      title: 'View Attendance',
      description: 'Check team attendance records',
      icon: '📊',
      href: '#attendance',
      color: 'purple',
    },
    {
      title: 'Update Contact Info',
      description: 'Edit your business contact details',
      icon: '📞',
      href: '#settings',
      color: 'yellow',
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <a
            key={index}
            href={action.href}
            className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className={`w-10 h-10 rounded-lg bg-${action.color}-100 flex items-center justify-center mr-3 group-hover:bg-${action.color}-200 transition-colors`}>
              <span className="text-lg">{action.icon}</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// Simple StatCard component for this file
function StatCard({ title, value, icon, color, link }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500'
  };

  const content = (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
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

  if (link) {
    return (
      <a href={link}>
        {content}
      </a>
    );
  }

  return content;
}

// Simple RecentActivity component for this file
function RecentActivity({ activities }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
      
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent activity</p>
        ) : (
          activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">📝</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}