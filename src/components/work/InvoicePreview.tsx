
import React from "react";
import { format, parse } from "date-fns";
import { FileText, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InvoicePreviewProps {
  data: any;
  onSendInvoice?: () => void;
}

const InvoicePreview = ({ data, onSendInvoice }: InvoicePreviewProps) => {
  if (!data) return null;

  const [isDownloading, setIsDownloading] = React.useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = parse(dateString, 'yyyy-MM-dd', new Date());
    return format(date, 'MMMM d, yyyy');
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      toast.info("Generating PDF for download...");
      
      const { data: pdfData, error } = await supabase.functions.invoke("send-invoice", {
        body: { ...data, downloadOnly: true }
      });
      
      if (error) {
        throw new Error("Failed to generate PDF: " + error.message);
      }
      
      const binaryString = atob(pdfData.pdf);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const filename = data.invoiceNumber 
        ? `Invoice-${data.invoiceNumber}.pdf` 
        : `Invoice-${format(new Date(data.invoiceDate), 'yyyyMMdd')}.pdf`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("PDF downloaded successfully");
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Failed to download PDF: " + (err.message || "Unknown error"));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end space-x-2 print:hidden">
        <Button variant="outline" size="sm" onClick={handleDownload} disabled={isDownloading}>
          <Download className="h-4 w-4 mr-2" />
          {isDownloading ? "Downloading..." : "Download PDF"}
        </Button>
        {onSendInvoice && (
          <Button variant="outline" size="sm" onClick={onSendInvoice}>
            <Mail className="h-4 w-4 mr-2" />
            Email Invoice
          </Button>
        )}
      </div>

      <div className="border rounded-lg p-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <FileText className="h-6 w-6 text-gray-800" />
              <h2 className="text-2xl font-bold">INVOICE</h2>
            </div>
            <div className="space-y-1">
              <p><span className="font-medium">Invoice Number:</span> {data.invoiceNumber}</p>
              <p><span className="font-medium">Invoice Date:</span> {formatDate(data.invoiceDate)}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">Bill To:</h3>
              <p className="font-medium">{data.billTo.name}</p>
              <p>{data.billTo.address}</p>
              <p>{data.billTo.taxId}</p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Monthly Salary</TableCell>
              <TableCell className="text-right">{formatCurrency(data.monthlySalary)}</TableCell>
            </TableRow>
            
            {data.expenses.map((expense, index) => (
              <TableRow key={expense.id || index}>
                <TableCell>{expense.description}</TableCell>
                <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
              </TableRow>
            ))}
            
            <TableRow>
              <TableCell className="font-bold text-lg">Total</TableCell>
              <TableCell className="text-right font-bold text-lg">{formatCurrency(data.totalAmount)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {data.notes && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">Notes:</h3>
            <p className="text-gray-700">{data.notes}</p>
          </div>
        )}

        <Separator className="my-8" />
        
        <div className="mt-8">
          <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">Payment Information:</h3>
          <div className="space-y-1">
            <p><span className="font-medium">Recipient Name:</span> {data.sendTo.recipientName}</p>
            <p><span className="font-medium">Recipient Address:</span> {data.sendTo.recipientAddress}</p>
            <p><span className="font-medium">Bank Name:</span> {data.sendTo.bankName}</p>
            <p><span className="font-medium">Bank Address:</span> {data.sendTo.bankAddress}</p>
            <p><span className="font-medium">Account #:</span> {data.sendTo.accountNumber}</p>
            <p><span className="font-medium">Routing #:</span> {data.sendTo.routingNumber}</p>
            <p><span className="font-medium">SWIFT Code #:</span> {data.sendTo.swiftCode}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
