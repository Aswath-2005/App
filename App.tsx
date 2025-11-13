
import React, { useState, useCallback } from 'react';
import { AppView, ScanResult, ReportPayload } from './types';
import { scanCode, reportSuspiciousProduct } from './services/mockApi';
import ScannerView from './components/ScannerView';
import ResultView from './components/ResultView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.Scanner);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = useCallback(async (code: string) => {
    setCurrentView(AppView.Loading);
    setError(null);
    try {
      const result = await scanCode(code);
      setScanResult(result);
      setCurrentView(AppView.Result);
    } catch (err) {
      setError('Failed to get scan results. Please try again.');
      setCurrentView(AppView.Scanner);
    }
  }, []);
  
  const handleReport = useCallback(async (payload: ReportPayload) => {
    try {
        return await reportSuspiciousProduct(payload);
    } catch (err) {
        return { success: false, message: 'Failed to submit report. Please try again.' };
    }
  }, []);

  const resetView = useCallback(() => {
    setCurrentView(AppView.Scanner);
    setScanResult(null);
    setError(null);
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case AppView.Scanner:
        return <ScannerView onScan={handleScan} />;
      case AppView.Loading:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-primary"></div>
            <p className="mt-4 text-lg font-semibold text-brand-dark">Authenticating...</p>
          </div>
        );
      case AppView.Result:
        if (scanResult) {
          return <ResultView result={scanResult} onReport={handleReport} onReset={resetView} />;
        }
        // Fallback in case of invalid state
        resetView();
        return null; 
      default:
        return <ScannerView onScan={handleScan} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center font-sans">
      <main className="w-full max-w-md p-4 sm:p-0">
          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              <span className="font-medium">Error!</span> {error}
            </div>
          )}
          {renderContent()}
      </main>
    </div>
  );
};

export default App;