import { forwardRef } from 'react';

interface PremiumReceiptProps {
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

const PremiumReceipt = forwardRef<HTMLDivElement, PremiumReceiptProps>(
  (
    {
      invoiceNumber,
      purchaseDate,
      purchaserName,
      purchaserEmail,
      songTitle,
      artistName,
      artistContact,
      price,
      paymentMethod,
      transactionId,
    },
    ref
  ) => {
    const artistShare = Math.floor(price * 0.55);
    const platformShare = Math.floor(price * 0.45);

    return (
      <div
        ref={ref}
        className="bg-white text-black p-12"
        style={{
          width: '210mm',
          minHeight: '297mm',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-[#FF8C00]">
          <div>
            <img
              src="/ATEKERMUSICLOGO-FINAL.png"
              alt="Ateker Music"
              className="h-16 mb-3"
            />
            <h1 className="text-3xl font-bold text-[#FF8C00] mb-1">
              ATEKER MUSIC
            </h1>
            <p className="text-sm text-gray-600">
              Celebrating Eastern Uganda's Musical Heritage
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              SALES INVOICE / RECEIPT
            </h2>
            <p className="text-sm text-gray-600">
              Invoice #: <span className="font-semibold">{invoiceNumber}</span>
            </p>
            <p className="text-sm text-gray-600">
              Date:{' '}
              <span className="font-semibold">
                {purchaseDate.toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Time:{' '}
              <span className="font-semibold">
                {purchaseDate.toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
            </p>
          </div>
        </div>

        {/* Platform Information */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase">
            From:
          </h3>
          <div className="bg-gray-50 p-4 rounded">
            <p className="font-bold text-gray-800">Ateker Music Platform</p>
            <p className="text-sm text-gray-600">
              Operated by: YOGASWAM I.T SOLUTIONS
            </p>
            <p className="text-sm text-gray-600">
              Location: Soroti, Eastern Uganda
            </p>
            <p className="text-sm text-gray-600">
              Email: info@atekermusic.com
            </p>
            <p className="text-sm text-gray-600">
              Phone: +256 787 168666 / +256 757 566144
            </p>
            <p className="text-sm text-gray-600">
              Developer: Enocha Engulu (enochaengulu@gmail.com)
            </p>
          </div>
        </div>

        {/* Purchaser Information */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase">
            Bill To:
          </h3>
          <div className="bg-gray-50 p-4 rounded">
            <p className="font-bold text-gray-800">{purchaserName}</p>
            <p className="text-sm text-gray-600">Email: {purchaserEmail}</p>
            <p className="text-sm text-gray-600">
              Transaction ID: {transactionId}
            </p>
            <p className="text-sm text-gray-600">
              Payment Method: {paymentMethod}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#FF8C00] text-white">
                <th className="border border-gray-300 px-4 py-3 text-left">
                  Description
                </th>
                <th className="border border-gray-300 px-4 py-3 text-right">
                  Quantity
                </th>
                <th className="border border-gray-300 px-4 py-3 text-right">
                  Unit Price (UGX)
                </th>
                <th className="border border-gray-300 px-4 py-3 text-right">
                  Total (UGX)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-3">
                  <p className="font-semibold text-gray-800">{songTitle}</p>
                  <p className="text-sm text-gray-600">Artist: {artistName}</p>
                  <p className="text-xs text-gray-500">
                    Premium Music Download License
                  </p>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-right">
                  1
                </td>
                <td className="border border-gray-300 px-4 py-3 text-right">
                  {price.toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-right font-semibold">
                  {price.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="flex justify-between py-2 border-b border-gray-300">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold">UGX {price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-300">
              <span className="text-gray-700">Tax/VAT:</span>
              <span className="font-semibold">UGX 0</span>
            </div>
            <div className="flex justify-between py-3 bg-[#FF8C00] text-white px-4 rounded mt-2">
              <span className="font-bold text-lg">TOTAL PAID:</span>
              <span className="font-bold text-lg">
                UGX {price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Revenue Split Information */}
        <div className="mb-8 bg-orange-50 p-4 rounded border border-[#FF8C00]">
          <h3 className="font-bold text-gray-800 mb-3">
            Revenue Distribution:
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Artist Share (55%):</p>
              <p className="font-semibold text-green-600">
                UGX {artistShare.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Paid to: {artistName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Platform Share (45%):</p>
              <p className="font-semibold text-[#FF8C00]">
                UGX {platformShare.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Hosting, operations & payment processing
              </p>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mb-6 border-t-2 border-gray-300 pt-6">
          <h3 className="font-bold text-gray-800 mb-3 text-center text-lg">
            LICENSE TERMS & CONDITIONS
          </h3>

          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <p className="font-semibold text-gray-800 mb-1">
                1. LICENSE GRANT
              </p>
              <p className="leading-relaxed">
                This receipt confirms your purchase of a{' '}
                <strong>Personal Use License</strong> for the music file "{songTitle}
                " by {artistName}. You are granted a non-exclusive,
                non-transferable, perpetual license to download, store, and
                enjoy this music for <strong>personal, non-commercial use only</strong>.
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-800 mb-1">
                2. USAGE RESTRICTIONS
              </p>
              <p className="leading-relaxed">
                You are <strong>strictly prohibited</strong> from:
              </p>
              <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                <li>
                  Distributing, sharing, or making this music available to the
                  public (including but not limited to social media, file-sharing
                  platforms, or streaming services)
                </li>
                <li>
                  Using this music for commercial purposes, including but not
                  limited to advertisements, promotional videos, podcasts,
                  YouTube videos, films, or any revenue-generating activities
                </li>
                <li>
                  Reselling, sublicensing, or transferring this music to any
                  third party
                </li>
                <li>
                  Modifying, remixing, or creating derivative works without
                  explicit written permission from the artist
                </li>
                <li>
                  Claiming ownership or authorship of this music
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-gray-800 mb-1">
                3. COMMERCIAL USE LICENSE
              </p>
              <p className="leading-relaxed">
                If you wish to use this music for <strong>commercial purposes</strong>,
                you <strong>MUST</strong> obtain a separate Commercial Use License by
                contacting:
              </p>
              <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                <li>
                  <strong>The Artist Directly:</strong> {artistName}
                  {artistContact && ` (${artistContact})`} - Contact information
                  available on the artist's profile at www.atekermusic.com
                </li>
                <li>
                  <strong>Ateker Music Platform:</strong> info@atekermusic.com |
                  +256 787 168666 / +256 757 566144
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-gray-800 mb-1">
                4. COPYRIGHT & OWNERSHIP
              </p>
              <p className="leading-relaxed">
                All rights, title, and interest in and to the music, including
                all copyrights, remain the exclusive property of the artist (
                {artistName}). This purchase does not transfer any ownership
                rights to you.
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-800 mb-1">
                5. VIOLATION & ENFORCEMENT
              </p>
              <p className="leading-relaxed">
                Unauthorized distribution, public sharing, or commercial use of
                this music constitutes copyright infringement and may result in:
              </p>
              <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                <li>
                  Immediate termination of your license and account suspension
                </li>
                <li>Legal action under Ugandan Copyright Law</li>
                <li>
                  Financial damages and penalties as determined by law
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-gray-800 mb-1">
                6. NO REFUNDS
              </p>
              <p className="leading-relaxed">
                All sales are final. Refunds are only provided in cases of
                technical errors that prevent download. Refund requests must be
                submitted within 7 days of purchase to info@atekermusic.com.
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-800 mb-1">
                7. ACKNOWLEDGMENT
              </p>
              <p className="leading-relaxed">
                By completing this purchase, you acknowledge that you have read,
                understood, and agree to be bound by these terms and conditions.
                You confirm that you will use this music solely for personal,
                non-commercial purposes and will not distribute it to the public
                in any form.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-[#FF8C00] pt-4 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Thank you for supporting {artistName} and Ateker Music!
          </p>
          <p className="text-xs text-gray-500">
            This is a computer-generated receipt and does not require a physical
            signature.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            For inquiries, contact: info@atekermusic.com | +256 787 168666 /
            +256 757 566144
          </p>
          <p className="text-xs text-gray-500 mt-1">
            www.atekermusic.com | Made with ❤️ by YOGASWAM I.T SOLUTIONS
          </p>
        </div>
      </div>
    );
  }
);

PremiumReceipt.displayName = 'PremiumReceipt';

export default PremiumReceipt;
