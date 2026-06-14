import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  loginUser: (email: string, passwordString: string) => Promise<User>;
  registerUser: (name: string, email: string, passwordString: string) => Promise<User>;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  // Load persistent user index and session log on mount
  useEffect(() => {
    try {
      const activeUserJson = localStorage.getItem('chronicle_current_user');
      if (activeUserJson) {
        setAuthState({
          isAuthenticated: true,
          user: JSON.parse(activeUserJson),
          isLoading: false,
        });
      } else {
        // Automatically pre-populate our demo user for a polished first run experience
        const defaultUser: User = {
          id: 'usr_main_demo',
          name: 'Aesthetic Designer',
          email: 'designer@chronicle.com',
          createdAt: new Date().toISOString(),
        };
        // Persist default demo user to our client DB if it doesn't already exist
        const storedUsers = localStorage.getItem('chronicle_users');
        const users = storedUsers ? JSON.parse(storedUsers) : [];
        if (!users.some((u: any) => u.email === defaultUser.email)) {
          users.push({ ...defaultUser, passwordHash: 'demo123' });
          localStorage.setItem('chronicle_users', JSON.stringify(users));
        }

        // We set isAuthenticated to true for the demo user initially so the reader can play with deleting/editing on load
        setAuthState({
          isAuthenticated: true,
          user: defaultUser,
          isLoading: false,
        });
        localStorage.setItem('chronicle_current_user', JSON.stringify(defaultUser));
      }
    } catch (e) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  }, []);

  const loginUser = async (email: string, passwordString: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const storedUsers = localStorage.getItem('chronicle_users');
          const users = storedUsers ? JSON.parse(storedUsers) : [];
          
          const matched = users.find(
            (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === passwordString
          );

          if (!matched) {
            reject(new Error('Invalid email credentials or incorrect passcode.'));
            return;
          }

          const userProfile: User = {
            id: matched.id,
            email: matched.email,
            name: matched.name,
            createdAt: matched.createdAt,
          };

          setAuthState({
            isAuthenticated: true,
            user: userProfile,
            isLoading: false,
          });

          localStorage.setItem('chronicle_current_user', JSON.stringify(userProfile));
          resolve(userProfile);
        } catch (err) {
          reject(new Error('Authentication system failed. Please clear cookie stores.'));
        }
      }, 500);
    });
  };

  const registerUser = async (name: string, email: string, passwordString: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const storedUsers = localStorage.getItem('chronicle_users');
          const users = storedUsers ? JSON.parse(storedUsers) : [];

          const exists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
          if (exists) {
            reject(new Error('This email address has already been registered in our database.'));
            return;
          }

          const newUserRecord = {
            id: `usr_${Math.random().toString(36).substr(2, 9)}`,
            name,
            email,
            passwordHash: passwordString,
            createdAt: new Date().toISOString(),
          };

          users.push(newUserRecord);
          localStorage.setItem('chronicle_users', JSON.stringify(users));

          const userProfile: User = {
            id: newUserRecord.id,
            email: newUserRecord.email,
            name: newUserRecord.name,
            createdAt: newUserRecord.createdAt,
          };

          setAuthState({
            isAuthenticated: true,
            user: userProfile,
            isLoading: false,
          });

          localStorage.setItem('chronicle_current_user', JSON.stringify(userProfile));
          resolve(userProfile);
        } catch (err) {
          reject(new Error('Sign up database write error occurred.'));
        }
      }, 500);
    });
  };

  const logoutUser = async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
        localStorage.removeItem('chronicle_current_user');
        resolve();
      }, 200);
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, loginUser, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be called inside an AuthProvider component');
  }
  return context;
};

