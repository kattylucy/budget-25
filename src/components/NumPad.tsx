
import React from 'react';

interface NumPadProps {
  onKeyPress: (value: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  isSubmitDisabled: boolean;
}

const NumPad: React.FC<NumPadProps> = ({ 
  onKeyPress, 
  onDelete, 
  onSubmit,
  isSubmitDisabled
}) => {
  // Keys layout: 1-9, then 0, delete, and submit
  const keys = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    'delete', '0', 'submit'
  ];

  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-xs mx-auto animate-fade-in">
      {keys.map((key) => {
        if (key === 'delete') {
          return (
            <button
              key={key}
              onClick={onDelete}
              className="numpad-key bg-gray-50 text-gray-700"
              aria-label="Delete"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
                <path d="M15 9l-6 6M9 9l6 6" />
              </svg>
            </button>
          );
        }
        
        if (key === 'submit') {
          return (
            <button
              key={key}
              onClick={onSubmit}
              disabled={isSubmitDisabled}
              className={`numpad-key ${
                isSubmitDisabled 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-black text-white hover:bg-black/80'
              }`}
              aria-label="Submit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          );
        }
        
        return (
          <button
            key={key}
            onClick={() => onKeyPress(key)}
            className="numpad-key"
          >
            {key}
          </button>
        );
      })}
    </div>
  );
};

export default NumPad;
