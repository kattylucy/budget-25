
import React from "react";
import TableSearch from "@/components/ui/table-search";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  bankFilter: string;
  setBankFilter: (bank: string) => void;
  bankAccounts: string[];
}

const FilterPanel = ({
  searchQuery,
  setSearchQuery,
  bankFilter,
  setBankFilter,
  bankAccounts,
}: FilterPanelProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center">
      <TableSearch 
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search expenses..."
      />
      
      <div className="w-full sm:w-auto min-w-[200px]">
        <Select 
          value={bankFilter} 
          onValueChange={setBankFilter}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by bank account" />
          </SelectTrigger>
          <SelectContent>
            {bankAccounts.map(account => (
              <SelectItem key={account} value={account}>
                {account === "all" ? "All bank accounts" : account}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

    </div>
  );
};

export default FilterPanel;
