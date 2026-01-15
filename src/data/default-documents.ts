import type { Document } from '../types';

// Default document checklist for N-400 application
export const DEFAULT_DOCUMENTS: Document[] = [
  {
    id: 'd1',
    name: 'Permanent Resident Card (Green Card)',
    status: 'missing',
    required: true,
    notes: 'Front & Back copy - Current card',
    meta: { expiry: '', issuer: 'USCIS', location: '' }
  },
  {
    id: 'd2',
    name: 'Driver\'s License / State ID',
    status: 'missing',
    required: true,
    notes: 'Current and valid government-issued photo ID',
    meta: { expiry: '', issuer: 'DMV', location: '' }
  },
  {
    id: 'd3',
    name: 'All Passports (Current & Expired)',
    status: 'missing',
    required: true,
    notes: 'All passports held during the statutory period',
    meta: { expiry: '', issuer: '', location: '' }
  },
  {
    id: 'd4',
    name: 'Marriage Certificate',
    status: 'missing',
    required: false,
    notes: 'If applying based on marriage to U.S. citizen',
    meta: { expiry: 'N/A', issuer: '', location: '' }
  },
  {
    id: 'd5',
    name: 'Divorce/Annulment Decrees',
    status: 'missing',
    required: false,
    notes: 'For all prior marriages (if applicable)',
    meta: { expiry: 'N/A', issuer: '', location: '' }
  },
  {
    id: 'd6',
    name: 'Tax Transcripts (5 Years)',
    status: 'missing',
    required: true,
    notes: 'IRS Form 1040 transcripts or returns for past 5 years',
    meta: { expiry: 'N/A', issuer: 'IRS', location: '' }
  },
  {
    id: 'd7',
    name: 'Employment History Records',
    status: 'missing',
    required: false,
    notes: 'W-2s, pay stubs, or letters from employers for past 5 years',
    meta: { expiry: 'N/A', issuer: '', location: '' }
  },
  {
    id: 'd8',
    name: 'Travel Records',
    status: 'missing',
    required: false,
    notes: 'Records of all trips outside the U.S. during statutory period',
    meta: { expiry: 'N/A', issuer: '', location: '' }
  },
  {
    id: 'd9',
    name: 'Address History',
    status: 'missing',
    required: false,
    notes: 'Documentation of all addresses for past 5 years',
    meta: { expiry: 'N/A', issuer: '', location: '' }
  },
  {
    id: 'd10',
    name: 'Court/Arrest Records',
    status: 'missing',
    required: false,
    notes: 'If applicable - certified copies of all records',
    meta: { expiry: 'N/A', issuer: '', location: '' }
  },
  {
    id: 'd11',
    name: 'Selective Service Registration',
    status: 'missing',
    required: false,
    notes: 'For males who were 18-25 in the U.S.',
    meta: { expiry: 'N/A', issuer: 'SSS', location: '' }
  },
  {
    id: 'd12',
    name: 'Child Support Documentation',
    status: 'missing',
    required: false,
    notes: 'If applicable - proof of compliance with support orders',
    meta: { expiry: 'N/A', issuer: '', location: '' }
  },
];

export default DEFAULT_DOCUMENTS;
