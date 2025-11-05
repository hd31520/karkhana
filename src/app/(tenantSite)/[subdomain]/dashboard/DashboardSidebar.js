'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardSidebar({ user, subdomain }) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Dashboard',
      href: `/${subdomain}/dashboard`,
      icon: '📊',
      roles: ['boss', 'manager', 'employee']
    },
    {
      name: 'Products',
      href: `/${subdomain}/dashboard/products`,
      icon: '📦',
      roles: ['boss', 'manager']
    },
    {
      name: 'Team',
      href: `/${subdomain}/dashboard/team`,
      icon: '👥',
      roles: ['boss']
    },
    {
      name: 'Attendance',
      href: `/${subdomain}/dashboard/attendance`,
      icon: '⏰',
      roles: ['boss', 'manager', 'employee']
    },
    {
      name: 'Profile',
      href: `/${subdomain}/dashboard/profile`,
      icon: '👤',
      roles: ['boss', 'manager', 'employee']
    },
    {
      name: 'Settings',
      href: `/${subdomain}/dashboard/settings`,
      icon: '⚙️',
      roles: ['boss']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow bg-gray-800 pt-5 pb-4 overflow-y-auto">
          {/* Logo/Business Name */}
          <div className="flex items-center flex-shrink-0 px-4">
            <span className="text-white text-lg font-semibold truncate">
              {user.businessName}
            </span>
          </div>

          {/* Navigation */}
          <nav className="mt-8 flex-1 flex flex-col">
            <div className="px-4 space-y-2">
              {filteredMenuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Info */}
          <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs font-medium text-gray-400 capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}