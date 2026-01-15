import { NavButton } from '../ui/NavButton';
import type { TabId } from '../../types';

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-2 z-40">
      <div className="max-w-md mx-auto flex justify-around">
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
