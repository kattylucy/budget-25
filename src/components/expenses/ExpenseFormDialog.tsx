
import {  useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Expense } from "./ExpenseDialog";
import { Form } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import NameField from "./form-fields/NameField";
import CategoryField from "./form-fields/CategoryField";
import AmountField from "./form-fields/AmountField";
import DateField from "./form-fields/DateField";
import { BankAccountField } from "./form-fields/BankAccountField";
import { SavingsAccountField } from "./form-fields/SavingsAccountField";
import { useForm } from "react-hook-form";
import { useAddExpense } from "@/queries/useAddExpense";
import { useUpdateExpense } from "@/queries/updateExpenses";


interface ExpenseFormDialogProps {
  isOpen: boolean;
  currentExpense: Expense | null;
  toggleModal: (val: boolean) => void;
}

const ExpenseFormDialog = ({
  isOpen,
  currentExpense,
  toggleModal
}: ExpenseFormDialogProps) => {
  const { mutateAsync, isPending } = useAddExpense()
  const { mutateAsync: mutateUpdate, isPending: isPendingUpdate } = useUpdateExpense()
  const [category, setCategory] = useState("")

  const form = useForm({
    defaultValues: {
      name: currentExpense?.name || "",
      category: currentExpense?.category || "Personal",
      amount: currentExpense?.amount || "",
      bank_account: currentExpense?.bank_account || "Apple",
      is_paid: currentExpense?.is_paid || false,
      date: currentExpense?.date || new Date(),
      savings_account:currentExpense?.savingsAccount ||  "401k"
    },
  })

  useEffect(() => {
    if (currentExpense) {
      form.reset({
        name: currentExpense.name,
        category: currentExpense.category,
        amount: currentExpense.amount,
        bank_account: currentExpense.bank_account,
        is_paid: currentExpense.is_paid,
        date: currentExpense.date,
        savings_account: currentExpense.savingsAccount, 
      });
      setCategory(currentExpense.category); 
    } else {
      form.reset({
        name: "",
        category: "Personal",
        amount: "",
        bank_account: "Apple",
        is_paid: false,
        date: new Date(),
        savings_account: "401k"
      });
      setCategory("Personal");
    }
  }, [currentExpense]);
  

  const onSubmit = async () => {
    const values = form.getValues()
    if(currentExpense){
      await mutateUpdate(values)
      resetModal()
    }else{
      await mutateAsync(values)
      resetModal()
    }
  }

  const resetModal = () => {
    form.reset()
    toggleModal(false)
  }

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
        <CategoryField 
          form={form} 
          onCategoryChange={(value) => setCategory(value)}
        />
        {category === "Savings" && (
          <SavingsAccountField form={form} />
        )}
        <AmountField form={form} />
        <DateField form={form} />
        <BankAccountField form={form} />
        <DialogFooter>
          <Button variant="outline" type="button" onClick={resetModal} disabled={isPending || isPendingUpdate}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || isPendingUpdate}>
            {isPending || isPendingUpdate ? "Saving..." : currentExpense ? "Save Changes" : "Add Expense"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseFormDialog;
