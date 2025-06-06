import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
  register: (username: string, email: string, password: string) => void;
}

// Mock users for demo purposes
const mockUsers = [
  {
    id: 'user1',
    username: 'demo',
    email: 'demo@example.com',
    password: 'password123'
  }
];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  login: (username, password) => {
    // Simulate API call
    const user = mockUsers.find(u => 
      (u.username === username || u.email === username) && u.password === password
    );
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      set({ 
        user: userWithoutPassword as User, 
        isAuthenticated: true 
      });
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('user');
  },
  
  register: (username, email, password) => {
    // Check if user already exists
    const userExists = mockUsers.some(u => u.username === username || u.email === email);
    
    if (!userExists) {
      const newUser = {
        id: `user${mockUsers.length + 1}`,
        username,
        email,
        password
      };
      
      mockUsers.push(newUser);
      
      const { password: _, ...userWithoutPassword } = newUser;
      set({ 
        user: userWithoutPassword as User, 
        isAuthenticated: true 
      });
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  }
}));