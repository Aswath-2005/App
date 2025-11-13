
import React, { useState } from 'react';
import { ScanResult, Verdict, ReportPayload } from '../types';
import CheckCircleIcon from './icons/CheckCircleIcon';
import ExclamationTriangleIcon from './icons/ExclamationTriangleIcon';
import ArrowUpTrayIcon from './icons/ArrowUpTrayIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';

interface ResultViewProps {
  result: ScanResult;
  onReport: (payload: ReportPayload) => Promise<{ success: boolean; message: string }>;
  onReset: () => void;
}

const getVerdictStyles = (verdict: Verdict) => {
  switch (verdict) {
    case Verdict.Authentic:
      return {
        bgColor: 'bg-emerald-100',
        textColor: 'text-emerald-800',
        progressColor: 'bg-emerald-500',
        Icon: <CheckCircleIcon className="w-16 h-16 text-emerald-500" />,
      };
    case Verdict.Counterfeit:
      return {
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        progressColor: 'bg-red-500',
        Icon: <ExclamationTriangleIcon className="w-16 h-16 text-red-500" />,
      };
    case Verdict.Suspicious:
    default:
      return {
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-800',
        progressColor: 'bg-amber-500',
        Icon: <ExclamationTriangleIcon className="w-16 h-16 text-amber-500" />,
      };
  }
};

const ResultView: React.FC<ResultViewProps> = ({ result, onReport, onReset }) => {
  const [showReportForm, setShowReportForm] = useState(false);
  const [comments, setComments] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [isReporting, setIsReporting] = useState(false);
  const [reportMessage, setReportMessage] = useState('');

  const { bgColor, textColor, progressColor, Icon } = getVerdictStyles(result.verdict);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsReporting(true);
    setReportMessage('');
    const res = await onReport({
      productId: result.productId,
      comments,
      photos,
    });
    setReportMessage(res.message);
    setIsReporting(false);
    if (res.success) {
      setTimeout(() => {
        setShowReportForm(false);
        setComments('');
        setPhotos([]);
      }, 3000);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="relative p-6">
            <button onClick={onReset} className="absolute top-4 left-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
                <ChevronLeftIcon className="w-6 h-6 text-gray-600"/>
            </button>
            <div className={`p-6 rounded-lg ${bgColor} mt-10`}>
                <div className="flex flex-col items-center text-center">
                    {Icon}
                    <h2 className={`mt-4 text-3xl font-bold ${textColor}`}>{result.verdict}</h2>
                </div>
            </div>
        </div>

      <div className="p-6">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-brand-dark">{result.productName}</h3>
          <p className="text-sm text-gray-500">Product ID: {result.productId}</p>
          <img src={result.imageUrl} alt={result.productName} className="w-48 h-48 mx-auto mt-4 rounded-lg shadow-md object-cover" />
        </div>

        <div className="mt-6">
          <h4 className="font-semibold text-gray-700">Confidence Score: {result.confidence}%</h4>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className={`${progressColor} h-2.5 rounded-full`} style={{ width: `${result.confidence}%` }}></div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold text-gray-700">Analysis:</h4>
          <ul className="mt-2 space-y-2">
            {result.reasons.map((reason, index) => (
              <li key={index} className="flex items-start">
                <span className="text-sm text-gray-600">&#8226;&nbsp;{reason}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {result.verdict !== Verdict.Authentic && !showReportForm && (
             <button onClick={() => setShowReportForm(true)} className="w-full mt-8 py-3 text-lg font-bold text-white bg-brand-primary rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-transform transform hover:scale-105">
                Report Suspicious Product
            </button>
        )}
        
        {showReportForm && (
            <div className="mt-8 pt-6 border-t">
                <h3 className="text-xl font-semibold text-center text-brand-dark">Report Product</h3>
                <form onSubmit={handleReportSubmit} className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="comments" className="block text-sm font-medium text-gray-700">Comments</label>
                        <textarea 
                            id="comments"
                            rows={3} 
                            value={comments} 
                            onChange={(e) => setComments(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
                            placeholder="e.g., The packaging feels cheap, the smell is off..."
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Upload Photos (optional)</label>
                        <label htmlFor="photo-upload" className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-brand-primary">
                            <div className="space-y-1 text-center">
                                <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <p className="pl-1">{photos.length > 0 ? `${photos.length} file(s) selected` : 'Click to upload'}</p>
                                </div>
                            </div>
                            <input id="photo-upload" type="file" multiple className="sr-only" onChange={handleFileSelect} />
                        </label>
                    </div>

                    <button type="submit" disabled={isReporting} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-secondary hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary disabled:bg-gray-400">
                        {isReporting ? 'Submitting...' : 'Submit Report'}
                    </button>
                </form>
                {reportMessage && <p className="mt-4 text-center text-sm font-medium text-green-700">{reportMessage}</p>}
            </div>
        )}
      </div>
    </div>
  );
};

export default ResultView;