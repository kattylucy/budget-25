
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Banknote } from "lucide-react";

interface SummaryCardsProps {
  income: number;
  expenses: number;
  balance: number;
}

const SummaryCards = ({ 
  income, 
  expenses, 
  balance
}: SummaryCardsProps) => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Income
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${formatCurrency(income)}</div>
          <p className="text-sm text-muted-foreground">
            Total income this month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Expenses
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">-${formatCurrency(expenses)}</div>
          <p className="text-sm text-muted-foreground">
            Total expenses this month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Remaining Balance
          </CardTitle>
          <Banknote className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${formatCurrency(balance)}</div>
          <p className="text-sm text-muted-foreground">
            Amount left to spend
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
