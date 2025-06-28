import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { format } from 'date-fns';

const CRMContext = createContext();

const initialState = {
  contacts: [],
  interactions: [],
  tags: ['งาน', 'ส่วนตัว', 'ครอบครัว', 'เพื่อน', 'ลูกค้า', 'โอกาส', 'พันธมิตร'],
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
          contact.id === action.payload.id 
            ? { ...contact, ...action.payload }
            : contact
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

  // โหลดข้อมูลจาก localStorage เมื่อเริ่มต้น
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

  // บันทึกลง localStorage เมื่อข้อมูลเปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem('crm-contacts', JSON.stringify(state.contacts));
  }, [state.contacts]);

  useEffect(() => {
    localStorage.setItem('crm-interactions', JSON.stringify(state.interactions));
  }, [state.interactions]);

  // เริ่มต้นด้วยข้อมูลตัวอย่างถ้ายังไม่มีข้อมูล
  useEffect(() => {
    if (state.contacts.length === 0) {
      const sampleContacts = [
        {
          id: '1',
          name: 'สมชาย ใจดี',
          email: 'somchai@example.com',
          phone: '081-234-5678',
          company: 'เทค คอร์ป',
          position: 'วิศวกรซอฟต์แวร์',
          tags: ['งาน', 'ลูกค้า'],
          notes: 'พบกันที่งานประชุมเทคโนโลยี สนใจผลิตภัณฑ์ใหม่ของเรา',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          interactionCount: 3,
          avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
        },
        {
          id: '2',
          name: 'สุดา จันทร์งาม',
          email: 'suda@example.com',
          phone: '082-345-6789',
          company: 'ดีไซน์ สตูดิโอ',
          position: 'ผู้อำนวยการฝ่ายสร้างสรรค์',
          tags: ['งาน', 'พันธมิตร'],
          notes: 'โอกาสความร่วมมือในโครงการที่จะมาถึง',
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          lastContact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          interactionCount: 2,
          avatar: `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face`,
        },
        {
          id: '3',
          name: 'มานิต วิทยา',
          email: 'manit@example.com',
          phone: '083-456-7890',
          company: 'สตาร์ทอัพ อิงค์',
          position: 'ผู้ก่อตั้ง',
          tags: ['ส่วนตัว', 'เพื่อน'],
          notes: 'เพื่อนมหาลัยที่เริ่มต้นบริษัทของตัวเอง',
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
          subject: 'ติดตามการสาธิตผลิตภัณฑ์',
          notes: 'ส่งวิดีโอสาธิตผลิตภัณฑ์และข้อมูลราคา',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          contactId: '2',
          type: 'meeting',
          subject: 'หารือความร่วมมือในโครงการ',
          notes: 'หารือโอกาสความร่วมมือในโครงการไตรมาส 2',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          contactId: '3',
          type: 'call',
          subject: 'โทรทักทาย',
          notes: 'คุยทักทายเรื่องส่วนตัวและธุรกิจ',
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