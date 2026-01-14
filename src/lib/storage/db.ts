import { openDB, type IDBPDatabase, type DBSchema } from 'idb';
import type {
  TimelineEvent,
  CivicsQuestion,
  Document,
  UserSettings,
  NotesStore,
  MasteryStore,
} from '../../types';

// Database schema definition
interface N400DB extends DBSchema {
  events: {
    key: string;
    value: TimelineEvent;
    indexes: { 'by-date': string };
  };
  questions: {
    key: number;
    value: CivicsQuestion;
    indexes: { 'by-section': string };
  };
  documents: {
    key: string;
    value: Document;
  };
  mastery: {
    key: number;
    value: { id: number; mastered: boolean };
  };
  notes: {
    key: string;
    value: { id: string; content: string };
  };
  settings: {
    key: string;
    value: UserSettings;
  };
}

const DB_NAME = 'n400-prep-companion';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<N400DB>> | null = null;

export async function getDB(): Promise<IDBPDatabase<N400DB>> {
  if (!dbPromise) {
    dbPromise = openDB<N400DB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Events store
        if (!db.objectStoreNames.contains('events')) {
          const eventStore = db.createObjectStore('events', { keyPath: 'id' });
          eventStore.createIndex('by-date', 'date');
        }

        // Questions store
        if (!db.objectStoreNames.contains('questions')) {
          const questionStore = db.createObjectStore('questions', { keyPath: 'id' });
          questionStore.createIndex('by-section', 'section');
        }

        // Documents store
        if (!db.objectStoreNames.contains('documents')) {
          db.createObjectStore('documents', { keyPath: 'id' });
        }

        // Mastery store
        if (!db.objectStoreNames.contains('mastery')) {
          db.createObjectStore('mastery', { keyPath: 'id' });
        }

        // Notes store
        if (!db.objectStoreNames.contains('notes')) {
          db.createObjectStore('notes', { keyPath: 'id' });
        }

        // Settings store (single record)
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      },
    });
  }
  return dbPromise;
}

// Events operations
export async function getAllEvents(): Promise<TimelineEvent[]> {
  const db = await getDB();
  return db.getAll('events');
}

export async function saveEvent(event: TimelineEvent): Promise<void> {
  const db = await getDB();
  await db.put('events', event);
}

export async function deleteEvent(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('events', id);
}

export async function saveAllEvents(events: TimelineEvent[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('events', 'readwrite');
  await tx.store.clear();
  await Promise.all(events.map((event) => tx.store.put(event)));
  await tx.done;
}

// Questions operations
export async function getAllQuestions(): Promise<CivicsQuestion[]> {
  const db = await getDB();
  return db.getAll('questions');
}

export async function saveAllQuestions(questions: CivicsQuestion[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('questions', 'readwrite');
  await tx.store.clear();
  await Promise.all(questions.map((q) => tx.store.put(q)));
  await tx.done;
}

// Documents operations
export async function getAllDocuments(): Promise<Document[]> {
  const db = await getDB();
  return db.getAll('documents');
}

export async function saveDocument(doc: Document): Promise<void> {
  const db = await getDB();
  await db.put('documents', doc);
}

export async function saveAllDocuments(docs: Document[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('documents', 'readwrite');
  await tx.store.clear();
  await Promise.all(docs.map((doc) => tx.store.put(doc)));
  await tx.done;
}

// Mastery operations
export async function getMastery(): Promise<MasteryStore> {
  const db = await getDB();
  const records = await db.getAll('mastery');
  return records.reduce((acc, record) => {
    if (record.mastered) {
      acc[record.id] = true;
    }
    return acc;
  }, {} as MasteryStore);
}

export async function setMastery(questionId: number, mastered: boolean): Promise<void> {
  const db = await getDB();
  if (mastered) {
    await db.put('mastery', { id: questionId, mastered: true });
  } else {
    await db.delete('mastery', questionId);
  }
}

export async function saveAllMastery(mastery: MasteryStore): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('mastery', 'readwrite');
  await tx.store.clear();
  await Promise.all(
    Object.entries(mastery).map(([id, mastered]) =>
      mastered ? tx.store.put({ id: Number(id), mastered: true }) : Promise.resolve()
    )
  );
  await tx.done;
}

// Notes operations
export async function getNotes(): Promise<NotesStore> {
  const db = await getDB();
  const records = await db.getAll('notes');
  return records.reduce((acc, record) => {
    if (record.content) {
      acc[record.id] = record.content;
    }
    return acc;
  }, {} as NotesStore);
}

export async function setNote(id: string, content: string): Promise<void> {
  const db = await getDB();
  if (content) {
    await db.put('notes', { id, content });
  } else {
    await db.delete('notes', id);
  }
}

export async function saveAllNotes(notes: NotesStore): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('notes', 'readwrite');
  await tx.store.clear();
  await Promise.all(
    Object.entries(notes).map(([id, content]) =>
      content ? tx.store.put({ id, content }) : Promise.resolve()
    )
  );
  await tx.done;
}

// Settings operations
export async function getSettings(): Promise<UserSettings | undefined> {
  const db = await getDB();
  return db.get('settings', 'user');
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  const db = await getDB();
  await db.put('settings', settings, 'user');
}

// Clear all data
export async function clearAllData(): Promise<void> {
  const db = await getDB();
  await Promise.all([
    db.clear('events'),
    db.clear('questions'),
    db.clear('documents'),
    db.clear('mastery'),
    db.clear('notes'),
    db.clear('settings'),
  ]);
}
