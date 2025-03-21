
import React from 'react';

interface PasswordInputProps {
  value: string;
  maxLength: number;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ value, maxLength }) => {
  // Convert the password to an array of boolean values (filled or empty)
  const dots = Array(maxLength).fill(false).map((_, i) => i < value.length);

  return (
    <div className="flex justify-center items-center my-6 animate-fade-in">
      {dots.map((filled, index) => (
        <div 
          key={index} 
          className={`dot-indicator ${filled ? 'filled' : 'empty'}`}
          style={{ animationDelay: filled ? `${index * 0.1}s` : '0s' }}
        />
      ))}
    </div>
  );
};

export default PasswordInput;
