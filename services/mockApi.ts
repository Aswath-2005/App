import { ScanResult, Verdict, ReportPayload } from '../types';

// Mock Database of products
const mockProductDatabase: { [key: string]: ScanResult } = {
  // Authentic Products from user list - confidence updated to >= 99
  '8900000000101': {
    verdict: Verdict.Authentic,
    confidence: 99,
    productName: 'Calpol 500 Tablet',
    productId: 'CAL-500-A1',
    reasons: ['Batch number verified with manufacturer records.', 'QR code links to official GSK product page.', 'Packaging hologram is valid.'],
    imageUrl: 'https://picsum.photos/seed/CAL-500/400/400',
  },
  '8900000000118': {
    verdict: Verdict.Authentic,
    confidence: 99,
    productName: 'Sumo L 650 Tablet',
    productId: 'SUMO-650-B2',
    reasons: ['Verified purchase from authorized pharmacy chain.', 'Product registered with National Drug Authority.', 'Security seal is intact and valid.'],
    imageUrl: 'https://picsum.photos/seed/SUMO-650/400/400',
  },
  '8900000000125': {
    verdict: Verdict.Authentic,
    confidence: 100,
    productName: 'Dolo 650 Tablet',
    productId: 'DOLO-650-C3',
    reasons: ['Authenticity confirmed via central drug database.', 'Batch details match manufacturing logs.', 'Foil strip printing is consistent with genuine samples.'],
    imageUrl: 'https://picsum.photos/seed/DOLO-650/400/400',
  },
  '8900000000132': {
    verdict: Verdict.Authentic,
    confidence: 99,
    productName: 'Pacimol 500mg Tablet',
    productId: 'PAC-500-D4',
    reasons: ['Batch number verified in official records.', 'QR code links to official product page.'],
    imageUrl: 'https://picsum.photos/seed/PAC-500/400/400',
  },
  '8900000000149': {
    verdict: Verdict.Authentic,
    confidence: 99,
    productName: 'Brufen Tablet 200mg',
    productId: 'BRU-200-E5',
    reasons: ['Authenticity seal is valid.', 'Product registered with authorized retailers.'],
    imageUrl: 'https://picsum.photos/seed/BRU-200/400/400',
  },
  '8900000000156': {
    verdict: Verdict.Authentic,
    confidence: 100,
    productName: 'Brufen Tablet 400mg',
    productId: 'BRU-400-F6',
    reasons: ['Holographic sticker is present and correct.', 'Batch number is valid.'],
    imageUrl: 'https://picsum.photos/seed/BRU-400/400/400',
  },
  '8900000000163': {
    verdict: Verdict.Authentic,
    confidence: 99,
    productName: 'IBUgesic Tablet 400mg',
    productId: 'IBU-400-G7',
    reasons: ['Batch number verified in official records.', 'Packaging details match authentic samples.'],
    imageUrl: 'https://picsum.photos/seed/IBU-400/400/400',
  },
   '8900000000170': {
    verdict: Verdict.Authentic,
    confidence: 99,
    productName: 'Ibuprofen 400 mg Tablet (Generic)',
    productId: 'IBU-GEN-400-H8',
    reasons: ['Verified generic manufacturer.', 'Passes all quality control checks.'],
    imageUrl: 'https://picsum.photos/seed/IBU-GEN-400/400/400',
  },
  '8900000000187': {
    verdict: Verdict.Authentic,
    confidence: 100,
    productName: 'Ecosprin Tablet 75mg',
    productId: 'ECO-75-I9',
    reasons: ['Authenticity seal is valid.', 'Product registered with authorized retailers.'],
    imageUrl: 'https://picsum.photos/seed/ECO-75/400/400',
  },
  '8900000000194': {
    verdict: Verdict.Authentic,
    confidence: 99,
    productName: 'Loprin Tablet 75mg',
    productId: 'LOP-75-J1',
    reasons: ['Batch number is valid.', 'Packaging hologram is correct.'],
    imageUrl: 'https://picsum.photos/seed/LOP-75/400/400',
  },
  '8900000000200': {
    verdict: Verdict.Authentic,
    confidence: 99,
    productName: 'Loprin Tablet 150mg',
    productId: 'LOP-150-K2',
    reasons: ['Batch number is valid.', 'Packaging hologram is correct.'],
    imageUrl: 'https://picsum.photos/seed/LOP-150/400/400',
  },
  '8900000000217': {
    verdict: Verdict.Authentic,
    confidence: 99,
    productName: 'Aspidot Tablet 75mg',
    productId: 'ASP-75-L3',
    reasons: ['Registered with National Drug Authority.', 'Security seal is intact.'],
    imageUrl: 'https://picsum.photos/seed/ASP-75/400/400',
  },
  '8900000000224': {
    verdict: Verdict.Authentic,
    confidence: 99,
    productName: 'Naprosyn Tablet',
    productId: 'NPR-VAR-M4',
    reasons: [
      'Barcode now registered in our primary database.',
      'Verified with manufacturer records.',
    ],
    imageUrl: 'https://picsum.photos/seed/NPR-VAR/400/400',
  },
  '8900000000231': {
    verdict: Verdict.Authentic,
    confidence: 99,
    productName: 'Naproma-D 500 Tablet',
    productId: 'NPD-500-N5',
    reasons: ['Batch number verified.', 'Official QR code link.'],
    imageUrl: 'https://picsum.photos/seed/NPD-500/400/400',
  },
  '8900000000248': {
    verdict: Verdict.Authentic,
    confidence: 99,
    productName: 'Arthopan Tablet',
    productId: 'ART-PAN-O6',
    reasons: ['Hologram is valid.', 'Registered with pharmacy council.'],
    imageUrl: 'https://picsum.photos/seed/ART-PAN/400/400',
  },

  // Counterfeit Example
  '1234567890123': {
    verdict: Verdict.Counterfeit,
    confidence: 94,
    productName: 'Dolo 650 Tablet (Counterfeit)',
    productId: 'DOLO-650-FAKE',
    reasons: [
      'QR code leads to a broken or non-official website.',
      'Batch number is invalid and not found in manufacturer records.',
      'Tablet color and texture are inconsistent with genuine product.',
      'Spelling errors found on the packaging.',
    ],
    imageUrl: 'https://picsum.photos/seed/DOLO-650-FAKE/400/400',
  },
  // Suspicious Example for a different product
  '9876543210987': {
    verdict: Verdict.Suspicious,
    confidence: 55,
    productName: 'Flexon Tablet',
    productId: 'FLX-VAR-P7',
    reasons: [
      'Barcode not yet registered in our primary database.',
      'Could be a new product batch or an unrecognized import.',
      'Advise caution and purchase from trusted sources.',
    ],
    imageUrl: 'https://picsum.photos/seed/FLX-VAR/400/400',
  },
};

export const scanCode = (code: string): Promise<ScanResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (mockProductDatabase[code]) {
        resolve(mockProductDatabase[code]);
      } else {
        // Generic "not found" response
        resolve({
          verdict: Verdict.Suspicious,
          confidence: 45,
          productName: 'Unknown Medicine',
          productId: 'N/A',
          reasons: [
            'Product code not found in our central database.',
            'Could be a new, unlisted medicine or a potential counterfeit.',
            'Please verify purchase from an authorized pharmacy.',
          ],
          imageUrl: 'https://picsum.photos/seed/unknown-med/400/400',
        });
      }
    }, 1500 + Math.random() * 1000); // Simulate network latency
  });
};

export const reportSuspiciousProduct = (payload: ReportPayload): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('--- REPORT SUBMITTED ---');
      console.log('Product ID:', payload.productId);
      console.log('Comments:', payload.comments);
      console.log('Photos:', payload.photos.map(p => p.name).join(', '));
      console.log('------------------------');
      resolve({ success: true, message: 'Report submitted successfully. Thank you for your help!' });
    }, 1000);
  });
};