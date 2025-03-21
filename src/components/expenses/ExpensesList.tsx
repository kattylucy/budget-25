
import React, { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Expense } from "./ExpenseDialog";
import FilterPanel from "./FilterPanel";
import ExpensesTable from "./ExpensesTable";
import { useExpensesFiltering } from "./useExpensesFiltering";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ExpensesListProps {
  expenses: Expense[];
  isLoading: boolean;
  onEdit: (expense: Expense) => void;
  onDataChange: () => void;
}

const ITEMS_PER_PAGE = 10;

const ExpensesList = ({ 
  expenses, 
  isLoading, 
  onEdit, 
  onDataChange 
}: ExpensesListProps) => {
  const {
    searchQuery,
    setSearchQuery,
    bankFilter,
    setBankFilter,
    hideSavings,
    setHideSavings,
    bankAccounts,
    filteredExpenses
  } = useExpensesFiltering(expenses);

  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
  
  // Get current page items
  const currentItems = filteredExpenses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, bankFilter, hideSavings]);

  const deleteExpense = async (id: string, category: string) => {
    try {
      // Delete from expenses table
      const { error: expenseError } = await supabase
        .from("expenses")
        .delete()
        .eq("id", id);

      if (expenseError) throw expenseError;
      
      // If this is a savings expense, also delete from the savings table
      if (category === "Savings") {
        const { error: savingsError } = await supabase
          .from("savings")
          .delete()
          .eq("id", id);

        if (savingsError) {
          console.error("Error deleting savings record:", savingsError);
          // Continue even if there's an error with savings deletion
          // At least the expense was deleted
        }
      }
      
      toast.success("Expense deleted successfully");
      onDataChange();
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense. Please try again.");
    }
  };

  if (isLoading) {
    return <p className="text-center py-4">Loading expenses...</p>;
  }

  if (expenses.length === 0) {
    return <p className="text-center py-4 text-gray-500">No expenses recorded yet.</p>;
  }

  return (
    <div className="pb-24">
      <FilterPanel
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        bankFilter={bankFilter}
        setBankFilter={setBankFilter}
        hideSavings={hideSavings}
        setHideSavings={setHideSavings}
        bankAccounts={bankAccounts}
      />
      
      <ExpensesTable
        expenses={currentItems}
        onEdit={onEdit}
        onDelete={deleteExpense}
        onDataChange={onDataChange}
      />

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            {currentPage > 1 ? (
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(prev => Math.max(prev - 1, 1));
                  }} 
                />
              </PaginationItem>
            ) : (
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => e.preventDefault()} 
                  className="opacity-50 pointer-events-none" 
                />
              </PaginationItem>
            )}

            {[...Array(totalPages)].map((_, i) => {
              const pageNumber = i + 1;
              
              // Display first page, current page, and last page
              // Use ellipsis for others when there are many pages
              if (
                pageNumber === 1 || 
                pageNumber === totalPages || 
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink 
                      href="#" 
                      isActive={pageNumber === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (
                (pageNumber === 2 && currentPage > 3) || 
                (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
              ) {
                return <PaginationEllipsis key={pageNumber} />;
              } else {
                return null;
              }
            })}

            {currentPage < totalPages ? (
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                  }} 
                />
              </PaginationItem>
            ) : (
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => e.preventDefault()} 
                  className="opacity-50 pointer-events-none" 
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ExpensesList;
