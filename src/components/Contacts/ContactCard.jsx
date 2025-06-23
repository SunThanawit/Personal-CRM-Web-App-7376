import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCRM } from '../../context/CRMContext';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import ContactForm from './ContactForm';

const { FiMail, FiPhone, FiBriefcase, FiMoreVertical, FiEdit, FiTrash2, FiEye } = FiIcons;

const ContactCard = ({ contact, viewMode }) => {
  const { deleteContact } = useCRM();
  const [showMenu, setShowMenu] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      deleteContact(contact.id);
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={contact.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face`}
              alt={contact.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{contact.name}</h3>
              <p className="text-sm text-gray-600">{contact.company} • {contact.position}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  <SafeIcon icon={FiMail} className="w-4 h-4" />
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                >
                  <SafeIcon icon={FiPhone} className="w-4 h-4" />
                </a>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {contact.tags.slice(0, 2).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-500">
                {contact.lastContact ? format(new Date(contact.lastContact), 'MMM dd') : 'No contact'}
              </p>
              <p className="text-xs text-gray-400">
                {contact.interactionCount || 0} interactions
              </p>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <SafeIcon icon={FiMoreVertical} className="w-4 h-4" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <Link
                    to={`/contacts/${contact.id}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <SafeIcon icon={FiEye} className="w-4 h-4 mr-2" />
                    View Details
                  </Link>
                  <button
                    onClick={() => setShowEditForm(true)}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <SafeIcon icon={FiEdit} className="w-4 h-4 mr-2" />
                    Edit Contact
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {showEditForm && (
          <ContactForm
            contact={contact}
            onClose={() => setShowEditForm(false)}
          />
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={contact.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face`}
            alt={contact.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{contact.name}</h3>
            <p className="text-sm text-gray-600">{contact.company}</p>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <SafeIcon icon={FiMoreVertical} className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <Link
                to={`/contacts/${contact.id}`}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <SafeIcon icon={FiEye} className="w-4 h-4 mr-2" />
                View Details
              </Link>
              <button
                onClick={() => setShowEditForm(true)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <SafeIcon icon={FiEdit} className="w-4 h-4 mr-2" />
                Edit Contact
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <SafeIcon icon={FiTrash2} className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        {contact.position && (
          <div className="flex items-center text-sm text-gray-600">
            <SafeIcon icon={FiBriefcase} className="w-4 h-4 mr-2" />
            {contact.position}
          </div>
        )}
        {contact.email && (
          <div className="flex items-center text-sm text-gray-600">
            <SafeIcon icon={FiMail} className="w-4 h-4 mr-2" />
            {contact.email}
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <SafeIcon icon={FiPhone} className="w-4 h-4 mr-2" />
            {contact.phone}
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {contact.tags.map(tag => (
          <span
            key={tag}
            className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          {contact.lastContact ? format(new Date(contact.lastContact), 'MMM dd') : 'No contact'}
        </span>
        <span>{contact.interactionCount || 0} interactions</span>
      </div>
      
      {showEditForm && (
        <ContactForm
          contact={contact}
          onClose={() => setShowEditForm(false)}
        />
      )}
    </motion.div>
  );
};

export default ContactCard;