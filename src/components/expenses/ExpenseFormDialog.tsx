import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import NameField from "./form-fields/NameField";
import CategoryField from "./form-fields/CategoryField";
import AmountField from "./form-fields/AmountField";
import DateField from "./form-fields/DateField";
import { BankAccountField } from "./form-fields/BankAccountField";
import { SavingsAccountField } from "./form-fields/SavingsAccountField";
import { useAddExpense } from "@/queries/useAddExpense";
import { useUpdateExpense } from "@/queries/updateExpenses";
import { useUpdateRecurrentExpense } from "@/queries/useUpdateRecurrentExpense";
import { useCreateRecurrentExpense } from "@/queries/useCreateRecurrentExpense";

interface ExpenseFormDialogProps {
  isOpen: boolean;
  currentExpense: Expense | null;
  toggleModal: (val: boolean) => void;
  isRecurring: boolean;
}

const ExpenseFormDialog = ({
  isOpen,
  currentExpense,
  toggleModal,
  isRecurring,
}: ExpenseFormDialogProps) => {
  const { mutateAsync: addExpense, isPending } = useAddExpense();
  const { mutateAsync: updateExpense, isPending: isPendingUpdate } = useUpdateExpense();
  const { mutateAsync: updateRecurring, isPending: isPendingRecurring } = useUpdateRecurrentExpense();
  const { mutateAsync: createRecurring, isPending: isPendingCreateRecurring } = useCreateRecurrentExpense();

  const isLoading = isPendingRecurring || isPendingUpdate || isPending || isPendingCreateRecurring

  const [category, setCategory] = useState("Personal");

  const getInitialValues = useCallback(() => {
    if (currentExpense) {
      return {
        name: currentExpense.name,
        category: currentExpense.category,
        amount: currentExpense.amount,
        bank_account: currentExpense.bank_account,
        is_paid: currentExpense.is_paid,
        date: currentExpense.date,
        savings_account: currentExpense.savingsAccount,
      };
    }
    return isRecurring
      ? {
          name: "",
          category: "Personal",
          amount: 0,
          bank_account: "",
          savings_account: "",
        }
      : {
          name: "",
          category: "Personal",
          amount: "",
          bank_account: "Apple",
          is_paid: false,
          date: new Date(),
          savings_account: "401k",
        };
  }, [currentExpense, isRecurring]);

  const form = useForm({
    defaultValues: getInitialValues(),
  });

  useEffect(() => {
    const initialValues = getInitialValues();
    form.reset(initialValues);
    setCategory(initialValues.category);
  }, [currentExpense, isRecurring, form, getInitialValues]);

  const resetModal = () => {
    form.reset(getInitialValues());
    toggleModal(false);
  };

  const onSubmit = async () => {
    const values = form.getValues();
    try {
      if (isRecurring) {
        if (currentExpense) {
          await updateRecurring(values);
        } else {
          await createRecurring(values);
        }
      } else {
        if (currentExpense) {
          await updateExpense(values);
        } else {
          await addExpense(values);
        }
      }
      resetModal();
      setCategory("")
    } catch (error) {
      console.error("Error submitting expense:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentExpense ? "Edit Expense" : "Add New Expense"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <NameField form={form} />
            <CategoryField form={form} onCategoryChange={setCategory} />
            {category === "Savings" && <SavingsAccountField form={form} />}
            <AmountField form={form} />
            {isRecurring ? null : <DateField form={form} />}
            <BankAccountField form={form} />
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={resetModal}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : currentExpense
                  ? "Save Changes"
                  : "Add Expense"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseFormDialog;
