
import { useState } from "react";
import { Pencil, Trash, MessageSquare, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Expense } from "./ExpenseDialog";
import NotesDialog from "./NotesDialog";
import { useUpdateExpense } from "@/queries/updateExpenses";

interface ExpensesTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string, category: string) => void;
}

const ExpensesTable = ({ expenses, onEdit, onDelete }: ExpensesTableProps) => {
  const { mutate } = useUpdateExpense();

  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const handleOpenNotesDialog = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsNotesDialogOpen(true);
  };

  const handlePaid = (expense: Expense) => {
    const updateParams = {
      is_paid: !expense.is_paid,
    };

    mutate({ id: expense.id, updateData: updateParams });
  };

  return (
    <div className="overflow-x-auto -mx-2 sm:mx-0">
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden sm:table-cell">Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="hidden sm:table-cell">Date</TableHead>
            <TableHead className="hidden sm:table-cell">Bank</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                No expenses found
              </TableCell>
            </TableRow>
          ) : (
            expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="py-2 sm:py-4 font-medium">{expense.name}</TableCell>
                <TableCell className="hidden sm:table-cell py-2 sm:py-4">{expense.category}</TableCell>
                <TableCell className="py-2 sm:py-4 text-red-600">
                  {parseFloat(expense.amount.toString()).toFixed(2)}
                </TableCell>
                <TableCell className="hidden sm:table-cell py-2 sm:py-4">
                  {new Date(expense.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="hidden sm:table-cell py-2 sm:py-4">
                  {expense.bank_account || "EUR"}
                </TableCell>
                <TableCell className="text-right py-2 sm:py-4">
                  <div className="flex justify-end gap-1">
                  <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePaid(expense)}
                      className={expense.is_paid ? "text-green-500" : "text-black-500"}
                    >
                      <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenNotesDialog(expense)}
                    >
                      <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(expense)}
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                    >
                      <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(expense.id, expense.category)}
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {selectedExpense && (
        <NotesDialog
          isOpen={isNotesDialogOpen}
          onOpenChange={setIsNotesDialogOpen}
          expenseId={selectedExpense.id}
          expenseName={selectedExpense.name}
          initialNote={selectedExpense.notes || ""}
        />
      )}
    </div>
  );
};

export default ExpensesTable;
