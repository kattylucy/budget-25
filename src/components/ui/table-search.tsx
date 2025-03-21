
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TableSearchProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const TableSearch = ({
  placeholder = "Search...",
  value,
  onChange,
  className,
}: TableSearchProps) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 w-full max-w-xs"
      />
    </div>
  );
};

export default TableSearch;
