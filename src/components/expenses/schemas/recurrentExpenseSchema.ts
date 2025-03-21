
import { z } from "zod";

export const recurrentExpenseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  amount: z.coerce
    .number()
    .min(0.01, "Amount must be greater than 0")
    .transform((val) => parseFloat(val.toFixed(2))),
  bank_account: z.string().min(1, "Bank account is required"),
});

export type RecurrentExpenseFormValues = z.infer<typeof recurrentExpenseSchema>;
