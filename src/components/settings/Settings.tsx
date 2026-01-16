import { useEffect, type ChangeEvent } from 'react';
import { Icon } from '../ui/Icon';
import type { UserSettings } from '../../types';

interface SettingsProps {
  settings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onClearData: () => void;
}

export function Settings({
  settings,
  onSettingsChange,
  onExport,
  onImport,
  onClearData,
}: SettingsProps) {
  // Apply dark mode class to document
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const handleImportFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
    }
  };

  const handleClear = () => {
    if (confirm('Reset all application data? This cannot be undone.')) {
      onClearData();
    }
  };

  const toggleDarkMode = () => {
    onSettingsChange({ ...settings, darkMode: !settings.darkMode });
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-serif text-neutral-900 dark:text-white">Settings</h2>

      {/* Appearance Section */}
      <div className="bg-surface dark:bg-neutral-800 p-6 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 space-y-4">
        <h3 className="font-serif text-lg text-neutral-700 dark:text-neutral-200">Appearance</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Dark Mode</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Switch between light and dark themes
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${
              settings.darkMode
                ? 'bg-primary'
                : 'bg-neutral-200 dark:bg-neutral-600'
            }`}
            aria-label="Toggle dark mode"
          >
            <span
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center transition-transform duration-200 ${
                settings.darkMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            >
              <Icon
                name={settings.darkMode ? 'moon' : 'sun'}
                size={14}
                className={settings.darkMode ? 'text-primary' : 'text-amber-500'}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-surface dark:bg-neutral-800 p-6 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 space-y-4">
        <h3 className="font-serif text-lg text-neutral-700 dark:text-neutral-200">Profile</h3>
        <div>
          <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase mb-1">
            Full Name
          </label>
          <input
            type="text"
            className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary"
            value={settings.name}
            onChange={(e) => onSettingsChange({ ...settings, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase mb-1">
            Interview Date
          </label>
          <input
            type="date"
            className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary"
            value={settings.interviewDate || ''}
            onChange={(e) =>
              onSettingsChange({ ...settings, interviewDate: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase mb-1">
            Arrival Date (USA)
          </label>
          <input
            type="date"
            className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary"
            value={settings.arrivalDate || ''}
            onChange={(e) =>
              onSettingsChange({ ...settings, arrivalDate: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase mb-1">
            Green Card Issue Date
          </label>
          <input
            type="date"
            className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary"
            value={settings.greenCardDate || ''}
            onChange={(e) =>
              onSettingsChange({ ...settings, greenCardDate: e.target.value })
            }
          />
        </div>
      </div>

      {/* Data Management Section */}
      <div className="bg-surface dark:bg-neutral-800 p-6 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 space-y-4">
        <h3 className="font-serif text-lg text-neutral-700 dark:text-neutral-200">Data Management</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Your data is stored locally in your browser. Export regularly to keep a backup.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onExport}
            className="flex flex-col items-center justify-center p-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
          >
            <Icon name="download" className="mb-2 text-neutral-500 dark:text-neutral-300" />
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-200">Backup All</span>
          </button>
          <label className="flex flex-col items-center justify-center p-4 bg-neutral-100 dark:bg-neutral-700 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-600 transition cursor-pointer">
            <Icon name="upload" className="mb-2 text-neutral-500 dark:text-neutral-300" />
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-200">Restore All</span>
            <input
              type="file"
              className="hidden"
              onChange={handleImportFile}
              accept=".json"
            />
          </label>
        </div>
        <button
          onClick={handleClear}
          className="w-full text-red-500 dark:text-red-400 text-xs py-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition font-medium"
        >
          Reset Application Data
        </button>
      </div>

      {/* About Section */}
      <div className="bg-surface dark:bg-neutral-800 p-6 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700">
        <h3 className="font-serif text-lg text-neutral-700 dark:text-neutral-200 mb-2">About</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
          N-400 Prep Companion is an offline-first tool to help you prepare for your U.S.
          citizenship interview. All data stays on your device - we never collect or
          transmit your personal information.
        </p>
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 text-xs text-neutral-400 dark:text-neutral-500">
          <p>Version 0.1.0</p>
          <p>MIT License</p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
