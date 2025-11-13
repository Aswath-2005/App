
import React, { useState } from 'react';
import CameraIcon from './icons/CameraIcon';

interface ScannerViewProps {
  onScan: (code: string) => void;
}

const ScannerView: React.FC<ScannerViewProps> = ({ onScan }) => {
  const [manualCode, setManualCode] = useState('');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onScan(manualCode.trim());
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      // In a real app, you would use a library to decode the QR/barcode from the image.
      // Here, we'll simulate it by using a known "counterfeit" code.
      alert('Image selected! Simulating scan of a counterfeit medicine (Code: 1234567890123).');
      onScan('1234567890123');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-brand-dark">Is it Genuine?</h1>
        <p className="mt-2 text-lg text-gray-600">
          Scan the barcode or QR code on your medicine packaging to verify its authenticity instantly.
        </p>

        <div className="mt-12">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer w-full flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-brand-primary rounded-xl shadow-lg hover:bg-sky-50 transition-colors"
          >
            <CameraIcon className="w-16 h-16 text-brand-primary" />
            <span className="mt-4 text-xl font-semibold text-brand-primary">Scan with Camera</span>
            <span className="mt-1 text-sm text-gray-500">(Tap to upload an image)</span>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>

        <div className="relative my-10 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleManualSubmit} className="space-y-4">
          <p className="text-gray-600">Enter code manually:</p>
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="e.g., 8900000000125"
            className="w-full px-4 py-3 text-lg text-center border-2 border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary transition"
          />
          <button
            type="submit"
            className="w-full py-3 text-lg font-bold text-white bg-brand-primary rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-transform transform hover:scale-105"
          >
            Verify Code
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScannerView;