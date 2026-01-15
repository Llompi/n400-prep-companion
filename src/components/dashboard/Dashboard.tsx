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
      <div className="relative bg-gradient-to-br from-white to-slate-50 rounded-2xl p-8 border border-slate-100 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <h2 className="text-3xl font-serif font-medium text-slate-800 mb-1">
            Welcome, {settings.name}
          </h2>
          <p className="text-slate-500 font-sans text-sm mb-6">
            Your journey to citizenship is underway.
          </p>

          {daysUntil !== null ? (
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-5xl font-serif text-slate-800">{daysUntil}</span>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Days Left
                </span>
              </div>
              <div className="h-12 w-px bg-slate-200" />
              <div>
                <div className="font-serif text-lg text-slate-700">
                  {new Date(settings.interviewDate!).toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <div className="text-xs text-blue-400 font-medium">Interview Date</div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('settings')}
              className="text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-medium hover:bg-blue-100 transition"
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
          className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer relative overflow-hidden text-left"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition">
              <Icon name="book-open" className="text-green-600 opacity-80" />
            </div>
            <Icon
              name="arrow-right"
              className="text-slate-300 group-hover:text-slate-500 transition"
              size={16}
            />
          </div>
          <h3 className="text-lg font-serif text-slate-800 mb-1">Civics Mastery</h3>
          <div className="mb-3">
            <ProgressBar
              value={masteredCount}
              max={questions.length}
              colorClass="bg-green-300"
            />
          </div>
          <p className="text-xs text-slate-400">
            {masteredCount} of {questions.length} questions mastered
          </p>
          <IntegratedNote id="dash_study" notes={notes} onSave={onNoteChange} />
        </button>

        {/* Docs Card */}
        <button
          onClick={() => onNavigate('docs')}
          className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer text-left"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition">
              <Icon name="folder-check" className="text-amber-600 opacity-80" />
            </div>
            <Icon
              name="arrow-right"
              className="text-slate-300 group-hover:text-slate-500 transition"
              size={16}
            />
          </div>
          <h3 className="text-lg font-serif text-slate-800 mb-1">Documents</h3>
          <div className="mb-3">
            <ProgressBar value={docsReady} max={docs.length} colorClass="bg-amber-300" />
          </div>
          <p className="text-xs text-slate-400">
            {docsReady} of {docs.length} items ready
          </p>
          <IntegratedNote id="dash_docs" notes={notes} onSave={onNoteChange} />
        </button>

        {/* Timeline Card */}
        <button
          onClick={() => onNavigate('timeline')}
          className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer md:col-span-2 lg:col-span-1 text-left"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition">
              <Icon name="calendar-days" className="text-blue-600 opacity-80" />
            </div>
            <Icon
              name="arrow-right"
              className="text-slate-300 group-hover:text-slate-500 transition"
              size={16}
            />
          </div>
          <h3 className="text-lg font-serif text-slate-800 mb-1">Timeline</h3>
          <div className="text-2xl font-sans font-light text-slate-700 mb-1">
            {events.length}{' '}
            <span className="text-sm text-slate-400">Events</span>
          </div>
          <p className="text-xs text-slate-400">Track residence & travel history</p>
          <IntegratedNote id="dash_timeline" notes={notes} onSave={onNoteChange} />
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
