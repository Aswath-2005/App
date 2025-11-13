
export enum Verdict {
  Authentic = 'Authentic',
  Counterfeit = 'Likely Counterfeit',
  Suspicious = 'Suspicious',
}

export interface ScanResult {
  verdict: Verdict;
  confidence: number; // 0 to 100
  productName: string;
  productId: string;
  reasons: string[];
  imageUrl: string;
}

export enum AppView {
  Scanner,
  Loading,
  Result,
}

export interface ReportPayload {
  productId: string;
  comments: string;
  photos: File[];
}
