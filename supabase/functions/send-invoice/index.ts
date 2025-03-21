import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { jsPDF } from "npm:jspdf@2.5.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY") || "re_JZYJfpJ6_JZ8HixHGXpMkyptURyBybqEk");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  monthlySalary: number;
  totalAmount: number;
  expenses: Array<{
    description: string;
    amount: number;
  }>;
  notes?: string;
  billTo: {
    name: string;
    address: string;
    taxId: string;
  };
  sendTo: {
    recipientName: string;
    recipientAddress: string;
    bankName: string;
    bankAddress: string;
    accountNumber: string;
    routingNumber: string;
    swiftCode: string;
  };
  downloadOnly?: boolean; // Flag to indicate if we just need the PDF without sending email
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: InvoiceData = await req.json();
    console.log("Received invoice data:", data);

    // Generate a PDF for the invoice
    const pdfBuffer = generateInvoicePdf(data);
    console.log("PDF generated successfully, size:", pdfBuffer.length);

    // Convert ArrayBuffer to Base64 string for email attachment or download
    const pdfBase64 = bufferToBase64(pdfBuffer);
    console.log("PDF converted to base64, length:", pdfBase64.length);

    // If this is a download-only request, return the PDF data
    if (data.downloadOnly) {
      console.log("Download-only request, returning PDF data");
      return new Response(
        JSON.stringify({ pdf: pdfBase64 }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // For email requests, proceed with sending the email
    // Format the date
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Generate HTML for email body
    const emailHtml = generateEmailHtml(data, formatDate(data.invoiceDate));

    // Prepare invoice filename (with number if available)
    const invoiceFilename = data.invoiceNumber 
      ? `Invoice-${data.invoiceNumber}.pdf` 
      : `Invoice-${format(new Date(data.invoiceDate), 'yyyyMMdd')}.pdf`;

    // Send email with PDF attachment
    const emailResponse = await resend.emails.send({
      from: "Invoicing <onboarding@resend.dev>",
      to: ["kattybarroso1321@gmail.com"],
      subject: `Invoice ${data.invoiceNumber ? `#${data.invoiceNumber}` : ''} - ${formatDate(data.invoiceDate)}`,
      html: emailHtml,
      attachments: [
        {
          filename: invoiceFilename,
          content: pdfBase64,
        },
      ],
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-invoice function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

// Helper function to convert ArrayBuffer to Base64 string
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Format date string for display
function format(date: Date, pattern: string): string {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  return pattern
    .replace('yyyy', year)
    .replace('MM', month)
    .replace('dd', day);
}

function generateInvoicePdf(data: InvoiceData): Uint8Array {
  const doc = new jsPDF();
  
  // Set font and sizes
  doc.setFont("helvetica", "normal");
  
  // Add the header
  doc.setFontSize(24);
  doc.text("INVOICE", 20, 20);
  
  // Add invoice details
  doc.setFontSize(12);
  if (data.invoiceNumber) {
    doc.text(`Invoice Number: ${data.invoiceNumber}`, 20, 35);
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  doc.text(`Date: ${formatDate(data.invoiceDate)}`, 20, 42);
  
  // Add billing information
  doc.setFontSize(14);
  doc.text("Bill To:", 20, 55);
  doc.setFontSize(12);
  doc.text(data.billTo.name, 20, 62);
  doc.text(data.billTo.address, 20, 69);
  doc.text(`Tax ID: ${data.billTo.taxId}`, 20, 76);
  
  // Add invoice items
  doc.setFontSize(14);
  doc.text("Description", 20, 90);
  doc.text("Amount", 150, 90);
  
  // Draw a line
  doc.line(20, 92, 190, 92);
  
  // Add monthly salary
  let yPos = 100;
  doc.setFontSize(12);
  doc.text("Monthly Salary", 20, yPos);
  doc.text(`$${data.monthlySalary.toFixed(2)}`, 150, yPos);
  
  // Add expenses
  yPos += 10;
  if (data.expenses && data.expenses.length > 0) {
    data.expenses.forEach(expense => {
      doc.text(expense.description, 20, yPos);
      doc.text(`$${expense.amount.toFixed(2)}`, 150, yPos);
      yPos += 10;
    });
  }
  
  // Draw a line
  doc.line(20, yPos, 190, yPos);
  yPos += 8;
  
  // Add total
  doc.setFontSize(14);
  doc.text("Total", 20, yPos);
  doc.text(`$${data.totalAmount.toFixed(2)}`, 150, yPos);
  
  // Add notes if any
  if (data.notes) {
    yPos += 20;
    doc.setFontSize(14);
    doc.text("Notes:", 20, yPos);
    yPos += 8;
    doc.setFontSize(12);
    doc.text(data.notes, 20, yPos);
  }
  
  // Add payment information
  yPos += 20;
  doc.setFontSize(14);
  doc.text("Payment Information:", 20, yPos);
  yPos += 8;
  doc.setFontSize(12);
  doc.text(`Recipient Name: ${data.sendTo.recipientName}`, 20, yPos);
  yPos += 7;
  doc.text(`Recipient Address: ${data.sendTo.recipientAddress}`, 20, yPos);
  yPos += 7;
  doc.text(`Bank Name: ${data.sendTo.bankName}`, 20, yPos);
  yPos += 7;
  doc.text(`Bank Address: ${data.sendTo.bankAddress}`, 20, yPos);
  yPos += 7;
  doc.text(`Account #: ${data.sendTo.accountNumber}`, 20, yPos);
  yPos += 7;
  doc.text(`Routing #: ${data.sendTo.routingNumber}`, 20, yPos);
  yPos += 7;
  doc.text(`SWIFT Code #: ${data.sendTo.swiftCode}`, 20, yPos);
  
  // Get PDF as array buffer
  return new Uint8Array(doc.output('arraybuffer'));
}

function generateEmailHtml(data: InvoiceData, formattedDate: string): string {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        </style>
      </head>
      <body>
        <h1>Invoice ${data.invoiceNumber ? `#${data.invoiceNumber}` : ''}</h1>
        <p>Date: ${formattedDate}</p>
        
        <p>Dear Client,</p>
        
        <p>Please find attached the invoice${data.invoiceNumber ? ` #${data.invoiceNumber}` : ''} for services rendered.</p>
        
        <p>Total Amount: $${data.totalAmount.toFixed(2)}</p>
        
        <p>If you have any questions regarding this invoice, please don't hesitate to contact me.</p>
        
        <p>Best regards,<br>${data.sendTo.recipientName}</p>
      </body>
    </html>
  `;
}

serve(handler);
