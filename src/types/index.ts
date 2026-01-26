// Timeline Event Types
export type EventType = 'address' | 'employment' | 'trip' | 'tax' | 'legal' | 'other' | string;

// Custom event category definition
export interface EventCategory {
  id: string;
  label: string;
  color: string; // Tailwind color class prefix (e.g., 'purple', 'green', 'blue')
}

// Default event categories
export const DEFAULT_EVENT_CATEGORIES: EventCategory[] = [
  { id: 'address', label: 'Address', color: 'green' },
  { id: 'employment', label: 'Employment', color: 'blue' },
  { id: 'trip', label: 'Travel', color: 'purple' },
  { id: 'tax', label: 'Tax', color: 'amber' },
  { id: 'legal', label: 'Legal', color: 'red' },
  { id: 'other', label: 'Other', color: 'slate' },
];

export interface TimelineEvent {
  id: string;
  date: string;
  endDate?: string;
  type: EventType;
  title: string;
  desc?: string;
  linkedDocIds?: string[];  // Array of document IDs linked to this event
  evidenceLink?: string;
  /** @deprecated Use linkedDocIds instead. Kept for migration compatibility. */
  evidenceRef?: string;
}

// Civics Questions
export interface CivicsQuestion {
  id: number;
  q: string;
  a: string;
  section: string;
}

// Document Types
export type DocumentStatus = 'missing' | 'found' | 'copied' | 'uploaded' | 'packed';

export interface DocumentMeta {
  expiry?: string;
  issuer?: string;
  location?: string;
}

export interface Document {
  id: string;
  name: string;
  status: DocumentStatus;
  required: boolean;
  notes?: string;
  meta: DocumentMeta;
  parentId?: string; // For sub-documents/grouping
  isCustom?: boolean; // User-added documents
  submittedToUSCIS?: boolean; // Scanned and submitted electronically to USCIS
}

// User Settings
export interface UserSettings {
  name: string;
  arrivalDate?: string;
  greenCardDate?: string;
  filingDate?: string;
  interviewDate?: string;
  darkMode?: boolean;
  eventCategories?: EventCategory[]; // Custom event categories
  alienNumber?: string; // USCIS Alien Registration Number (A-Number)
  alienNumberBlurred?: boolean; // Whether A-Number is blurred in UI
}

// Notes store - keyed by entity ID
export type NotesStore = Record<string, string>;

// Mastery tracking - keyed by question ID
export type MasteryStore = Record<number, boolean>;

// Complete App Data for export/import
export interface AppData {
  events: TimelineEvent[];
  questions: CivicsQuestion[];
  docs: Document[];
  mastery: MasteryStore;
  notes: NotesStore;
  settings: UserSettings;
  version: string;
  exportedAt: string;
}

// Tab navigation
export type TabId = 'dashboard' | 'timeline' | 'study' | 'docs' | 'settings';

// Icon names for type safety
export type IconName =
  | 'flag'
  | 'layout-dashboard'
  | 'calendar-days'
  | 'book-open'
  | 'folder-check'
  | 'settings'
  | 'alert-circle'
  | 'x-circle'
  | 'file-warning'
  | 'plus-circle'
  | 'plus'
  | 'trash-2'
  | 'folder'
  | 'link'
  | 'alert-triangle'
  | 'paperclip'
  | 'x'
  | 'check-circle'
  | 'arrow-left'
  | 'arrow-right'
  | 'check'
  | 'circle'
  | 'rotate-ccw'
  | 'download'
  | 'upload'
  | 'message-square'
  | 'chevron-down'
  | 'chevron-up'
  | 'more-horizontal'
  | 'moon'
  | 'sun'
  | 'folder-plus'
  | 'pencil'
  | 'printer'
  | 'calendar';
