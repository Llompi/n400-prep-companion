import type { AppData, TimelineEvent, CivicsQuestion, Document, UserSettings, NotesStore, MasteryStore } from '../../types';
import {
  getAllEvents,
  getAllQuestions,
  getAllDocuments,
  getMastery,
  getNotes,
  getSettings,
  saveAllEvents,
  saveAllQuestions,
  saveAllDocuments,
  saveAllMastery,
  saveAllNotes,
  saveSettings,
} from './db';
import { CIVICS_QUESTIONS } from '../../data/civics-2008';
import { DEFAULT_DOCUMENTS } from '../../data/default-documents';

const APP_VERSION = '0.1.0';

// Validation helpers
function isValidEvent(event: unknown): event is TimelineEvent {
  if (!event || typeof event !== 'object') return false;
  const e = event as Record<string, unknown>;
  return (
    typeof e.id === 'string' &&
    typeof e.date === 'string' &&
    typeof e.type === 'string' &&
    typeof e.title === 'string'
  );
}

function isValidQuestion(question: unknown): question is CivicsQuestion {
  if (!question || typeof question !== 'object') return false;
  const q = question as Record<string, unknown>;
  return (
    typeof q.id === 'number' &&
    typeof q.q === 'string' &&
    typeof q.a === 'string' &&
    typeof q.section === 'string'
  );
}

function isValidDocument(doc: unknown): doc is Document {
  if (!doc || typeof doc !== 'object') return false;
  const d = doc as Record<string, unknown>;
  return (
    typeof d.id === 'string' &&
    typeof d.name === 'string' &&
    typeof d.status === 'string' &&
    typeof d.required === 'boolean'
  );
}

function isValidSettings(settings: unknown): settings is UserSettings {
  if (!settings || typeof settings !== 'object') return false;
  const s = settings as Record<string, unknown>;
  return typeof s.name === 'string';
}

// Export all data to JSON
export async function exportAllData(): Promise<AppData> {
  const [events, questions, docs, mastery, notes, settings] = await Promise.all([
    getAllEvents(),
    getAllQuestions(),
    getAllDocuments(),
    getMastery(),
    getNotes(),
    getSettings(),
  ]);

  return {
    events: events || [],
    questions: questions.length > 0 ? questions : CIVICS_QUESTIONS,
    docs: docs.length > 0 ? docs : DEFAULT_DOCUMENTS,
    mastery: mastery || {},
    notes: notes || {},
    settings: settings || { name: 'Applicant' },
    version: APP_VERSION,
    exportedAt: new Date().toISOString(),
  };
}

// Download data as JSON file
export async function downloadBackup(filename?: string): Promise<void> {
  const data = await exportAllData();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `n400-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import data from JSON
export async function importData(jsonString: string): Promise<{ success: boolean; message: string }> {
  try {
    const data = JSON.parse(jsonString) as Partial<AppData>;

    // Validate and import events
    if (data.events && Array.isArray(data.events)) {
      const validEvents = data.events.filter(isValidEvent);
      if (validEvents.length > 0) {
        await saveAllEvents(validEvents);
      }
    }

    // Validate and import questions
    if (data.questions && Array.isArray(data.questions)) {
      const validQuestions = data.questions.filter(isValidQuestion);
      if (validQuestions.length > 0) {
        await saveAllQuestions(validQuestions);
      }
    }

    // Validate and import documents
    if (data.docs && Array.isArray(data.docs)) {
      const validDocs = data.docs.filter(isValidDocument);
      if (validDocs.length > 0) {
        await saveAllDocuments(validDocs);
      }
    }

    // Import mastery (simple object validation)
    if (data.mastery && typeof data.mastery === 'object') {
      const validMastery: MasteryStore = {};
      for (const [key, value] of Object.entries(data.mastery)) {
        const numKey = Number(key);
        if (!isNaN(numKey) && value === true) {
          validMastery[numKey] = true;
        }
      }
      await saveAllMastery(validMastery);
    }

    // Import notes (simple object validation)
    if (data.notes && typeof data.notes === 'object') {
      const validNotes: NotesStore = {};
      for (const [key, value] of Object.entries(data.notes)) {
        if (typeof key === 'string' && typeof value === 'string') {
          validNotes[key] = value;
        }
      }
      await saveAllNotes(validNotes);
    }

    // Import settings
    if (data.settings && isValidSettings(data.settings)) {
      await saveSettings(data.settings);
    }

    return { success: true, message: 'Data imported successfully' };
  } catch (error) {
    console.error('Import error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to parse import file',
    };
  }
}

// Read file and import
export async function importFromFile(file: File): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      const content = event.target?.result;
      if (typeof content !== 'string') {
        resolve({ success: false, message: 'Failed to read file' });
        return;
      }
      const result = await importData(content);
      resolve(result);
    };

    reader.onerror = () => {
      resolve({ success: false, message: 'Error reading file' });
    };

    reader.readAsText(file);
  });
}
