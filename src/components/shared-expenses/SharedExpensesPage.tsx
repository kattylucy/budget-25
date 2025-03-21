
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface SharedExpense {
  id: string;
  name: string;
  amount: number;
}

const ITEMS_PER_PAGE = 10;

const SharedExpensesPage = () => {
  const [sharedExpenses, setSharedExpenses] = useState<SharedExpense[]>([]);
  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch shared expenses from Supabase
  const fetchSharedExpenses = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("shared_expenses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching shared expenses:", error);
        toast.error("Failed to load shared expenses");
        return;
      }

      setSharedExpenses(data || []);
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedExpenses();
  }, []);

  const handleAddExpense = async () => {
    if (!newExpenseName.trim()) {
      toast.error("Please enter a name for the expense");
      return;
    }

    const amount = parseFloat(newExpenseAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("shared_expenses")
        .insert({
          name: newExpenseName.trim(),
          amount: amount,
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding shared expense:", error);
        toast.error("Failed to add expense");
        return;
      }

      setSharedExpenses([data, ...sharedExpenses]);
      setNewExpenseName("");
      setNewExpenseAmount("");
      toast.success("Expense added successfully");
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong");
    }
  };

  const handleClearExpenses = async () => {
    try {
      const { error } = await supabase
        .from("shared_expenses")
        .delete()
        .not("id", "is", null); // Delete all entries

      if (error) {
        console.error("Error clearing shared expenses:", error);
        toast.error("Failed to clear expenses");
        return;
      }

      setSharedExpenses([]);
      toast.success("Shared expenses cleared");
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong");
    }
  };

  // Filter expenses based on the search query
  const filteredExpenses = sharedExpenses.filter(expense => 
    expense.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.amount.toString().includes(searchQuery)
  );

  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
  
  // Get current page items
  const currentItems = filteredExpenses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shared Expenses</CardTitle>
          <CardDescription>
            Track expenses that need to be split with others
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <Label htmlFor="expense-name">Expense Name</Label>
                <Input
                  id="expense-name"
                  value={newExpenseName}
                  onChange={(e) => setNewExpenseName(e.target.value)}
                  placeholder="Dinner, Movie tickets, etc."
                />
              </div>
              <div className="w-full sm:w-1/3">
                <Label htmlFor="expense-amount">Amount</Label>
                <Input
                  id="expense-amount"
                  type="number"
                  value={newExpenseAmount}
                  onChange={(e) => setNewExpenseAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddExpense} className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>

            <div className="mt-4">
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <p className="text-gray-500">Loading shared expenses...</p>
                </div>
              ) : sharedExpenses.length > 0 ? (
                <>
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder="Search expenses..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentItems.map((expense) => (
                          <TableRow key={expense.id}>
                            <TableCell>{expense.name}</TableCell>
                            <TableCell className="text-right">
                              {expense.amount.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell className="font-bold">Total</TableCell>
                          <TableCell className="text-right font-bold">
                            {totalAmount.toFixed(2)}
                          </TableCell>
                        </TableRow>
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
                  
                  <div className="mt-4 flex justify-end">
                    <Button
                      onClick={handleClearExpenses}
                      variant="destructive"
                      className="flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Shared Expenses
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center p-8 text-gray-500 border rounded-md">
                  <p>No shared expenses yet. Add some to get started.</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SharedExpensesPage;
