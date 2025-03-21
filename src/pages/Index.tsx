
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import NumPad from '../components/NumPad';
import PasswordInput from '../components/PasswordInput';
import { validatePassword, setAuthenticated, isAuthenticated } from '../utils/authUtils';

const MAX_PASSWORD_LENGTH = 4;

const Index = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isAuthenticated()) {
          console.log('User is authenticated, redirecting to dashboard');
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Error checking authentication status:', err);
      } finally {
        setLoading(false);
      }
    };
    
    // Animation sequence for content appearance
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 300);
    
    checkAuth();
    
    return () => clearTimeout(contentTimer);
  }, [navigate]);

  const handleKeyPress = (value: string) => {
    if (password.length < MAX_PASSWORD_LENGTH) {
      setPassword(prev => prev + value);
      setError('');
    }
  };

  const handleDelete = () => {
    setPassword(prev => prev.slice(0, -1));
    setError('');
  };

  const handleSubmit = async () => {
    if (password.length < MAX_PASSWORD_LENGTH) {
      setError(`Please enter ${MAX_PASSWORD_LENGTH} digits`);
      return;
    }

    setLoading(true);
    try {
      const isValid = await validatePassword(password);
      
      if (isValid) {
        // Success animation and redirect
        toast.success('Access granted');
        setAuthenticated(true);
        navigate('/dashboard');
      } else {
        // Error animation
        toast.error('Incorrect password');
        setError('Incorrect password. Please try again.');
        setPassword('');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Something went wrong. Please try again.');
      setError('Error validating password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className={`w-full max-w-md bg-white rounded-3xl shadow-lg p-8 transition-all duration-500 ease-out ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex flex-col items-center">
          <div className="mt-8 mb-4 text-center">
            <h1 className="text-2xl font-semibold text-budget-text animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Welcome Back
            </h1>
            <p className="text-gray-500 mt-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              Enter your password to continue
            </p>
          </div>
          
          <PasswordInput value={password} maxLength={MAX_PASSWORD_LENGTH} />
          
          {error && (
            <p className="text-destructive text-sm mb-4 animate-fade-in">
              {error}
            </p>
          )}
          
          <NumPad
            onKeyPress={handleKeyPress}
            onDelete={handleDelete}
            onSubmit={handleSubmit}
            isSubmitDisabled={password.length < MAX_PASSWORD_LENGTH || loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
