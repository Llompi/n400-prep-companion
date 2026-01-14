import { Icon } from '../ui/Icon';
import type { UserSettings } from '../../types';

interface HeaderProps {
  settings: UserSettings;
}

export function Header({ settings }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 text-white p-2 rounded-lg">
            <Icon name="flag" size={16} />
          </div>
          <h1 className="text-lg font-serif font-bold text-slate-800 tracking-tight">
            N-400 <span className="font-sans font-normal text-slate-400">Companion</span>
          </h1>
        </div>
        <div className="hidden md:block text-xs font-bold text-slate-400 uppercase tracking-widest">
          {settings.interviewDate
            ? new Date(settings.interviewDate).toLocaleDateString()
            : 'Set Date'}
        </div>
      </div>
    </header>
  );
}

export default Header;
