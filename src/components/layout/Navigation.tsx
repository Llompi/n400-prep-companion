import { NavButton } from '../ui/NavButton';
import type { TabId } from '../../types';

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-1 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-xl px-3 py-2 rounded-full shadow-lg shadow-neutral-900/10 dark:shadow-black/20 border border-neutral-200/50 dark:border-neutral-700/50">
        <NavButton
          id="dashboard"
          icon="layout-dashboard"
          label="Home"
          active={activeTab}
          onClick={onTabChange}
        />
        <NavButton
          id="timeline"
          icon="calendar-days"
          label="Time"
          active={activeTab}
          onClick={onTabChange}
        />
        <NavButton
          id="study"
          icon="book-open"
          label="Study"
          active={activeTab}
          onClick={onTabChange}
        />
        <NavButton
          id="docs"
          icon="folder-check"
          label="Docs"
          active={activeTab}
          onClick={onTabChange}
        />
        <NavButton
          id="settings"
          icon="settings"
          label="Config"
          active={activeTab}
          onClick={onTabChange}
        />
      </div>
    </nav>
  );
}

export default Navigation;
