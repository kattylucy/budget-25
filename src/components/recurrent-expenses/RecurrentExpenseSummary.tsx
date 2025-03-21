
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecurrentExpenseSummaryProps {
  totalMonthlyExpenses: number;
  onAddClick: () => void;
}

export const RecurrentExpenseSummary = ({
  totalMonthlyExpenses,
  onAddClick,
}: RecurrentExpenseSummaryProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="text-right mr-4">
        <div className="text-sm text-gray-500">Total Monthly</div>
        <div className="font-semibold text-red-600">
          ${totalMonthlyExpenses.toFixed(2)}
        </div>
      </div>
      <Button onClick={onAddClick} className="whitespace-nowrap">
        <Plus className="h-4 w-4 mr-2" />
        Add Recurring
      </Button>
    </div>
  );
};
