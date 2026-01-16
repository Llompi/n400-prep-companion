import { Icon } from '../ui/Icon';
import type { UserSettings } from '../../types';

interface HeaderProps {
  settings: UserSettings;
}

export function Header({ settings }: HeaderProps) {
  return (
    <header className="bg-surface/90 dark:bg-neutral-900/90 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-700 shadow-sm">
      <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-neutral-900 dark:bg-primary text-white p-2.5 rounded-lg shadow-md">
            <Icon name="flag" size={18} />
          </div>
          <h1 className="text-xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight flex items-baseline gap-2">
            N-400
            <span className="font-sans font-medium text-neutral-500 dark:text-neutral-400 text-sm uppercase tracking-wider">
              Companion
            </span>
          </h1>
        </div>
        <div className="hidden md:block px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
          <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-widest">
            {settings.interviewDate
              ? new Date(settings.interviewDate).toLocaleDateString(undefined, { dateStyle: 'medium' })
              : 'Set Interview Date'}
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;
