
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { RecurrentExpenseFormValues } from "../schemas/recurrentExpenseSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, bankAccounts } from "../constants";
import NameField from "../form-fields/NameField";
import CategoryField from "../form-fields/CategoryField";
import { BankAccountField } from "../form-fields/BankAccountField";

interface RecurrentExpenseFormProps {
  form: UseFormReturn<RecurrentExpenseFormValues>;
  isSavingsCategory: boolean;
  isSubmitting: boolean;
  onCategoryChange: (value: string) => void;
  onSubmit: (values: RecurrentExpenseFormValues) => void;
  onCancel: () => void;
  isEditing: boolean;
}

export const RecurrentExpenseForm = ({
  form,
  isSavingsCategory,
  isSubmitting,
  onCategoryChange,
  onSubmit,
  onCancel,
  isEditing,
}: RecurrentExpenseFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <NameField form={form} />

        <CategoryField form={form} onCategoryChange={onCategoryChange} />

        {/* Amount field */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    className="pl-6"
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? 0 : parseFloat(value));
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <BankAccountField form={form} />

        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Add Expense"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
