
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";
import { Income } from "./ExpenseDialog";
import IncomeEntryForm from "../income/IncomeEntryForm";
import IncomeEntryList from "../income/IncomeEntryList";
import { useIncomeEntries } from "../income/useIncomeEntries";

interface IncomeSectionProps {
  income: Income | null;
  onIncomeChange: () => void;
}

const IncomeSection = ({ income, onIncomeChange }: IncomeSectionProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  const { 
    incomeEntries, 
    isLoading,
    hasError,
    addIncomeEntry, 
    deleteIncomeEntry,
    refreshEntries
  } = useIncomeEntries(onIncomeChange);

  const handleSaveIncome = async (entry) => {
    const success = await addIncomeEntry(entry);
    if (success) {
      setShowAddForm(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Income</h2>
        <div className="flex gap-2">
          {hasError && (
            <Button 
              variant="outline" 
              onClick={refreshEntries}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add Income
          </Button>
        </div>
      </div>

      {showAddForm && (
        <IncomeEntryForm 
          onSave={handleSaveIncome}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <div className="space-y-3">
        {hasError ? (
          <div className="text-center py-4">
            <p className="text-red-500">There was a problem loading your income data.</p>
            <p className="text-gray-500 text-sm mt-1">We're automatically retrying...</p>
          </div>
        ) : (
          <IncomeEntryList 
            entries={incomeEntries}
            onDelete={deleteIncomeEntry}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default IncomeSection;
