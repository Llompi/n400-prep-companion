import { useState } from 'react';
import { Header } from './components/layout/Header';
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
    setAllQuestions,
    toggleMastery,
    updateNote,
    updateSettings,
    resetAllData,
  } = useStorage();

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4" />
          <p className="text-slate-500 font-sans">Loading your data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md p-6">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-0 bg-[#f8fafc] font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header settings={settings} />

      <main className="max-w-4xl mx-auto p-6">
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
