import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Song, supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Download, FileText, Printer, CreditCard } from 'lucide-react';
import PremiumReceipt from './PremiumReceipt';
import { generateInvoiceNumber, generateTransactionId, downloadReceiptAsPDF, printReceipt, type ReceiptData } from '@/lib/receiptUtils';

interface PremiumPurchaseDialogProps {
  song: Song;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PremiumPurchaseDialog({ song, open, onOpenChange }: PremiumPurchaseDialogProps) {
  const { profile } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<string>('mtn');
  const [processing, setProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const artistShare = Math.floor((song.premium_price || 0) * 0.55);
  const platformShare = Math.floor((song.premium_price || 0) * 0.45);

  const handlePurchase = async () => {
    if (!profile) {
      toast.error('Please log in to purchase premium music');
      return;
    }

    setProcessing(true);

    try {
      // Simulate payment processing (replace with actual payment gateway integration)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate receipt data
      const receipt: ReceiptData = {
        invoiceNumber: generateInvoiceNumber(),
        purchaseDate: new Date(),
        purchaserName: profile.display_name || profile.email || 'Unknown',
        purchaserEmail: profile.email || '',
        songTitle: song.title,
        artistName: song.artist?.display_name || 'Unknown Artist',
        artistContact: song.artist?.email,
        price: song.premium_price || 0,
        paymentMethod: paymentMethod === 'mtn' ? 'MTN Mobile Money' : paymentMethod === 'airtel' ? 'Airtel Money' : 'Card Payment',
        transactionId: generateTransactionId(),
      };

      setReceiptData(receipt);

      // Track download
      await supabase.rpc('increment_downloads', { song_id: song.id });

      // Download the song
      if (song.mp3_url) {
        const link = document.createElement('a');
        link.href = song.mp3_url;
        link.download = `${song.title} - ${song.artist?.display_name || 'Unknown'}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Show receipt
      setShowReceipt(true);
      toast.success('Purchase successful! Your song is downloading...');
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadReceipt = async () => {
    if (!receiptRef.current || !receiptData) return;

    try {
      const filename = `Ateker_Music_Receipt_${receiptData.invoiceNumber}.pdf`;
      await downloadReceiptAsPDF(receiptRef.current, filename);
      toast.success('Receipt downloaded successfully!');
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast.error('Failed to download receipt');
    }
  };

  const handlePrintReceipt = () => {
    if (!receiptRef.current) return;

    try {
      printReceipt(receiptRef.current);
    } catch (error) {
      console.error('Error printing receipt:', error);
      toast.error('Failed to print receipt');
    }
  };

  const handleClose = () => {
    setShowReceipt(false);
    setReceiptData(null);
    onOpenChange(false);
  };

  if (showReceipt && receiptData) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Purchase Successful!</DialogTitle>
            <DialogDescription>
              Your receipt is ready. Download or print it for your records.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4">
            <PremiumReceipt ref={receiptRef} {...receiptData} />
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handlePrintReceipt}>
              <Printer className="w-4 h-4 mr-2" />
              Print Receipt
            </Button>
            <Button variant="outline" onClick={handleDownloadReceipt}>
              <FileText className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={handleClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase Premium Music</DialogTitle>
          <DialogDescription>
            Complete your purchase to download "{song.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Song Details */}
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-semibold text-card-foreground">{song.title}</p>
            <p className="text-sm text-muted-foreground">
              by {song.artist?.display_name || 'Unknown Artist'}
            </p>
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Price:</span>
                <span className="font-bold text-lg text-primary">
                  UGX {(song.premium_price || 0).toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Artist receives (55%):</span>
                  <span className="text-green-600 dark:text-green-400 font-semibold">
                    UGX {artistShare.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Platform fee (45%):</span>
                  <span>UGX {platformShare.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <Label>Select Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-muted cursor-pointer">
                <RadioGroupItem value="mtn" id="mtn" />
                <Label htmlFor="mtn" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-yellow-600" />
                    <span>MTN Mobile Money</span>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-muted cursor-pointer">
                <RadioGroupItem value="airtel" id="airtel" />
                <Label htmlFor="airtel" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-red-600" />
                    <span>Airtel Money</span>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-muted cursor-pointer">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Credit/Debit Card</span>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Notice */}
          <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg border border-primary/20">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> Payment integration is coming soon. This is a demo
              of the purchase flow and receipt generation.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>
            Cancel
          </Button>
          <Button onClick={handlePurchase} disabled={processing}>
            {processing ? (
              <>Processing...</>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Purchase & Download
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
