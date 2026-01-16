import { useMemo } from 'react';
import { Icon } from '../ui/Icon';
import { ProgressBar } from '../ui/ProgressBar';
import { IntegratedNote } from '../ui/IntegratedNote';
import type {
  TimelineEvent,
  CivicsQuestion,
  Document,
  UserSettings,
  NotesStore,
  MasteryStore,
  TabId,
} from '../../types';

interface DashboardProps {
  events: TimelineEvent[];
  mastery: MasteryStore;
  questions: CivicsQuestion[];
  docs: Document[];
  settings: UserSettings;
  notes: NotesStore;
  onNoteChange: (id: string, content: string) => void;
  onNavigate: (tab: TabId) => void;
}

export function Dashboard({
  events,
  mastery,
  questions,
  docs,
  settings,
  notes,
  onNoteChange,
  onNavigate,
}: DashboardProps) {
  const daysUntil = useMemo(() => {
    if (!settings.interviewDate) return null;
    const diff = new Date(settings.interviewDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [settings.interviewDate]);

  const docsReady = docs.filter(
    (d) => d.status === 'packed' || d.status === 'uploaded'
  ).length;

  const masteredCount = Object.keys(mastery).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="relative bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-800/50 rounded-2xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 dark:bg-primary-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-100 dark:bg-red-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-neutral-800 dark:text-neutral-100 mb-1">
            Welcome, {settings.name}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 font-sans text-sm mb-6">
            Your journey to citizenship is underway.
          </p>

          {daysUntil !== null ? (
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
              <div className="flex flex-col">
                <span className="text-4xl sm:text-5xl font-serif text-neutral-800 dark:text-neutral-100">{daysUntil}</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider">
                  Days Left
                </span>
              </div>
              <div className="hidden sm:block h-12 w-px bg-neutral-300 dark:bg-neutral-600" />
              <div>
                <div className="font-serif text-lg text-neutral-700 dark:text-neutral-200">
                  {new Date(settings.interviewDate!).toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <div className="text-xs text-primary-600 dark:text-primary-400 font-medium">Interview Date</div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('settings')}
              className="text-sm bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full font-medium hover:bg-primary-200 dark:hover:bg-primary-900 transition"
            >
              Set Interview Date
            </button>
          )}
          <IntegratedNote
            id="dash_header"
            notes={notes}
            onSave={onNoteChange}
            label="Add Daily Goal / Note"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Study Card */}
        <button
          onClick={() => onNavigate('study')}
          className="group bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md dark:hover:shadow-neutral-900/50 transition cursor-pointer relative overflow-hidden text-left"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl group-hover:bg-green-200 dark:group-hover:bg-green-900 transition">
              <Icon name="book-open" className="text-green-700 dark:text-green-400" />
            </div>
            <Icon
              name="arrow-right"
              className="text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition"
              size={16}
            />
          </div>
          <h3 className="text-lg font-serif text-neutral-800 dark:text-neutral-100 mb-1">Civics Mastery</h3>
          <div className="mb-3">
            <ProgressBar
              value={masteredCount}
              max={questions.length}
              colorClass="bg-green-500 dark:bg-green-400"
            />
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {masteredCount} of {questions.length} questions mastered
          </p>
          <IntegratedNote id="dash_study" notes={notes} onSave={onNoteChange} />
        </button>

        {/* Docs Card */}
        <button
          onClick={() => onNavigate('docs')}
          className="group bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md dark:hover:shadow-neutral-900/50 transition cursor-pointer text-left"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-xl group-hover:bg-amber-200 dark:group-hover:bg-amber-900 transition">
              <Icon name="folder-check" className="text-amber-700 dark:text-amber-400" />
            </div>
            <Icon
              name="arrow-right"
              className="text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition"
              size={16}
            />
          </div>
          <h3 className="text-lg font-serif text-neutral-800 dark:text-neutral-100 mb-1">Documents</h3>
          <div className="mb-3">
            <ProgressBar value={docsReady} max={docs.length} colorClass="bg-amber-500 dark:bg-amber-400" />
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {docsReady} of {docs.length} items ready
          </p>
          <IntegratedNote id="dash_docs" notes={notes} onSave={onNoteChange} />
        </button>

        {/* Timeline Card */}
        <button
          onClick={() => onNavigate('timeline')}
          className="group bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md dark:hover:shadow-neutral-900/50 transition cursor-pointer md:col-span-2 lg:col-span-1 text-left"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/50 rounded-xl group-hover:bg-primary-200 dark:group-hover:bg-primary-900 transition">
              <Icon name="calendar-days" className="text-primary-700 dark:text-primary-400" />
            </div>
            <Icon
              name="arrow-right"
              className="text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition"
              size={16}
            />
          </div>
          <h3 className="text-lg font-serif text-neutral-800 dark:text-neutral-100 mb-1">Timeline</h3>
          <div className="text-2xl font-sans font-light text-neutral-700 dark:text-neutral-200 mb-1">
            {events.length}{' '}
            <span className="text-sm text-neutral-500 dark:text-neutral-400">Events</span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Track residence & travel history</p>
          <IntegratedNote id="dash_timeline" notes={notes} onSave={onNoteChange} />
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
