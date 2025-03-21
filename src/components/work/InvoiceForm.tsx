import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
}

interface InvoiceFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  lastInvoiceNumber?: string;
}

const InvoiceForm = ({ onSubmit, isLoading = false, lastInvoiceNumber = '' }: InvoiceFormProps) => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [invoiceDate, setInvoiceDate] = useState(format(new Date(), "yyyy-MM-dd"));
  
  const form = useForm({
    defaultValues: {
      invoiceNumber: "",
      invoiceDate: format(new Date(), "yyyy-MM-dd"),
      notes: "",
    },
  });

  const addExpense = () => {
    setExpenses([
      ...expenses,
      {
        id: crypto.randomUUID(),
        description: "",
        amount: 0,
      },
    ]);
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const updateExpense = (id: string, field: string, value: string | number) => {
    setExpenses(
      expenses.map((expense) => {
        if (expense.id === id) {
          return {
            ...expense,
            [field]: value,
          };
        }
        return expense;
      })
    );
  };

  const handleSubmit = (formData) => {
    // Calculate monthly salary (100k per year)
    const monthlySalary = 100000 / 12;
    
    // Calculate total amount including salary and expenses
    const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    const totalAmount = monthlySalary + totalExpenses;
    
    const invoiceData = {
      ...formData,
      expenses,
      monthlySalary,
      totalAmount,
      dueDate: "", // Keeping an empty string for compatibility with InvoicePreview
      billTo: {
        name: "k-f dev AG",
        address: "Grafenauweg 8, 6300 Zug, Switzerland",
        taxId: "CHE-360.729.566 MWST"
      },
      sendTo: {
        recipientName: "Katty Barroso Hernandez",
        recipientAddress: "20442 Drakewood Dr, katy, TX, 774949",
        bankName: "Capital One",
        bankAddress: "1680 capital one dr, new york",
        accountNumber: "36239990106",
        routingNumber: "031176110",
        swiftCode: "HIBKUS44"
      }
    };
    
    onSubmit(invoiceData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="invoiceNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="invoiceDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Date</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      setInvoiceDate(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Monthly Salary</h3>
            <div className="text-right">
              <p className="text-lg font-medium">$8,333.33</p>
              <p className="text-xs text-gray-500">($100,000 per year)</p>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Additional Expenses</h3>
            <Button type="button" variant="outline" size="sm" onClick={addExpense}>
              <Plus className="h-4 w-4 mr-1" /> Add Expense
            </Button>
          </div>
          
          {expenses.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm italic">
              No additional expenses added
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <Card key={expense.id}>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-8 gap-3 items-end">
                      <div className="md:col-span-5">
                        <FormLabel className="text-xs">Description</FormLabel>
                        <Input
                          value={expense.description}
                          onChange={(e) => updateExpense(expense.id, "description", e.target.value)}
                          placeholder="Expense description"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <FormLabel className="text-xs">Amount ($)</FormLabel>
                        <Input
                          type="number"
                          value={expense.amount}
                          onChange={(e) => updateExpense(expense.id, "amount", parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="md:col-span-1 flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExpense(expense.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Any additional notes for the invoice" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : "Generate Invoice"}
        </Button>
      </form>
    </Form>
  );
};

export default InvoiceForm;
