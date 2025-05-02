import React, { createContext, useState, useContext, useEffect } from 'react';
import { router } from 'expo-router';

interface User {
  id: string;
  email: string;
  name: string;
  preferences?: {
    vegetarian?: boolean;
    vegan?: boolean;
    glutenFree?: boolean;
    dairyFree?: boolean;
  };
}

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, name: string, password: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  updateUserPreferences: (preferences: User['preferences']) => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
  isAuthenticated: false,
  updateUserPreferences: () => {},
});

// Mock user for demo purposes
const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  name: 'John Doe',
  preferences: {
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: true,
  },
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // In a real app, you would check for a token in AsyncStorage
        // const userToken = await AsyncStorage.getItem('userToken');
        
        // For demo, simulate a delay
        setTimeout(() => {
          // For demo, we're not setting user here
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.log('Error checking login status:', error);
        setIsLoading(false);
      }
    };
    
    checkLoginStatus();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Simulate API request delay
      setIsLoading(true);
      
      // In a real app, make an API request to authenticate
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll set the mock user
      setUser(mockUser);
      
      // Navigate to Home screen
      router.replace('/(tabs)');
    } catch (error) {
      console.log('Error signing in:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, name: string, password: string) => {
    try {
      // Simulate API request delay
      setIsLoading(true);
      
      // In a real app, make an API request to register
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new user based on input
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        preferences: {},
      };
      
      setUser(newUser);
      
      // Navigate to Home screen
      router.replace('/(tabs)');
    } catch (error) {
      console.log('Error signing up:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    // Clear user data
    setUser(null);
    
    // In a real app, remove token from AsyncStorage
    // AsyncStorage.removeItem('userToken');
    
    // Navigate to Welcome screen
    router.replace('/welcome');
  };

  const updateUserPreferences = (preferences: User['preferences']) => {
    if (user) {
      setUser({ ...user, preferences: { ...user.preferences, ...preferences } });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user,
        updateUserPreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);