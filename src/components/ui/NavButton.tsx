import { Icon } from './Icon';
import type { TabId, IconName } from '../../types';

interface NavButtonProps {
  id: TabId;
  icon: IconName;
  label: string;
  active: TabId;
  onClick: (id: TabId) => void;
}

export function NavButton({ id, icon, label, active, onClick }: NavButtonProps) {
  const isActive = active === id;

  return (
    <button
      onClick={() => onClick(id)}
      className={`flex flex-col items-center justify-center px-3 py-2 rounded-full transition-all duration-200 min-w-[52px] ${
        isActive
          ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon
        name={icon}
        size={20}
        className={isActive ? 'fill-blue-100 dark:fill-blue-900' : ''}
      />
      <span
        className={`text-[9px] mt-0.5 font-semibold tracking-wide ${
          isActive ? 'opacity-100' : 'opacity-80'
        }`}
      >
        {label}
      </span>
    </button>
  );
}

export default NavButton;
