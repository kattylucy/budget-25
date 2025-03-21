import React, { useState, useEffect } from "react";
import { Briefcase, Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import InvoiceForm from "./InvoiceForm";
import InvoicePreview from "./InvoicePreview";
import InvoiceHistory from "./InvoiceHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const WorkPage = () => {
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastInvoiceNumber, setLastInvoiceNumber] = useState('');
  const [activeTab, setActiveTab] = useState("list");

  useEffect(() => {
    fetchLastInvoiceNumber();
  }, []);

  const fetchLastInvoiceNumber = async () => {
    try {
      const { data, error } = await supabase
        .from('invoice_history')
        .select('invoice_number')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching last invoice number:", error);
        return;
      }

      if (data && data.length > 0) {
        setLastInvoiceNumber(data[0].invoice_number);
      } else {
        setLastInvoiceNumber("0");
      }
    } catch (err) {
      console.error("Error in fetching last invoice number:", err);
    }
  };

  const handleCreateInvoice = async (data) => {
    setInvoiceData(data);
    
    try {
      setIsLoading(true);
      const { data: savedInvoice, error } = await supabase.from('invoice_history').insert({
        invoice_number: data.invoiceNumber,
        invoice_date: data.invoiceDate,
        monthly_salary: data.monthlySalary,
        total_amount: data.totalAmount,
        notes: data.notes || null,
        expenses: data.expenses.length > 0 ? data.expenses : null,
        bill_to: data.billTo,
        send_to: data.sendTo
      }).select();
      
      if (error) {
        console.error("Error saving invoice:", error);
        toast.error("Failed to save the invoice");
      } else {
        console.log("Invoice saved successfully:", savedInvoice);
        toast.success("Invoice saved successfully");
        fetchLastInvoiceNumber();
        setActiveTab("list");
        setInvoiceData(null);
      }
    } catch (err) {
      console.error("Error in saving invoice:", err);
      toast.error("An error occurred while saving the invoice");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendInvoice = async () => {
    if (!invoiceData) return;
    
    try {
      toast.info("Generating PDF and sending invoice email...");
      
      const { data, error } = await supabase.functions.invoke("send-invoice", {
        body: invoiceData
      });
      
      console.log("Edge function response:", { data, error });
      
      if (error) {
        console.error("Error sending invoice email:", error);
        toast.error("Failed to send the invoice email: " + error.message);
      } else {
        console.log("Email sent successfully:", data);
        toast.success("Invoice PDF sent successfully to kattybarroso1321@gmail.com");
      }
    } catch (err) {
      console.error("Error in sending invoice:", err);
      toast.error("An error occurred while sending the invoice: " + (err.message || "Unknown error"));
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <h2 className="text-xl font-semibold p-4 border-b flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-gray-600" />
          <span>Work Dashboard</span>
        </h2>
        
        <div className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="list">Invoice History</TabsTrigger>
                <TabsTrigger value="create">Create Invoice</TabsTrigger>
              </TabsList>
              
              {activeTab === "list" && (
                <Button 
                  onClick={() => setActiveTab("create")}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  New Invoice
                </Button>
              )}
            </div>
            
            <TabsContent value="list" className="mt-0">
              <InvoiceHistory />
            </TabsContent>
            
            <TabsContent value="create" className="mt-0">
              {invoiceData ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <span>Invoice Preview</span>
                    </h3>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setInvoiceData(null)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                  <Card>
                    <CardContent className="p-4">
                      <InvoicePreview 
                        data={invoiceData} 
                        onSendInvoice={handleSendInvoice}
                      />
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-4">
                    <InvoiceForm onSubmit={handleCreateInvoice} isLoading={isLoading} lastInvoiceNumber={lastInvoiceNumber} />
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default WorkPage;
