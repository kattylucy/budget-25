
import React, { useMemo, useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SelectableExpense, SelectableRecurrentExpense } from "./CalculationsPage";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {  RefreshCw } from "lucide-react";

interface ExpensesListProps {
  expenses: (SelectableExpense | SelectableRecurrentExpense | any)[];
  isLoading: boolean;
  onToggleSelect: (id: string, isSelected: boolean, isRecurrent?: boolean) => void;
  showCheckboxes: boolean;
  isRecurring?: boolean;
  onCalculate?: () => void;
}

const ITEMS_PER_PAGE = 10;

export const ExpensesList = ({
  expenses,
  isLoading,
  onToggleSelect,
  showCheckboxes,
  isRecurring = false,
  onCalculate,
}: ExpensesListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const handleCheckboxChange = (id: string, checked: boolean, isRecurrent: boolean = false) => {
    onToggleSelect(id, checked, isRecurrent);
  };

  // Reset to page 1 when expenses list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [expenses.length]);

  // Calculate total pages
  const totalPages = Math.ceil(expenses.length / ITEMS_PER_PAGE);
  
  // Get current page items
  const currentItems = expenses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-4 pb-24">
      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              {showCheckboxes && <TableHead className="w-12"></TableHead>}
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead>Amount</TableHead>
              {!isRecurring && <TableHead className="hidden sm:table-cell">Date</TableHead>}
              <TableHead className="hidden sm:table-cell">Bank Account</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={showCheckboxes ? 7 : 6} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center">
                    <RefreshCw className="h-10 w-10 text-gray-400 animate-spin mb-2" />
                    <span>Loading expenses...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showCheckboxes ? 7 : 6} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-gray-500 mb-2">No expenses found</span>
                    {onCalculate && (
                      <Button
                        variant="outline" 
                        size="sm"
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-1"
                      >
                        <RefreshCw className="h-4 w-4" /> Refresh
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((expense) => (
                <TableRow key={expense.id}>
                  {showCheckboxes && (
                    <TableCell className="py-2 sm:py-4">
                      <Checkbox
                        checked={expense.isSelected}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange(expense.id, checked === true, expense.isRecurring)
                        }
                      />
                    </TableCell>
                  )}
                  <TableCell className="py-2 sm:py-4 font-medium">{expense.name}</TableCell>
                  <TableCell className="hidden sm:table-cell py-2 sm:py-4">{expense.category}</TableCell>
                  <TableCell className="py-2 sm:py-4">
                    {parseFloat(expense.amount.toString()).toFixed(2)}
                  </TableCell>
                  {!isRecurring && (
                    <TableCell className="hidden sm:table-cell py-2 sm:py-4">
                      {'date' in expense && expense.date 
                        ? new Date(expense.date).toLocaleDateString() 
                        : "-"}
                    </TableCell>
                  )}
                  <TableCell className="hidden sm:table-cell py-2 sm:py-4">{expense.bank_account || "Apple"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        {totalPages > 1 && !isLoading && (
          <Pagination className="mt-4 mx-auto">
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
                }
                
                // Add ellipsis for page gaps
                if (
                  (pageNumber === 2 && currentPage > 3) || 
                  (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                ) {
                  return <PaginationEllipsis key={pageNumber} />;
                }
                
                return null;
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
    </div>
  );
};
