
import React from "react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";

interface BudgetHistoryEntry {
  id: string;
  month: string;
  income: number;
  expenses: number;
  savings: number;
  created_at: string;
  total_apple: number;
  total_chase: number;
  total_euro: number;
}

interface BudgetHistoryTableProps {
  historyData: BudgetHistoryEntry[];
  isLoading: boolean;
}

const BudgetHistoryTable = ({ historyData, isLoading }: BudgetHistoryTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading budget history...</div>;
  }

  if (historyData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No budget history available yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>Income</TableHead>
            <TableHead>Expenses</TableHead>
            <TableHead>Savings</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Apple</TableHead>
            <TableHead>Chase</TableHead>
            <TableHead>Euro</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historyData.map((entry) => {
            const balance = entry.income - entry.expenses;
            
            return (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.month}</TableCell>
                <TableCell>{formatCurrency(entry.income)}</TableCell>
                <TableCell className="text-red-600">{formatCurrency(entry.expenses)}</TableCell>
                <TableCell>{formatCurrency(entry.savings)}</TableCell>
                <TableCell className={balance >= 0 ? "text-green-600" : "text-red-600"}>
                  {formatCurrency(balance)}
                </TableCell>
                <TableCell>{formatCurrency(entry.total_apple)}</TableCell>
                <TableCell>{formatCurrency(entry.total_chase)}</TableCell>
                <TableCell>{formatCurrency(entry.total_euro)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default BudgetHistoryTable;
