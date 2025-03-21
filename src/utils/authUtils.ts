
import { supabase } from "../integrations/supabase/client";

// Function to validate password against database
export const validatePassword = async (password: string, name: string = 'katty'): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('budget')
      .select('password')
      .eq('name', name)
      .single();
    
    if (error) {
      console.error('Error validating password:', error);
      return false;
    }
    
    return data?.password === password;
  } catch (err) {
    console.error('Unexpected error during password validation:', err);
    return false;
  }
};

// Function to safely store the authenticated state
export const setAuthenticated = (value: boolean): void => {
  try {
    localStorage.setItem('isAuthenticated', String(value));
    console.log('Authentication state set to:', value);
  } catch (error) {
    console.error('Error setting authentication state:', error);
  }
};

// Function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  try {
    const authState = localStorage.getItem('isAuthenticated');
    return authState === 'true';
  } catch (error) {
    console.error('Error checking authentication state:', error);
    return false;
  }
};

// Function to clear the authentication state
export const clearAuthentication = (): void => {
  try {
    localStorage.removeItem('isAuthenticated');
    console.log('Authentication state cleared');
  } catch (error) {
    console.error('Error clearing authentication state:', error);
  }
};
