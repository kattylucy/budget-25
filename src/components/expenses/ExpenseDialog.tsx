
import React from "react";

export interface Expense {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  is_deleted?: boolean;
  savingsAccount?: string;
  bank_account?: string;
  notes?: string | null;
  currency_symbol?: string; // Added to track if the amount was converted from Euro
  is_favorite?: boolean; // Added to support favorite functionality
}

export interface Income {
  id: string;
  amount: number;
  category?: string;
  tag?: string;
}

// This file defines interfaces that will be used across components
// It doesn't contain any functional component on its own
