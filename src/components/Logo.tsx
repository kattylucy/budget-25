
import React from 'react';
import { LineChart } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2 animate-scale-in">
      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
        <LineChart className="text-white" size={22} />
      </div>
      <div className="text-xl font-bold text-foreground">Budget<span className="text-primary">Wise</span></div>
    </div>
  );
};

export default Logo;
