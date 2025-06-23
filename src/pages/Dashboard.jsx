import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCRM } from '../context/CRMContext';
import { format, subDays, isAfter } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import ContactForm from '../components/Contacts/ContactForm';

const { FiUsers, FiMessageSquare, FiTrendingUp, FiCalendar, FiPlus } = FiIcons;

const Dashboard = () => {
  const { contacts, interactions } = useCRM();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);

  const stats = [
    {
      title: 'Total Contacts',
      value: contacts.length,
      icon: FiUsers,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Interactions This Week',
      value: interactions.filter(i => 
        isAfter(new Date(i.createdAt), subDays(new Date(), 7))
      ).length,
      icon: FiMessageSquare,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      title: 'Active Relationships',
      value: contacts.filter(c => 
        c.lastContact && isAfter(new Date(c.lastContact), subDays(new Date(), 30))
      ).length,
      icon: FiTrendingUp,
      color: 'bg-purple-500',
      change: '+5%',
    },
    {
      title: 'Follow-ups Due',
      value: contacts.filter(c => 
        !c.lastContact || !isAfter(new Date(c.lastContact), subDays(new Date(), 14))
      ).length,
      icon: FiCalendar,
      color: 'bg-orange-500',
      change: '-3%',
    },
  ];

  const recentContacts = contacts
    .filter(c => c.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const recentInteractions = interactions
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your contacts.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700 transition-colors duration-200"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>Add Contact</span>
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contacts */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Contacts</h2>
              <button
                onClick={() => navigate('/contacts')}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            {recentContacts.length === 0 ? (
              <div className="text-center py-8">
                <SafeIcon icon={FiUsers} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts yet</h3>
                <p className="text-gray-600 mb-4">Start building your network by adding your first contact.</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Add First Contact
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center space-x-4">
                    <img
                      src={contact.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`}
                      alt={contact.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {format(new Date(contact.createdAt), 'MMM dd')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Interactions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Interactions</h2>
              <button
                onClick={() => navigate('/analytics')}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View Analytics
              </button>
            </div>
          </div>
          <div className="p-6">
            {recentInteractions.length === 0 ? (
              <div className="text-center py-8">
                <SafeIcon icon={FiMessageSquare} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No interactions yet</h3>
                <p className="text-gray-600 mb-4">Start engaging with your contacts to see interactions here.</p>
                <button
                  onClick={() => navigate('/contacts')}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  View Contacts
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentInteractions.map((interaction) => {
                  const contact = contacts.find(c => c.id === interaction.contactId);
                  return (
                    <div key={interaction.id} className="flex items-start space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        interaction.type === 'email' ? 'bg-blue-100 text-blue-600' :
                        interaction.type === 'call' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        <SafeIcon 
                          icon={
                            interaction.type === 'email' ? FiIcons.FiMail :
                            interaction.type === 'call' ? FiIcons.FiPhone :
                            FiIcons.FiUsers
                          } 
                          className="w-4 h-4" 
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{interaction.subject}</p>
                        <p className="text-sm text-gray-600">{contact?.name}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {format(new Date(interaction.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Add Contact Modal */}
      {showAddForm && (
        <ContactForm onClose={() => setShowAddForm(false)} />
      )}
    </div>
  );
};

export default Dashboard;