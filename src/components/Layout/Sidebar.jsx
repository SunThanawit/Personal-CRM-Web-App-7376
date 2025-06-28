import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiHome, FiUsers, FiBarChart3, FiSettings } = FiIcons;

const Sidebar = () => {
  const navItems = [
    { path: '/', icon: FiHome, label: 'แดชบอร์ด' },
    { path: '/contacts', icon: FiUsers, label: 'รายชื่อผู้ติดต่อ' },
    { path: '/analytics', icon: FiBarChart3, label: 'การวิเคราะห์' },
    { path: '/settings', icon: FiSettings, label: 'การตั้งค่า' },
  ];

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-64 bg-white shadow-lg flex flex-col"
    >
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">CRM ส่วนตัว</h1>
        <p className="text-sm text-gray-600 mt-1">จัดการความสัมพันธ์ของคุณ</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <SafeIcon icon={item.icon} className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;