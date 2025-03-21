
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface AmountFieldProps {
  form: UseFormReturn<any>;
}

const AmountField = ({ form }: AmountFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="amount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Amount</FormLabel>
          <div className="flex items-center gap-2">
            <FormControl>
              <div className="relative flex-1">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  className="pl-6"
                />
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
              </div>
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AmountField;
