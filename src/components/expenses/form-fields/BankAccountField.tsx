
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bankAccounts } from "../constants";
import { UseFormReturn } from "react-hook-form";

interface BankAccountFieldProps {
  form: UseFormReturn<any>;
}

export const BankAccountField = ({ form }: BankAccountFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="bank_account"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Bank Account</FormLabel>
          <Select
            value={field.value || "Betterment"}
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select bank account" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {bankAccounts.map((account) => (
                <SelectItem key={account} value={account}>
                  {account}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
