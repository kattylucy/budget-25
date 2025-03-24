
import React, { useState } from "react";
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
import { useDeleteExpense } from "@/queries/useDeleteExpenses";
import { useDeleteSavings } from "@/queries/useDeleteSavings";
import { ExpensesListProps } from "@/types/expenses";

const ITEMS_PER_PAGE = 10;

const ExpensesList = ({ 
  expenses, 
  isLoading, 
  onEdit, 
}: ExpensesListProps) => {
  const { mutateAsync } = useDeleteExpense()
  const { mutateAsync: mutate } = useDeleteSavings()

  const {
    searchQuery,
    setSearchQuery,
    bankFilter,
    setBankFilter,
    bankAccounts,
    filteredExpenses
  } = useExpensesFiltering();

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
  
  const currentItems = filteredExpenses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, bankFilter]);

  const deleteExpense = async (id: string, category: string) => {
    mutateAsync(id)
    mutate(id)
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
        bankAccounts={bankAccounts}
      />
      
      <ExpensesTable
        expenses={currentItems}
        onEdit={onEdit}
        onDelete={deleteExpense}
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
