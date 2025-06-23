import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCRM } from '../context/CRMContext';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import ContactForm from '../components/Contacts/ContactForm';
import ContactCard from '../components/Contacts/ContactCard';

const { FiPlus, FiSearch, FiFilter, FiGrid, FiList, FiUserX } = FiIcons;

const Contacts = () => {
  const { contacts, searchQuery, setSearchQuery, filterTag, setFilterTag, tags } = useCRM();
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = !filterTag || contact.tags.includes(filterTag);
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-1">Manage your personal and professional relationships</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-primary-700 transition-colors duration-200"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>Add Contact</span>
        </motion.button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-80"
              />
            </div>
            <div className="relative">
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Tags</option>
                {tags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
              <SafeIcon icon={FiFilter} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <SafeIcon icon={FiGrid} className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                viewMode === 'list' 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <SafeIcon icon={FiList} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Contacts Grid/List */}
      {filteredContacts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <SafeIcon icon={FiUserX} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {contacts.length === 0 ? 'No contacts yet' : 'No contacts found'}
          </h3>
          <p className="text-gray-600 mb-4">
            {contacts.length === 0 
              ? 'Start building your network by adding your first contact.'
              : 'Try adjusting your search or filter criteria.'
            }
          </p>
          {contacts.length === 0 && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              Add First Contact
            </button>
          )}
        </motion.div>
      ) : (
        <motion.div
          layout
          className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }
        >
          <AnimatePresence>
            {filteredContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                viewMode={viewMode}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Add Contact Modal */}
      <AnimatePresence>
        {showAddForm && (
          <ContactForm onClose={() => setShowAddForm(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contacts;