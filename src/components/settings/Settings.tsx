import type { ChangeEvent } from 'react';
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

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-serif text-slate-800">Settings</h2>

      {/* Profile Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <h3 className="font-serif text-lg text-slate-700">Profile</h3>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
            Full Name
          </label>
          <input
            type="text"
            className="w-full bg-slate-50 border-none rounded-lg p-3 text-sm"
            value={settings.name}
            onChange={(e) => onSettingsChange({ ...settings, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
            Interview Date
          </label>
          <input
            type="date"
            className="w-full bg-slate-50 border-none rounded-lg p-3 text-sm"
            value={settings.interviewDate || ''}
            onChange={(e) =>
              onSettingsChange({ ...settings, interviewDate: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
            Arrival Date (USA)
          </label>
          <input
            type="date"
            className="w-full bg-slate-50 border-none rounded-lg p-3 text-sm"
            value={settings.arrivalDate || ''}
            onChange={(e) =>
              onSettingsChange({ ...settings, arrivalDate: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
            Green Card Issue Date
          </label>
          <input
            type="date"
            className="w-full bg-slate-50 border-none rounded-lg p-3 text-sm"
            value={settings.greenCardDate || ''}
            onChange={(e) =>
              onSettingsChange({ ...settings, greenCardDate: e.target.value })
            }
          />
        </div>
      </div>

      {/* Data Management Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <h3 className="font-serif text-lg text-slate-700">Data Management</h3>
        <p className="text-xs text-slate-500">
          Your data is stored locally in your browser. Export regularly to keep a backup.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onExport}
            className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition"
          >
            <Icon name="download" className="mb-2 text-slate-500" />
            <span className="text-xs font-bold text-slate-600">Backup All</span>
          </button>
          <label className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition cursor-pointer">
            <Icon name="upload" className="mb-2 text-slate-500" />
            <span className="text-xs font-bold text-slate-600">Restore All</span>
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
          className="w-full text-red-400 text-xs py-3 hover:bg-red-50 rounded-xl transition"
        >
          Reset Application Data
        </button>
      </div>

      {/* About Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="font-serif text-lg text-slate-700 mb-2">About</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          N-400 Prep Companion is an offline-first tool to help you prepare for your U.S.
          citizenship interview. All data stays on your device - we never collect or
          transmit your personal information.
        </p>
        <div className="mt-4 pt-4 border-t border-slate-50 text-xs text-slate-400">
          <p>Version 0.1.0</p>
          <p>MIT License</p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
