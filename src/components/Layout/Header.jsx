import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCRM } from '../../context/CRMContext';
import { format, subDays, isAfter } from 'date-fns';
import { th } from 'date-fns/locale';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiBell, FiSearch, FiX, FiClock, FiUser, FiMessageSquare } = FiIcons;

const Header = () => {
  const { contacts, interactions, searchQuery, setSearchQuery } = useCRM();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);

  // สร้างการแจ้งเตือนตามข้อมูล CRM
  useEffect(() => {
    const generateNotifications = () => {
      const newNotifications = [];
      const now = new Date();
      
      // การแจ้งเตือนการติดตาม (รายชื่อที่ไม่ได้ติดต่อเป็นเวลา 14 วัน)
      const followUpContacts = contacts.filter(contact => 
        !contact.lastContact || !isAfter(new Date(contact.lastContact), subDays(now, 14))
      );
      
      followUpContacts.slice(0, 3).forEach(contact => {
        newNotifications.push({
          id: `followup-${contact.id}`,
          type: 'followup',
          title: 'การแจ้งเตือนการติดตาม',
          message: `ถึงเวลาติดต่อ ${contact.name} แล้ว`,
          time: new Date(now - Math.random() * 3600000),
          avatar: contact.avatar,
          unread: true
        });
      });

      // การมีปฏิสัมพันธ์ล่าสุด
      const recentInteractions = interactions
        .filter(interaction => isAfter(new Date(interaction.createdAt), subDays(now, 1)))
        .slice(0, 2);

      recentInteractions.forEach(interaction => {
        const contact = contacts.find(c => c.id === interaction.contactId);
        if (contact) {
          newNotifications.push({
            id: `interaction-${interaction.id}`,
            type: 'interaction',
            title: 'การมีปฏิสัมพันธ์ใหม่',
            message: `${getInteractionTypeInThai(interaction.type)} กับ ${contact.name}: ${interaction.subject}`,
            time: new Date(interaction.createdAt),
            avatar: contact.avatar,
            unread: true
          });
        }
      });

      // การแจ้งเตือนวันเกิด (จำลอง)
      const birthdayContacts = contacts.filter(() => Math.random() < 0.1).slice(0, 1);
      birthdayContacts.forEach(contact => {
        newNotifications.push({
          id: `birthday-${contact.id}`,
          type: 'birthday',
          title: 'การแจ้งเตือนวันเกิด',
          message: `วันเกิดของ ${contact.name} จะมาถึงแล้ว!`,
          time: new Date(now - Math.random() * 86400000),
          avatar: contact.avatar,
          unread: true
        });
      });

      // เรียงลำดับตามเวลา (ใหม่สุดก่อน)
      return newNotifications.sort((a, b) => new Date(b.time) - new Date(a.time));
    };

    setNotifications(generateNotifications());
  }, [contacts, interactions]);

  // ปิดการแจ้งเตือนเมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, unread: false }))
    );
  };

  const clearNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getInteractionTypeInThai = (type) => {
    switch (type) {
      case 'email':
        return 'อีเมล';
      case 'call':
        return 'โทรศัพท์';
      case 'meeting':
        return 'ประชุม';
      default:
        return 'อื่นๆ';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'followup':
        return FiClock;
      case 'interaction':
        return FiMessageSquare;
      case 'birthday':
        return FiUser;
      default:
        return FiBell;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'followup':
        return 'text-orange-600 bg-orange-100';
      case 'interaction':
        return 'text-blue-600 bg-blue-100';
      case 'birthday':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-sm border-b border-gray-200 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <SafeIcon 
              icon={FiSearch} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
            />
            <input
              type="text"
              placeholder="ค้นหาผู้ติดต่อ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-80"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* กระดิ่งการแจ้งเตือน */}
          <div className="relative" ref={notificationRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <SafeIcon icon={FiBell} className="w-5 h-5" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </motion.button>

            {/* เมนูแจ้งเตือน */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden"
                >
                  {/* หัวข้อ */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">การแจ้งเตือน</h3>
                      <div className="flex items-center space-x-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                          >
                            ทำเครื่องหมายว่าอ่านแล้วทั้งหมด
                          </button>
                        )}
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        >
                          <SafeIcon icon={FiX} className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {unreadCount > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        คุณมีการแจ้งเตือนที่ยังไม่ได้อ่าน {unreadCount} รายการ
                      </p>
                    )}
                  </div>

                  {/* รายการแจ้งเตือน */}
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <SafeIcon icon={FiBell} className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h4 className="text-gray-900 font-medium mb-1">ไม่มีการแจ้งเตือน</h4>
                        <p className="text-gray-600 text-sm">คุณอ่านครบทุกรายการแล้ว!</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                              notification.unread ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                {notification.avatar ? (
                                  <img
                                    src={notification.avatar}
                                    alt=""
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                                    <SafeIcon icon={getNotificationIcon(notification.type)} className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                      {notification.title}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">
                                      {format(notification.time, 'dd MMM yyyy, HH:mm', { locale: th })}
                                    </p>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      clearNotification(notification.id);
                                    }}
                                    className="ml-2 p-1 text-gray-400 hover:text-gray-600 rounded"
                                  >
                                    <SafeIcon icon={FiX} className="w-3 h-3" />
                                  </button>
                                </div>
                                {notification.unread && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ท้าย */}
                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-200 bg-gray-50">
                      <button
                        onClick={() => {
                          setNotifications([]);
                          setShowNotifications(false);
                        }}
                        className="w-full text-center text-sm text-gray-600 hover:text-gray-900 font-medium"
                      >
                        ล้างการแจ้งเตือนทั้งหมด
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ส่วนโปรไฟล์ */}
          <div className="flex items-center space-x-3">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
              alt="โปรไฟล์"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-medium text-gray-900">สมชาย ใจดี</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;