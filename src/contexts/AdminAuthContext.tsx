
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Admin {
  id: string;
  username: string;
  email: string;
}

interface AdminAuthContextType {
  admin: Admin | null;
  isAdminAuthenticated: boolean;
  loginAdmin: (credentials: { username: string; password: string }) => Promise<boolean>;
  registerAdmin: (adminData: { username: string; email: string; password: string }) => Promise<boolean>;
  logoutAdmin: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return context;
};

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('adminUser');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const loginAdmin = async (credentials: { username: string; password: string }): Promise<boolean> => {
    // Mock admin login - in real app, this would call your backend
    const mockAdmins = JSON.parse(localStorage.getItem('registeredAdmins') || '[]');
    const foundAdmin = mockAdmins.find((a: any) => 
      a.username === credentials.username && a.password === credentials.password
    );

    if (foundAdmin) {
      const adminData = { id: foundAdmin.id, username: foundAdmin.username, email: foundAdmin.email };
      setAdmin(adminData);
      localStorage.setItem('adminUser', JSON.stringify(adminData));
      return true;
    }
    return false;
  };

  const registerAdmin = async (adminData: { username: string; email: string; password: string }): Promise<boolean> => {
    try {
      const existingAdmins = JSON.parse(localStorage.getItem('registeredAdmins') || '[]');
      const newAdmin = {
        id: Date.now().toString(),
        ...adminData
      };
      existingAdmins.push(newAdmin);
      localStorage.setItem('registeredAdmins', JSON.stringify(existingAdmins));
      return true;
    } catch {
      return false;
    }
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem('adminUser');
  };

  return (
    <AdminAuthContext.Provider value={{ 
      admin, 
      isAdminAuthenticated: !!admin, 
      loginAdmin, 
      registerAdmin, 
      logoutAdmin 
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
