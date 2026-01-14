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
      className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
        isActive
          ? 'text-blue-600 bg-blue-50/50 scale-105'
          : 'text-slate-400 hover:text-slate-600'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon
        name={icon}
        size={22}
        className={isActive ? 'fill-blue-100' : ''}
      />
      <span
        className={`text-[10px] mt-1 font-medium font-sans ${
          isActive ? 'opacity-100' : 'opacity-70'
        }`}
      >
        {label}
      </span>
    </button>
  );
}

export default NavButton;
