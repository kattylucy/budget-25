
import React from "react";
import IncomeEntry, { IncomeEntryType } from "./IncomeEntry";

interface IncomeEntryListProps {
  entries: IncomeEntryType[];
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const IncomeEntryList = ({ entries, onDelete, isLoading = false }: IncomeEntryListProps) => {
  if (isLoading) {
    return (
      <div className="py-4">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return <p className="text-center py-4 text-gray-500">No income entries yet.</p>;
  }

  return (
    <div>
      <ul className="divide-y divide-gray-100">
        {entries.map((entry) => (
          <IncomeEntry 
            key={entry.id} 
            entry={entry} 
            onDelete={onDelete} 
          />
        ))}
      </ul>
    </div>
  );
};

export default IncomeEntryList;
