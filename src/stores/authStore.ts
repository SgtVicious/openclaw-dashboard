import { useState, useEffect, useCallback } from 'react';
import type { User } from '@/types';

// Global auth state
let globalUser: User | null = null;
let globalToken: string | null = null;
let globalIsAuthenticated = false;

// Event emitter for state changes
const listeners = new Set<() => void>();

const emitChange = () => {
  listeners.forEach(listener => listener());
};

export function useAuthStore() {
  const [, setTick] = useState(0);
  
  // Subscribe to changes
  useEffect(() => {
    const listener = () => setTick(t => t + 1);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);
  
  const login = useCallback(async (username: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser: User = {
      id: '1',
      username: username,
      role: 'admin',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isActive: true,
    };
    
    globalUser = mockUser;
    globalToken = 'mock-jwt-token';
    globalIsAuthenticated = true;
    
    emitChange();
    return true;
  }, []);

  const logout = useCallback(() => {
    globalUser = null;
    globalToken = null;
    globalIsAuthenticated = false;
    emitChange();
  }, []);

  return {
    user: globalUser,
    token: globalToken,
    isAuthenticated: globalIsAuthenticated,
    isLoading: false,
    login,
    logout,
  };
}
