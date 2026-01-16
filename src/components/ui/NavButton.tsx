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
        group flex flex-col items-center justify-center px-2.5 sm:px-3 py-2 rounded-lg sm:rounded-xl transition-all duration-200 min-h-[48px] min-w-[48px] sm:min-w-[56px]
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
        ${isActive
          ? 'text-primary bg-primary-light dark:bg-primary-dark/30 shadow-sm'
          : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700'
        }
      `}
      aria-current={isActive ? 'page' : undefined}
      aria-label={label}
    >
      <Icon
        name={icon}
        size={20}
        className={`transition-colors ${isActive ? '' : ''}`}
      />
      <span
        className={`text-[10px] sm:text-xs mt-1 font-medium font-sans tracking-wide ${
          isActive ? 'opacity-100' : 'opacity-70'
        }`}
      >
        {label}
      </span>
    </button>
  );
}

export default NavButton;
