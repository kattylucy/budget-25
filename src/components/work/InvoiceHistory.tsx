import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { FileText, ChevronDown, ChevronUp, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import InvoicePreview from "./InvoicePreview";

const InvoiceHistory = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedInvoice, setExpandedInvoice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const invoicesPerPage = 5;

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invoice_history')
        .select('*')
        .order('invoice_date', { ascending: false });

      if (error) {
        throw error;
      }

      setInvoices(data || []);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const toggleInvoiceExpansion = (id) => {
    if (expandedInvoice === id) {
      setExpandedInvoice(null);
    } else {
      setExpandedInvoice(id);
    }
  };

  const handleSendInvoice = async (invoice) => {
    try {
      setIsSendingEmail(true);
      
      const invoiceData = {
        invoiceNumber: invoice.invoice_number,
        invoiceDate: invoice.invoice_date,
        monthlySalary: invoice.monthly_salary,
        totalAmount: invoice.total_amount,
        expenses: invoice.expenses || [],
        notes: invoice.notes,
        billTo: invoice.bill_to,
        sendTo: invoice.send_to
      };
      
      toast.info("Generating PDF and sending invoice email...");
      
      const { data, error } = await supabase.functions.invoke("send-invoice", {
        body: invoiceData
      });
      
      if (error) {
        throw new Error("Failed to send invoice: " + error.message);
      }
      
      toast.success("Invoice PDF sent successfully to kattybarroso1321@gmail.com");
    } catch (err) {
      console.error("Error sending invoice:", err);
      toast.error("Failed to send the invoice: " + (err.message || "Unknown error"));
    } finally {
      setIsSendingEmail(false);
    }
  };

  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = invoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
  const totalPages = Math.ceil(invoices.length / invoicesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading invoices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <Button 
          variant="outline" 
          onClick={fetchInvoices}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No invoices found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]"></TableHead>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentInvoices.map((invoice) => (
                <React.Fragment key={invoice.id}>
                  <TableRow className="cursor-pointer hover:bg-gray-50">
                    <TableCell onClick={() => toggleInvoiceExpansion(invoice.id)}>
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        {expandedInvoice === invoice.id ? (
                          <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium" onClick={() => toggleInvoiceExpansion(invoice.id)}>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-500" />
                        {invoice.invoice_number || "No Number"}
                      </div>
                    </TableCell>
                    <TableCell onClick={() => toggleInvoiceExpansion(invoice.id)}>
                      {formatDate(invoice.invoice_date)}
                    </TableCell>
                    <TableCell className="text-right" onClick={() => toggleInvoiceExpansion(invoice.id)}>
                      {formatCurrency(invoice.total_amount)}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        disabled={isSendingEmail}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendInvoice(invoice);
                        }}
                        title="Email Invoice"
                      >
                        <Mail className="h-4 w-4 text-gray-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  {expandedInvoice === invoice.id && (
                    <TableRow>
                      <TableCell colSpan={5} className="p-0">
                        <div className="p-4 bg-gray-50">
                          <InvoicePreview
                            data={{
                              invoiceNumber: invoice.invoice_number,
                              invoiceDate: invoice.invoice_date,
                              monthlySalary: invoice.monthly_salary,
                              totalAmount: invoice.total_amount,
                              expenses: invoice.expenses || [],
                              notes: invoice.notes,
                              billTo: invoice.bill_to,
                              sendTo: invoice.send_to
                            }}
                            onSendInvoice={() => handleSendInvoice(invoice)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <PaginationItem key={number}>
                <PaginationLink
                  onClick={() => paginate(number)}
                  isActive={currentPage === number}
                  className="cursor-pointer"
                >
                  {number}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default InvoiceHistory;
