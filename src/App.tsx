import { useState, useEffect } from 'react';
import { Navigation } from './components/layout/Navigation';
import { Dashboard } from './components/dashboard/Dashboard';
import { TimelineManager } from './components/timeline/TimelineManager';
import { StudyMode } from './components/study/StudyMode';
import { DocManager } from './components/documents/DocManager';
import { Settings } from './components/settings/Settings';
import { useStorage } from './hooks/useStorage';
import { downloadBackup, importFromFile } from './lib/storage/export-import';
import type { TabId } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  const {
    events,
    questions,
    docs,
    mastery,
    notes,
    settings,
    isLoading,
    error,
    addEvent,
    deleteEvent,
    updateDocument,
    setAllDocuments,
    setAllQuestions,
    toggleMastery,
    updateNote,
    updateSettings,
    resetAllData,
  } = useStorage();

  // Apply dark mode on initial load
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const handleExport = async () => {
    try {
      await downloadBackup();
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. Please try again.');
    }
  };

  const handleImport = async (file: File) => {
    const result = await importFromFile(file);
    if (result.success) {
      alert(result.message);
      window.location.reload();
    } else {
      alert(`Import failed: ${result.message}`);
    }
  };

  const handleClearData = async () => {
    await resetAllData();
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 dark:border-white mx-auto mb-4" />
          <p className="text-neutral-700 dark:text-neutral-300 font-sans">Loading your data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
        <div className="text-center max-w-md p-6">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 rounded-lg font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 bg-neutral-100 dark:bg-neutral-900 font-sans selection:bg-primary-light selection:text-neutral-900 dark:selection:bg-primary dark:selection:text-white">
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            events={events}
            mastery={mastery}
            questions={questions}
            docs={docs}
            settings={settings}
            notes={notes}
            onNoteChange={updateNote}
            onNavigate={setActiveTab}
          />
        )}
        {activeTab === 'timeline' && (
          <TimelineManager
            events={events}
            settings={settings}
            notes={notes}
            onAddEvent={addEvent}
            onDeleteEvent={deleteEvent}
            onNoteChange={updateNote}
          />
        )}
        {activeTab === 'study' && (
          <StudyMode
            questions={questions}
            mastery={mastery}
            notes={notes}
            onToggleMastery={toggleMastery}
            onNoteChange={updateNote}
            onImportQuestions={setAllQuestions}
          />
        )}
        {activeTab === 'docs' && (
          <DocManager
            docs={docs}
            notes={notes}
            onUpdateDocument={updateDocument}
            onSetAllDocuments={setAllDocuments}
            onNoteChange={updateNote}
          />
        )}
        {activeTab === 'settings' && (
          <Settings
            settings={settings}
            onSettingsChange={updateSettings}
            onExport={handleExport}
            onImport={handleImport}
            onClearData={handleClearData}
          />
        )}
      </main>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
