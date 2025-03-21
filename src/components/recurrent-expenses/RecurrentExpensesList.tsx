import React, { useMemo, useState, useEffect } from "react";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RecurrentExpense } from "./RecurrentExpensesPage";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface RecurrentExpensesListProps {
  expenses: RecurrentExpense[];
  searchQuery: string;
  bankFilter: string;
  hideSavings: boolean;
  onEdit: (expense: RecurrentExpense) => void;
  onDelete: (id: string) => void;
}

const ITEMS_PER_PAGE = 10;

export const RecurrentExpensesList = ({
  expenses,
  searchQuery,
  bankFilter,
  hideSavings,
  onEdit,
  onDelete,
}: RecurrentExpensesListProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredExpenses = useMemo(() => {
    let filtered = expenses;
    
    if (bankFilter !== "all") {
      filtered = filtered.filter(expense => 
        expense.bank_account === bankFilter
      );
    }
    
    if (hideSavings) {
      filtered = filtered.filter(expense => expense.category.toLowerCase() !== "savings");
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(expense => 
        expense.name.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query) ||
        String(expense.amount).includes(query) ||
        (expense.bank_account && expense.bank_account.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [expenses, searchQuery, bankFilter, hideSavings]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, bankFilter, hideSavings]);

  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
  
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-4 pb-24">
      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="hidden sm:table-cell">Bank</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                  No matching recurring expenses found
                </TableCell>
              </TableRow>
            ) : (
              paginatedExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="py-2 sm:py-4 font-medium">{expense.name}</TableCell>
                  <TableCell className="hidden sm:table-cell py-2 sm:py-4">{expense.category}</TableCell>
                  <TableCell className="py-2 sm:py-4 text-red-600">
                    {parseFloat(expense.amount.toString()).toFixed(2)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell py-2 sm:py-4">
                    {expense.bank_account || "Betterment"}
                  </TableCell>
                  <TableCell className="text-right py-2 sm:py-4">
                    <div className="flex justify-end gap-1">
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
                        onClick={() => onDelete(expense.id)}
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
      </div>

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
