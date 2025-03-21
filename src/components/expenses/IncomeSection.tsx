
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle} from "lucide-react";
import IncomeEntryForm from "../income/IncomeEntryForm";
import IncomeEntryList from "../income/IncomeEntryList";
import { useFetchIncome } from "@/queries/useFetchIncome";
import { useAddIncome } from "@/queries/useAddIncome";

const IncomeSection = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { data: incomeEntries, error, isLoading } = useFetchIncome()
  const { mutateAsync } = useAddIncome();

  const handleSaveIncome = async (entry) => {
    const success = await mutateAsync(entry);
    if (success) {
      setShowAddForm(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Income</h2>
        <div className="flex gap-2">
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
        {error ? (
          <div className="text-center py-4">
            <p className="text-red-500">There was a problem loading your income data.</p>
            <p className="text-gray-500 text-sm mt-1">We're automatically retrying...</p>
          </div>
        ) : (
          <IncomeEntryList 
            entries={incomeEntries}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default IncomeSection;
