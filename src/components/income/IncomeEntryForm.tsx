
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IncomeEntryType } from "./IncomeEntry";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface IncomeEntryFormProps {
  onSave: (entry: Omit<IncomeEntryType, "id">) => void;
  onCancel: () => void;
}

const IncomeEntryForm = ({ onSave, onCancel }: IncomeEntryFormProps) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Salary");
  const [tag, setTag] = useState("");

  const handleSubmit = () => {
    onSave({
      amount: parseFloat(amount) || 0,
      category,
      tag,
      currency: "USD"
    });
    
    // Reset form
    setAmount("");
    setCategory("Salary");
    setTag("");
  };

  return (
    <div className="bg-gray-50 p-3 rounded-md mb-4">
      <h3 className="text-sm font-medium mb-2">Add New Income</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
        <div className="relative">
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-6"
          />
          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
            $
          </span>
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Salary">Salary</SelectItem>
            <SelectItem value="Bonus">Bonus</SelectItem>
            <SelectItem value="Investment">Investment</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder="Tag (optional)"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Save</Button>
      </div>
    </div>
  );
};

export default IncomeEntryForm;
