import { useState, useEffect } from 'react';
import type { UserSettings } from '../../types';

interface ANumberBadgeProps {
  settings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
}

export function ANumberBadge({ settings, onSettingsChange }: ANumberBadgeProps) {
  const [isBlurred, setIsBlurred] = useState(settings.alienNumberBlurred ?? false);

  // Sync with settings when they change externally
  useEffect(() => {
    setIsBlurred(settings.alienNumberBlurred ?? false);
  }, [settings.alienNumberBlurred]);

  if (!settings.alienNumber) {
    return null;
  }

  const toggleBlur = () => {
    const newBlurred = !isBlurred;
    setIsBlurred(newBlurred);
    onSettingsChange({ ...settings, alienNumberBlurred: newBlurred });
  };

  return (
    <button
      onClick={toggleBlur}
      className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-xs font-mono transition-colors print:bg-transparent print:border print:border-slate-300"
      title={isBlurred ? 'Click to reveal A-Number' : 'Click to hide A-Number'}
    >
      <span className="text-slate-500 dark:text-slate-400 font-sans text-[10px] font-semibold uppercase">
        A#
      </span>
      <span
        className={`text-slate-700 dark:text-slate-200 transition-all duration-200 ${
          isBlurred ? 'blur-sm select-none' : ''
        }`}
      >
        {settings.alienNumber}
      </span>
    </button>
  );
}

export default ANumberBadge;
