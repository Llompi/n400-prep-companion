import { useState, useEffect, useCallback } from 'react';
import type {
  TimelineEvent,
  CivicsQuestion,
  Document,
  UserSettings,
  NotesStore,
  MasteryStore,
} from '../types';
import {
  getAllEvents,
  saveEvent,
  deleteEvent as deleteEventFromDB,
  saveAllEvents,
  getAllQuestions,
  saveAllQuestions,
  getAllDocuments,
  saveDocument,
  saveAllDocuments,
  getMastery,
  setMastery,
  saveAllMastery,
  getNotes,
  setNote,
  saveAllNotes,
  getSettings,
  saveSettings,
  clearAllData,
} from '../lib/storage/db';
import { CIVICS_QUESTIONS } from '../data/civics-2008';
import { DEFAULT_DOCUMENTS } from '../data/default-documents';

const DEFAULT_SETTINGS: UserSettings = {
  name: 'Applicant',
  arrivalDate: '',
  greenCardDate: '',
  filingDate: '',
  interviewDate: '',
};

export function useStorage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [questions, setQuestions] = useState<CivicsQuestion[]>(CIVICS_QUESTIONS);
  const [docs, setDocs] = useState<Document[]>(DEFAULT_DOCUMENTS);
  const [mastery, setMasteryState] = useState<MasteryStore>({});
  const [notes, setNotesState] = useState<NotesStore>({});
  const [settings, setSettingsState] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all data on mount
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [
          loadedEvents,
          loadedQuestions,
          loadedDocs,
          loadedMastery,
          loadedNotes,
          loadedSettings,
        ] = await Promise.all([
          getAllEvents(),
          getAllQuestions(),
          getAllDocuments(),
          getMastery(),
          getNotes(),
          getSettings(),
        ]);

        setEvents(loadedEvents || []);
        setQuestions(loadedQuestions.length > 0 ? loadedQuestions : CIVICS_QUESTIONS);
        setDocs(loadedDocs.length > 0 ? loadedDocs : DEFAULT_DOCUMENTS);
        setMasteryState(loadedMastery || {});
        setNotesState(loadedNotes || {});
        setSettingsState(loadedSettings || DEFAULT_SETTINGS);

        // Initialize questions if empty
        if (loadedQuestions.length === 0) {
          await saveAllQuestions(CIVICS_QUESTIONS);
        }

        // Initialize documents if empty
        if (loadedDocs.length === 0) {
          await saveAllDocuments(DEFAULT_DOCUMENTS);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load data. Using defaults.');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Event operations
  const addEvent = useCallback(async (event: TimelineEvent) => {
    await saveEvent(event);
    setEvents((prev) => [...prev, event]);
  }, []);

  const updateEvent = useCallback(async (event: TimelineEvent) => {
    await saveEvent(event);
    setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)));
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    await deleteEventFromDB(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const setAllEvents = useCallback(async (newEvents: TimelineEvent[]) => {
    await saveAllEvents(newEvents);
    setEvents(newEvents);
  }, []);

  // Document operations
  const updateDocument = useCallback(async (doc: Document) => {
    await saveDocument(doc);
    setDocs((prev) => prev.map((d) => (d.id === doc.id ? doc : d)));
  }, []);

  const setAllDocuments = useCallback(async (newDocs: Document[]) => {
    await saveAllDocuments(newDocs);
    setDocs(newDocs);
  }, []);

  // Question operations
  const setAllQuestions = useCallback(async (newQuestions: CivicsQuestion[]) => {
    await saveAllQuestions(newQuestions);
    setQuestions(newQuestions);
  }, []);

  // Mastery operations
  const toggleMastery = useCallback(async (questionId: number) => {
    const newMastered = !mastery[questionId];
    await setMastery(questionId, newMastered);
    setMasteryState((prev) => {
      if (newMastered) {
        return { ...prev, [questionId]: true };
      } else {
        const next = { ...prev };
        delete next[questionId];
        return next;
      }
    });
  }, [mastery]);

  const setAllMastery = useCallback(async (newMastery: MasteryStore) => {
    await saveAllMastery(newMastery);
    setMasteryState(newMastery);
  }, []);

  // Note operations
  const updateNote = useCallback(async (id: string, content: string) => {
    await setNote(id, content);
    setNotesState((prev) => {
      if (content) {
        return { ...prev, [id]: content };
      } else {
        const next = { ...prev };
        delete next[id];
        return next;
      }
    });
  }, []);

  const setAllNotes = useCallback(async (newNotes: NotesStore) => {
    await saveAllNotes(newNotes);
    setNotesState(newNotes);
  }, []);

  // Settings operations
  const updateSettings = useCallback(async (newSettings: UserSettings) => {
    await saveSettings(newSettings);
    setSettingsState(newSettings);
  }, []);

  // Reset all data
  const resetAllData = useCallback(async () => {
    await clearAllData();
    setEvents([]);
    setQuestions(CIVICS_QUESTIONS);
    setDocs(DEFAULT_DOCUMENTS);
    setMasteryState({});
    setNotesState({});
    setSettingsState(DEFAULT_SETTINGS);

    // Re-initialize defaults
    await saveAllQuestions(CIVICS_QUESTIONS);
    await saveAllDocuments(DEFAULT_DOCUMENTS);
  }, []);

  return {
    // State
    events,
    questions,
    docs,
    mastery,
    notes,
    settings,
    isLoading,
    error,
    // Event operations
    addEvent,
    updateEvent,
    deleteEvent,
    setAllEvents,
    // Document operations
    updateDocument,
    setAllDocuments,
    // Question operations
    setAllQuestions,
    // Mastery operations
    toggleMastery,
    setAllMastery,
    // Note operations
    updateNote,
    setAllNotes,
    // Settings operations
    updateSettings,
    // Reset
    resetAllData,
  };
}
