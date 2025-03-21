
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
import { savingsAccounts } from "../constants";
import { UseFormReturn } from "react-hook-form";

interface SavingsAccountFieldProps {
  form: UseFormReturn<any>;
}

export const SavingsAccountField = ({ form }: SavingsAccountFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="savings_account"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Savings Account</FormLabel>
          <Select
            value={field.value || ""}
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select savings account" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {savingsAccounts.map((account) => (
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
