
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TableSearch from "@/components/ui/table-search";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ExpensesList } from "./ExpensesList";
import { CategoryBudget } from "./CategoryBudget";
import { GroceriesBudget } from "./GroceriesBudget";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CalculatorIcon, ChevronDown, FilterIcon, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface SelectableExpense {
  id: string;
  name: string;
  category: string;
  amount: number;
  date?: string;
  bank_account: string;
  isSelected?: boolean;
}

export interface SelectableRecurrentExpense {
  id: string;
  name: string;
  category: string;
  amount: number;
  bank_account: string;
  isSelected?: boolean;
}

const CalculationsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBankAccounts, setSelectedBankAccounts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExpenses, setSelectedExpenses] = useState<{[key: string]: boolean}>({});
  const [selectedRecurrentExpenses, setSelectedRecurrentExpenses] = useState<{[key: string]: boolean}>({});
  const [expenseType, setExpenseType] = useState<"regular" | "recurrent" | "all">("all");

  // Query for regular expenses
  const { 
    data: expenses = [], 
    isLoading: expensesLoading, 
    refetch: refetchExpenses 
  } = useQuery({
    queryKey: ["expenses-for-calculations"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("expenses")
          .select("*")
          .eq("is_deleted", false)
          .order("date", { ascending: false });

        if (error) {
          console.error("Error fetching expenses:", error);
          throw error;
        }
        
        return data;
      } catch (error) {
        console.error("Error in expenses query:", error);
        throw error;
      }
    },
  });

  // Query for recurrent expenses
  const { 
    data: recurrentExpenses = [], 
    isLoading: recurrentLoading,
    refetch: refetchRecurrent
  } = useQuery({
    queryKey: ["recurrent-expenses-for-calculations"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("recurrent_expenses")
          .select("*")
          .eq("is_deleted", false);

        if (error) {
          console.error("Error fetching recurrent expenses:", error);
          throw error;
        }
        
        return data;
      } catch (error) {
        console.error("Error in recurrent expenses query:", error);
        throw error;
      }
    },
  });

  // Set loading state based on query loading states
  useEffect(() => {
    setIsLoading(expensesLoading || recurrentLoading);
  }, [expensesLoading, recurrentLoading]);

  // Refresh data every 30 seconds to ensure we have the latest data
  useEffect(() => {
    const interval = setInterval(() => {
      refetchExpenses();
      refetchRecurrent();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [refetchExpenses, refetchRecurrent]);

  const bankAccounts = React.useMemo(() => {
    const uniqueBankAccounts = new Set<string>();
    expenses.forEach(expense => {
      if (expense.bank_account) {
        uniqueBankAccounts.add(expense.bank_account);
      }
    });
    recurrentExpenses.forEach(expense => {
      if (expense.bank_account) {
        uniqueBankAccounts.add(expense.bank_account);
      }
    });
    return Array.from(uniqueBankAccounts).sort();
  }, [expenses, recurrentExpenses]);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedBankAccounts(bankAccounts);
      const newSelectedExpenses = { ...selectedExpenses };
      const newSelectedRecurrentExpenses = { ...selectedRecurrentExpenses };
      
      if (expenseType === "regular" || expenseType === "all") {
        expenses.forEach(expense => {
          newSelectedExpenses[expense.id] = true;
        });
      }
      
      if (expenseType === "recurrent" || expenseType === "all") {
        recurrentExpenses.forEach(expense => {
          newSelectedRecurrentExpenses[expense.id] = true;
        });
      }
      
      setSelectedExpenses(newSelectedExpenses);
      setSelectedRecurrentExpenses(newSelectedRecurrentExpenses);
    } else {
      setSelectedBankAccounts([]);
      setSelectedExpenses({});
      setSelectedRecurrentExpenses({});
    }
  };

  const handleBankAccountSelect = (bankAccount: string, checked: boolean) => {
    if (checked) {
      setSelectedBankAccounts(prev => [...prev, bankAccount]);
      
      const newSelectedExpenses = { ...selectedExpenses };
      const newSelectedRecurrentExpenses = { ...selectedRecurrentExpenses };
      
      if (expenseType === "regular" || expenseType === "all") {
        expenses.forEach(expense => {
          if (expense.bank_account === bankAccount) {
            newSelectedExpenses[expense.id] = true;
          }
        });
      }
      
      if (expenseType === "recurrent" || expenseType === "all") {
        recurrentExpenses.forEach(expense => {
          if (expense.bank_account === bankAccount) {
            newSelectedRecurrentExpenses[expense.id] = true;
          }
        });
      }
      
      setSelectedExpenses(newSelectedExpenses);
      setSelectedRecurrentExpenses(newSelectedRecurrentExpenses);
    } else {
      setSelectedBankAccounts(prev => prev.filter(b => b !== bankAccount));
      
      const newSelectedExpenses = { ...selectedExpenses };
      const newSelectedRecurrentExpenses = { ...selectedRecurrentExpenses };
      
      if (expenseType === "regular" || expenseType === "all") {
        expenses.forEach(expense => {
          if (expense.bank_account === bankAccount) {
            newSelectedExpenses[expense.id] = false;
          }
        });
      }
      
      if (expenseType === "recurrent" || expenseType === "all") {
        recurrentExpenses.forEach(expense => {
          if (expense.bank_account === bankAccount) {
            newSelectedRecurrentExpenses[expense.id] = false;
          }
        });
      }
      
      setSelectedExpenses(newSelectedExpenses);
      setSelectedRecurrentExpenses(newSelectedRecurrentExpenses);
    }
  };

  const handleToggleSelect = (id: string, isSelected: boolean, isRecurrent: boolean = false) => {
    if (isRecurrent) {
      setSelectedRecurrentExpenses(prev => ({
        ...prev,
        [id]: isSelected
      }));
    } else {
      setSelectedExpenses(prev => ({
        ...prev,
        [id]: isSelected
      }));
    }
  };

  React.useEffect(() => {
    if (bankAccounts.length > 0 && selectedBankAccounts.length === bankAccounts.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedBankAccounts, bankAccounts]);

  const filteredExpenses = React.useMemo(() => {
    return expenses.filter(expense => {
      const matchesSearch = searchQuery 
        ? expense.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (expense.bank_account && expense.bank_account.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      
      return matchesSearch;
    }).map(expense => ({
      ...expense,
      isSelected: !!selectedExpenses[expense.id]
    })) as SelectableExpense[];
  }, [expenses, searchQuery, selectedExpenses]);

  const filteredRecurrentExpenses = React.useMemo(() => {
    return recurrentExpenses.filter(expense => {
      const matchesSearch = searchQuery 
        ? expense.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (expense.bank_account && expense.bank_account.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      
      return matchesSearch;
    }).map(expense => ({
      ...expense,
      isSelected: !!selectedRecurrentExpenses[expense.id]
    })) as SelectableRecurrentExpense[];
  }, [recurrentExpenses, searchQuery, selectedRecurrentExpenses]);

  const displayedExpenses = React.useMemo(() => {
    if (expenseType === "regular") {
      return filteredExpenses;
    } else if (expenseType === "recurrent") {
      return filteredRecurrentExpenses;
    } else {
      return [
        ...filteredExpenses,
        ...filteredRecurrentExpenses.map(item => ({
          ...item,
          isRecurring: true
        }))
      ] as any[];
    }
  }, [filteredExpenses, filteredRecurrentExpenses, expenseType]);

  const handleExpenseTypeChange = (value: "regular" | "recurrent" | "all") => {
    setExpenseType(value);
  };

  const handleCalculate = () => {
    const regularSelectedCount = Object.values(selectedExpenses).filter(Boolean).length;
    const recurrentSelectedCount = Object.values(selectedRecurrentExpenses).filter(Boolean).length;
    const totalSelectedCount = regularSelectedCount + recurrentSelectedCount;
    
    if (totalSelectedCount === 0) {
      toast.warning("Please select at least one expense to calculate");
      return;
    }
    
    const regularTotal = filteredExpenses
      .filter(expense => selectedExpenses[expense.id])
      .reduce((sum, expense) => sum + Number(expense.amount), 0);
      
    const recurrentTotal = filteredRecurrentExpenses
      .filter(expense => selectedRecurrentExpenses[expense.id])
      .reduce((sum, expense) => sum + Number(expense.amount), 0);
    
    const totalAmount = regularTotal + recurrentTotal;
    
    toast.success(`Total for selected expenses: $${totalAmount.toFixed(2)}`);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span>Expense Analysis</span>
          </h2>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <CategoryBudget 
              expenses={expenses} 
              recurrentExpenses={recurrentExpenses} 
            />
            
            <GroceriesBudget 
              expenses={expenses} 
              recurrentExpenses={recurrentExpenses} 
            />
          </div>
          
          <div className="bg-white rounded-lg">
            <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center">
              <TableSearch 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search expenses..."
                className="w-full sm:w-64"
              />
              
              <div className="flex gap-2 flex-1 justify-end">
                <Select 
                  value={expenseType} 
                  onValueChange={(value) => handleExpenseTypeChange(value as "regular" | "recurrent" | "all")}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Expense type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Expenses</SelectItem>
                    <SelectItem value="regular">Regular Only</SelectItem>
                    <SelectItem value="recurrent">Recurring Only</SelectItem>
                  </SelectContent>
                </Select>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <FilterIcon className="h-4 w-4" />
                      Select Bank Accounts
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-60 z-50" align="end">
                    <DropdownMenuLabel>
                      Select by Bank Accounts
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <div className="max-h-60 overflow-auto">
                      <DropdownMenuCheckboxItem
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                      >
                        Select All
                      </DropdownMenuCheckboxItem>
                      
                      <DropdownMenuSeparator />
                      
                      {bankAccounts.map(bankAccount => (
                        <DropdownMenuCheckboxItem
                          key={bankAccount}
                          checked={selectedBankAccounts.includes(bankAccount)}
                          onCheckedChange={(checked) => handleBankAccountSelect(bankAccount, checked === true)}
                        >
                          {bankAccount}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button 
                  onClick={handleCalculate}
                  className="gap-2"
                >
                  <CalculatorIcon className="h-4 w-4" />
                  Calculate
                </Button>
              </div>
            </div>
            
            <ExpensesList 
              expenses={displayedExpenses} 
              isLoading={isLoading}
              onToggleSelect={(id, isSelected, isRecurrent) => 
                handleToggleSelect(id, isSelected, isRecurrent)
              }
              showCheckboxes={true}
              isRecurring={expenseType === "recurrent"}
              onCalculate={handleCalculate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculationsPage;
