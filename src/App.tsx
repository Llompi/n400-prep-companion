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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 dark:border-slate-200 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 font-sans">Loading your data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center max-w-md p-6">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 px-4 py-2 rounded-lg font-medium hover:bg-slate-700 dark:hover:bg-slate-300 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 bg-slate-50 dark:bg-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100">
      <main className="max-w-4xl mx-auto p-6 pt-8">
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
            docs={docs}
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
