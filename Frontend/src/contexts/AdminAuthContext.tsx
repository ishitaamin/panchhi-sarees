// src/contexts/AdminAuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import {API_URL} from '../config/env'

interface Admin {
  id: string;
  username: string;
  email: string;
  token: string;
}

interface AdminAuthContextType {
  admin: Admin | null;
  isAdminAuthenticated: boolean;
  loginAdmin: (credentials: { username: string; password: string }) => Promise<boolean>;
  registerAdmin: (adminData: { username: string; email: string; password: string; otp: string }) => Promise<boolean>;
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
    const stored = localStorage.getItem('adminUser');
    if (stored) setAdmin(JSON.parse(stored));
  }, []);

  const loginAdmin = async (credentials: { username: string; password: string }): Promise<boolean> => {
    try {
      const { data } = await axios.post(`${API_URL}/api/admin/login`, credentials);
      localStorage.setItem('adminUser', JSON.stringify(data));
      setAdmin(data);
      return true;
    } catch (err) {
      return false;
    }
  };

  const registerAdmin = async ({
    username,
    email,
    password,
    otp
  }: {
    username: string;
    email: string;
    password: string;
    otp: string;
  }): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_URL}/api/admin/verify-otp`, {
        username,
        email,
        password,
        otp,
      });

      return response.data?.success || false;
    } catch (error) {
      console.error("OTP verification failed", error);
      return false;
    }
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem('adminUser');
  };

  return (
    <AdminAuthContext.Provider value={{ admin, isAdminAuthenticated: !!admin, loginAdmin, registerAdmin, logoutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};