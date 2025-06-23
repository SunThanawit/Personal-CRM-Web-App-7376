import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { format } from 'date-fns';

const CRMContext = createContext();

const initialState = {
  contacts: [],
  interactions: [],
  tags: ['Work', 'Personal', 'Family', 'Friend', 'Client', 'Prospect', 'Partner'],
  selectedContact: null,
  searchQuery: '',
  filterTag: '',
  sortBy: 'name',
};

function crmReducer(state, action) {
  switch (action.type) {
    case 'SET_CONTACTS':
      return { ...state, contacts: action.payload };
    
    case 'ADD_CONTACT':
      const newContact = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        lastContact: null,
        interactionCount: 0,
      };
      return { ...state, contacts: [...state.contacts, newContact] };
    
    case 'UPDATE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.map(contact =>
          contact.id === action.payload.id ? { ...contact, ...action.payload } : contact
        ),
      };
    
    case 'DELETE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.filter(contact => contact.id !== action.payload),
        interactions: state.interactions.filter(interaction => interaction.contactId !== action.payload),
      };
    
    case 'ADD_INTERACTION':
      const interaction = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      
      const updatedContacts = state.contacts.map(contact => {
        if (contact.id === interaction.contactId) {
          return {
            ...contact,
            lastContact: interaction.createdAt,
            interactionCount: (contact.interactionCount || 0) + 1,
          };
        }
        return contact;
      });
      
      return {
        ...state,
        interactions: [...state.interactions, interaction],
        contacts: updatedContacts,
      };
    
    case 'SET_SELECTED_CONTACT':
      return { ...state, selectedContact: action.payload };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_FILTER_TAG':
      return { ...state, filterTag: action.payload };
    
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
    
    default:
      return state;
  }
}

export function CRMProvider({ children }) {
  const [state, dispatch] = useReducer(crmReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedContacts = localStorage.getItem('crm-contacts');
    const savedInteractions = localStorage.getItem('crm-interactions');
    
    if (savedContacts) {
      dispatch({ type: 'SET_CONTACTS', payload: JSON.parse(savedContacts) });
    }
    
    if (savedInteractions) {
      dispatch({ type: 'SET_INTERACTIONS', payload: JSON.parse(savedInteractions) });
    }
  }, []);

  // Save to localStorage whenever contacts or interactions change
  useEffect(() => {
    localStorage.setItem('crm-contacts', JSON.stringify(state.contacts));
  }, [state.contacts]);

  useEffect(() => {
    localStorage.setItem('crm-interactions', JSON.stringify(state.interactions));
  }, [state.interactions]);

  // Initialize with sample data if no data exists
  useEffect(() => {
    if (state.contacts.length === 0) {
      const sampleContacts = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@example.com',
          phone: '+1 (555) 123-4567',
          company: 'Tech Corp',
          position: 'Software Engineer',
          tags: ['Work', 'Client'],
          notes: 'Met at tech conference. Interested in our new product.',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          interactionCount: 3,
          avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@example.com',
          phone: '+1 (555) 987-6543',
          company: 'Design Studio',
          position: 'Creative Director',
          tags: ['Work', 'Partner'],
          notes: 'Potential collaboration on upcoming project.',
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          lastContact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          interactionCount: 2,
          avatar: `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face`,
        },
        {
          id: '3',
          name: 'Mike Chen',
          email: 'mike.chen@example.com',
          phone: '+1 (555) 456-7890',
          company: 'Startup Inc',
          position: 'Founder',
          tags: ['Personal', 'Friend'],
          notes: 'College friend who started his own company.',
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          lastContact: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          interactionCount: 1,
          avatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`,
        },
      ];

      const sampleInteractions = [
        {
          id: '1',
          contactId: '1',
          type: 'email',
          subject: 'Product Demo Follow-up',
          notes: 'Sent product demo video and pricing information.',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          contactId: '2',
          type: 'meeting',
          subject: 'Project Collaboration Discussion',
          notes: 'Discussed potential collaboration on Q2 project.',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          contactId: '3',
          type: 'call',
          subject: 'Catch-up Call',
          notes: 'Personal catch-up call about life and business.',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      dispatch({ type: 'SET_CONTACTS', payload: sampleContacts });
      state.interactions = sampleInteractions;
    }
  }, []);

  const value = {
    ...state,
    dispatch,
    addContact: (contact) => dispatch({ type: 'ADD_CONTACT', payload: contact }),
    updateContact: (contact) => dispatch({ type: 'UPDATE_CONTACT', payload: contact }),
    deleteContact: (id) => dispatch({ type: 'DELETE_CONTACT', payload: id }),
    addInteraction: (interaction) => dispatch({ type: 'ADD_INTERACTION', payload: interaction }),
    setSelectedContact: (contact) => dispatch({ type: 'SET_SELECTED_CONTACT', payload: contact }),
    setSearchQuery: (query) => dispatch({ type: 'SET_SEARCH_QUERY', payload: query }),
    setFilterTag: (tag) => dispatch({ type: 'SET_FILTER_TAG', payload: tag }),
    setSortBy: (sortBy) => dispatch({ type: 'SET_SORT_BY', payload: sortBy }),
  };

  return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>;
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
}