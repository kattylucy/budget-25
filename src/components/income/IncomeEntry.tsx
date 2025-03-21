
import React from "react";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface IncomeEntryType {
  id: string;
  amount: number;
  category: string;
  tag: string;
  currency?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

interface IncomeEntryProps {
  entry: IncomeEntryType;
  onDelete: (id: string) => void;
}

const IncomeEntry = ({ entry, onDelete }: IncomeEntryProps) => {
  return (
    <li className="py-3">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">{entry.category}</p>
          {entry.tag && <p className="text-sm text-gray-500">{entry.tag}</p>}
        </div>
        <div className="flex items-center">
          <span className="text-green-600 font-semibold mr-3">
            ${entry.amount.toFixed(2)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(entry.id)}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </li>
  );
};

export default IncomeEntry;
