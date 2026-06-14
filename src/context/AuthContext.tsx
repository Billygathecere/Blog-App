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

  // Verify and load cached user sessions on initial app mount
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
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    } catch (e) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  }, []);

  /**
   * Performs real login verification requests to our Express server backend database.
   */
  const loginUser = async (email: string, passwordString: string): Promise<User> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password: passwordString,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Invalid credentials or incorrect passcode.');
    }

    const userProfile: User = await response.json();

    setAuthState({
      isAuthenticated: true,
      user: userProfile,
      isLoading: false,
    });

    localStorage.setItem('chronicle_current_user', JSON.stringify(userProfile));
    return userProfile;
  };

  /**
   * Registers a brand new user profile stored inside our backend database.
   */
  const registerUser = async (name: string, email: string, passwordString: string): Promise<User> => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password: passwordString,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to complete registration account creation.');
    }

    const userProfile: User = await response.json();

    setAuthState({
      isAuthenticated: true,
      user: userProfile,
      isLoading: false,
    });

    localStorage.setItem('chronicle_current_user', JSON.stringify(userProfile));
    return userProfile;
  };

  /**
   * Cleans up local session flags to safely sign off of Chronicle.
   */
  const logoutUser = async (): Promise<void> => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
    localStorage.removeItem('chronicle_current_user');
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
