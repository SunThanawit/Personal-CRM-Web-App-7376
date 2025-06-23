import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCRM } from '../context/CRMContext';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import InteractionForm from '../components/Interactions/InteractionForm';

const { FiArrowLeft, FiMail, FiPhone, FiBriefcase, FiPlus, FiEdit, FiTrash2, FiMessageSquare, FiCalendar } = FiIcons;

const ContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contacts, interactions, deleteContact } = useCRM();
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  
  const contact = contacts.find(c => c.id === id);
  const contactInteractions = interactions.filter(i => i.contactId === id);

  if (!contact) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact not found</h2>
        <button
          onClick={() => navigate('/contacts')}
          className="text-primary-600 hover:text-primary-700"
        >
          Back to Contacts
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      deleteContact(contact.id);
      navigate('/contacts');
    }
  };

  const getInteractionIcon = (type) => {
    switch (type) {
      case 'email':
        return FiMail;
      case 'call':
        return FiPhone;
      case 'meeting':
        return FiCalendar;
      default:
        return FiMessageSquare;
    }
  };

  const getInteractionColor = (type) => {
    switch (type) {
      case 'email':
        return 'bg-blue-100 text-blue-600';
      case 'call':
        return 'bg-green-100 text-green-600';
      case 'meeting':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/contacts')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{contact.name}</h1>
            <p className="text-gray-600 mt-1">{contact.company} • {contact.position}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowInteractionForm(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700 transition-colors duration-200"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>Add Interaction</span>
          </motion.button>
          
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <SafeIcon icon={FiEdit} className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleDelete}
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <SafeIcon icon={FiTrash2} className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="text-center mb-6">
              <img
                src={contact.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face`}
                alt={contact.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h2 className="text-xl font-semibold text-gray-900">{contact.name}</h2>
              <p className="text-gray-600">{contact.position}</p>
              <p className="text-gray-500">{contact.company}</p>
            </div>
            
            <div className="space-y-4">
              {contact.email && (
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiMail} className="w-5 h-5 text-gray-400" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {contact.email}
                  </a>
                </div>
              )}
              
              {contact.phone && (
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiPhone} className="w-5 h-5 text-gray-400" />
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {contact.phone}
                  </a>
                </div>
              )}
              
              {contact.company && (
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiBriefcase} className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{contact.company}</span>
                </div>
              )}
            </div>
            
            {contact.tags.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {contact.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {contact.notes && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Notes</h3>
                <p className="text-gray-600 text-sm">{contact.notes}</p>
              </div>
            )}
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{contact.interactionCount || 0}</p>
                  <p className="text-sm text-gray-600">Interactions</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Contact</p>
                  <p className="font-medium text-gray-900">
                    {contact.lastContact ? format(new Date(contact.lastContact), 'MMM dd, yyyy') : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Interactions Timeline */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Interaction History</h2>
            </div>
            
            <div className="p-6">
              {contactInteractions.length === 0 ? (
                <div className="text-center py-8">
                  <SafeIcon icon={FiMessageSquare} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No interactions yet</h3>
                  <p className="text-gray-600 mb-4">Start building your relationship by adding an interaction.</p>
                  <button
                    onClick={() => setShowInteractionForm(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    Add First Interaction
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {contactInteractions
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((interaction) => (
                      <motion.div
                        key={interaction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getInteractionColor(interaction.type)}`}>
                          <SafeIcon icon={getInteractionIcon(interaction.type)} className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-900">{interaction.subject}</h3>
                            <span className="text-sm text-gray-500">
                              {format(new Date(interaction.createdAt), 'MMM dd, yyyy')}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">{interaction.notes}</p>
                          <div className="mt-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getInteractionColor(interaction.type)}`}>
                              {interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add Interaction Modal */}
      <AnimatePresence>
        {showInteractionForm && (
          <InteractionForm
            contact={contact}
            onClose={() => setShowInteractionForm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactDetail;