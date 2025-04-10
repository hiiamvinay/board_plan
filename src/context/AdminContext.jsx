
import React, { createContext, useState, useContext, useEffect } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [adminId, setAdminId] = useState(() => {
    return localStorage.getItem('adminId') || null;
  });

  useEffect(() => {
    if (adminId) {
      localStorage.setItem('adminId', adminId);
    } else {
      localStorage.removeItem('adminId');
    }
  }, [adminId]);

  return (
    <AdminContext.Provider value={{ adminId, setAdminId }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};