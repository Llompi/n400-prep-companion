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
      className={`
        group flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200 min-w-[56px]
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${isActive
          ? 'text-primary bg-primary-light dark:bg-primary-dark/20 scale-105 shadow-sm'
          : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700/50'
        }
      `}
      aria-current={isActive ? 'page' : undefined}
      aria-label={label}
    >
      <Icon
        name={icon}
        size={24}
        className={`transition-colors ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
      />
      <span
        className={`text-xs mt-1.5 font-medium font-sans tracking-wide ${
          isActive ? 'opacity-100' : 'opacity-70'
        }`}
      >
        {label}
      </span>
    </button>
  );
}

export default NavButton;
