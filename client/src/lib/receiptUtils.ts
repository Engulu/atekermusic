import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface ReceiptData {
  invoiceNumber: string;
  purchaseDate: Date;
  purchaserName: string;
  purchaserEmail: string;
  songTitle: string;
  artistName: string;
  artistContact?: string;
  price: number;
  paymentMethod: string;
  transactionId: string;
}

/**
 * Generate a unique invoice number
 */
export function generateInvoiceNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `ATK-${timestamp}-${random}`;
}

/**
 * Generate transaction ID
 */
export function generateTransactionId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0');
  return `TXN${timestamp}${random}`;
}

/**
 * Download receipt as PDF
 */
export async function downloadReceiptAsPDF(
  element: HTMLElement,
  filename: string
): Promise<void> {
  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Calculate PDF dimensions (A4: 210mm x 297mm)
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Download PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF receipt');
  }
}

/**
 * View receipt in new window (for printing)
 */
export function printReceipt(element: HTMLElement): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Failed to open print window');
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Ateker Music - Receipt</title>
        <style>
          @page {
            size: A4;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  // Wait for content to load before printing
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

/**
 * Save receipt data to Supabase
 */
export async function saveReceiptToDatabase(
  receiptData: ReceiptData,
  userId: string,
  songId: string
): Promise<void> {
  // This function will be implemented when integrating with Supabase
  // For now, it's a placeholder
  console.log('Saving receipt to database:', {
    receiptData,
    userId,
    songId,
  });
}
