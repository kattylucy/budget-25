
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { IncomeEntryListProps } from "@/types/income";
import { useDeleteIncome } from "@/queries/useDeleteIncome";

const IncomeEntryList = ({ entries, isLoading = false }: IncomeEntryListProps) => {
  const { mutate } = useDeleteIncome()

  if (isLoading) {
    return (
      <div className="py-4">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return <p className="text-center py-4 text-gray-500">No income entries yet.</p>;
  }

  return (
    <div>
      <ul className="divide-y divide-gray-100">
        {entries.map((entry) => (
           <li className="py-3">
           <div className="flex justify-between items-center">
             <div>
               <p className="font-medium">{entry.category}</p>
               {entry.tag && <p className="text-sm text-gray-500">{entry.tag}</p>}
             </div>
             <div className="flex items-center">
               <span className="text-green-600 font-semibold mr-3">
                 ${entry.amount.toFixed(2)}
               </span>
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={() => mutate(entry.id)}
                 className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
               >
                 <Trash className="h-4 w-4" />
               </Button>
             </div>
           </div>
         </li>
        ))}
      </ul>
    </div>
  );
};

export default IncomeEntryList;
