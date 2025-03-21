
import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TableSearch from "@/components/ui/table-search";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface HistoryRecord {
  id: string;
  month: string;
  year: number;
  income: number;
  expenses: number;
  remaining_balance: number;
  amount_saved: number;
  created_at: string;
  user_id?: string;
}

const ITEMS_PER_PAGE = 10;

const HistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: historyData, isLoading } = useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("history")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching history:", error);
        throw error;
      }
      
      console.log("History data:", data);
      return (data || []) as HistoryRecord[];
    },
  });

  const filteredHistory = useMemo(() => {
    if (!historyData || !searchQuery.trim()) return historyData;
    
    const query = searchQuery.toLowerCase();
    return historyData.filter(record => 
      record.month.toLowerCase().includes(query) ||
      String(record.year).includes(query) ||
      String(record.income).includes(query) ||
      String(record.expenses).includes(query) ||
      String(record.remaining_balance).includes(query) ||
      String(record.amount_saved).includes(query)
    );
  }, [historyData, searchQuery]);

  // Reset to page 1 when search query changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Calculate total pages
  const totalPages = filteredHistory ? Math.ceil(filteredHistory.length / ITEMS_PER_PAGE) : 0;
  
  // Get current page items
  const currentItems = filteredHistory?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Budget History</h2>
        
        {isLoading ? (
          <p className="text-center py-4">Loading history...</p>
        ) : historyData?.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No history available yet. Close a month to save your budget history.</p>
        ) : (
          <>
            <TableSearch 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search history..."
              className="mb-4"
            />
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Income</TableHead>
                    <TableHead>Expenses</TableHead>
                    <TableHead>Amount Saved</TableHead>
                    <TableHead>Remaining Balance</TableHead>
                    <TableHead>Date Closed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-500 py-4">
                        No matching history records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems?.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.month}</TableCell>
                        <TableCell>{record.year}</TableCell>
                        <TableCell className="text-green-600">
                          ${(record.income || 0).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-red-600">
                          ${(record.expenses || 0).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-blue-600">
                          ${(record.amount_saved || 0).toFixed(2)}
                        </TableCell>
                        <TableCell className={record.remaining_balance >= 0 ? "text-green-600" : "text-red-600"}>
                          ${record.remaining_balance.toFixed(2)}
                        </TableCell>
                        <TableCell>{format(new Date(record.created_at), "MMM dd, yyyy")}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  {currentPage > 1 ? (
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(prev => Math.max(prev - 1, 1));
                        }} 
                      />
                    </PaginationItem>
                  ) : (
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => e.preventDefault()} 
                        className="opacity-50 pointer-events-none" 
                      />
                    </PaginationItem>
                  )}

                  {[...Array(totalPages)].map((_, i) => {
                    const pageNumber = i + 1;
                    
                    if (
                      pageNumber === 1 || 
                      pageNumber === totalPages || 
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink 
                            href="#" 
                            isActive={pageNumber === currentPage}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(pageNumber);
                            }}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (
                      (pageNumber === 2 && currentPage > 3) || 
                      (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return <PaginationEllipsis key={pageNumber} />;
                    } else {
                      return null;
                    }
                  })}

                  {currentPage < totalPages ? (
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(prev => Math.min(prev + 1, totalPages));
                        }} 
                      />
                    </PaginationItem>
                  ) : (
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => e.preventDefault()} 
                        className="opacity-50 pointer-events-none" 
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
