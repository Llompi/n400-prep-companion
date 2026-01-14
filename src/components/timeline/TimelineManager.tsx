import { useState, useMemo, type FormEvent } from 'react';
import { Icon } from '../ui/Icon';
import { Modal } from '../ui/Modal';
import { IntegratedNote } from '../ui/IntegratedNote';
import type { TimelineEvent, UserSettings, NotesStore, EventType } from '../../types';

interface TimelineManagerProps {
  events: TimelineEvent[];
  settings: UserSettings;
  notes: NotesStore;
  onAddEvent: (event: TimelineEvent) => void;
  onDeleteEvent: (id: string) => void;
  onNoteChange: (id: string, content: string) => void;
}

const EVENT_TYPE_COLORS: Record<EventType | 'other', string> = {
  trip: 'text-purple-400 bg-purple-50',
  address: 'text-green-400 bg-green-50',
  employment: 'text-blue-400 bg-blue-50',
  legal: 'text-red-400 bg-red-50',
  tax: 'text-amber-400 bg-amber-50',
  other: 'text-slate-400 bg-slate-50',
};

const FILTER_OPTIONS = ['all', 'address', 'employment', 'trip', 'tax', 'legal'] as const;

interface NewEventForm {
  date: string;
  endDate: string;
  type: EventType;
  title: string;
  desc: string;
  evidenceRef: string;
  evidenceLink: string;
}

const INITIAL_FORM: NewEventForm = {
  date: '',
  endDate: '',
  type: 'address',
  title: '',
  desc: '',
  evidenceRef: '',
  evidenceLink: '',
};

export function TimelineManager({
  events,
  settings,
  notes,
  onAddEvent,
  onDeleteEvent,
  onNoteChange,
}: TimelineManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<(typeof FILTER_OPTIONS)[number]>('all');
  const [newEvent, setNewEvent] = useState<NewEventForm>(INITIAL_FORM);

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [events]
  );

  const filteredEvents =
    filter === 'all' ? sortedEvents : sortedEvents.filter((e) => e.type === filter);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const event: TimelineEvent = {
      ...newEvent,
      id: Date.now().toString(),
    };
    onAddEvent(event);
    setIsAdding(false);
    setNewEvent(INITIAL_FORM);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this event?')) {
      onDeleteEvent(id);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-slate-800">Timeline</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-slate-800 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm shadow hover:bg-slate-700 transition"
        >
          <Icon name="plus" size={16} /> Add Event
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {FILTER_OPTIONS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition border ${
              filter === f
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative pl-8 border-l border-slate-200 space-y-8">
        {/* Future Node - Interview */}
        <div className="relative">
          <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-blue-400 ring-4 ring-blue-50" />
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase text-blue-400 tracking-wider">
                  Upcoming
                </span>
                <h3 className="font-serif text-lg text-slate-800 mt-1">Interview</h3>
                <div className="text-sm text-slate-500 font-sans mt-1">
                  {settings.interviewDate || 'Date pending'}
                </div>
              </div>
              <Icon name="flag" className="text-blue-200" size={24} />
            </div>
            <IntegratedNote id="timeline_target" notes={notes} onSave={onNoteChange} />
          </div>
        </div>

        {/* Events */}
        {filteredEvents.map((ev) => (
          <div key={ev.id} className="relative group">
            <div className="absolute -left-[37px] top-5 w-4 h-4 rounded-full bg-white border-2 border-slate-300 z-10 group-hover:scale-110 transition" />
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${
                      EVENT_TYPE_COLORS[ev.type] || EVENT_TYPE_COLORS.other
                    }`}
                  >
                    {ev.type}
                  </span>
                  <h3 className="font-serif text-lg text-slate-800 mt-2">{ev.title}</h3>
                  <div className="text-sm text-slate-400 font-mono mt-1">
                    {ev.date} {ev.endDate ? `— ${ev.endDate}` : ''}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(ev.id)}
                  className="text-slate-200 hover:text-red-300 transition"
                  aria-label="Delete event"
                >
                  <Icon name="trash-2" size={16} />
                </button>
              </div>

              {ev.desc && (
                <p className="text-sm text-slate-600 mt-3 font-sans leading-relaxed">
                  {ev.desc}
                </p>
              )}

              <div className="mt-4 pt-4 border-t border-slate-50 flex flex-wrap gap-2">
                {ev.evidenceRef || ev.evidenceLink ? (
                  <>
                    {ev.evidenceRef && (
                      <span className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded">
                        <Icon name="folder" size={12} className="text-amber-400" />{' '}
                        {ev.evidenceRef}
                      </span>
                    )}
                    {ev.evidenceLink && (
                      <a
                        href={ev.evidenceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition"
                      >
                        <Icon name="link" size={12} /> Link
                      </a>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-red-300 italic flex items-center gap-1">
                    <Icon name="alert-triangle" size={12} /> No proof attached
                  </span>
                )}
              </div>
              <IntegratedNote id={`evt_${ev.id}`} notes={notes} onSave={onNoteChange} />
            </div>
          </div>
        ))}
      </div>

      {/* Add Event Modal */}
      <Modal isOpen={isAdding} onClose={() => setIsAdding(false)} title="Add Timeline Event">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Start Date
              </label>
              <input
                type="date"
                required
                className="w-full bg-slate-50 border-none rounded-lg p-2 text-sm focus:ring-1 focus:ring-blue-200"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                End Date
              </label>
              <input
                type="date"
                className="w-full bg-slate-50 border-none rounded-lg p-2 text-sm focus:ring-1 focus:ring-blue-200"
                value={newEvent.endDate}
                onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              Category
            </label>
            <select
              className="w-full bg-slate-50 border-none rounded-lg p-2 text-sm"
              value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as EventType })}
            >
              <option value="address">Address History</option>
              <option value="employment">Employment</option>
              <option value="trip">Travel Abroad</option>
              <option value="tax">Tax Return</option>
              <option value="legal">Legal/Citation</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Moved to Seattle"
              className="w-full bg-slate-50 border-none rounded-lg p-2 text-sm"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              Description
            </label>
            <textarea
              className="w-full bg-slate-50 border-none rounded-lg p-2 text-sm resize-none"
              rows={3}
              placeholder="Add details about this event..."
              value={newEvent.desc}
              onChange={(e) => setNewEvent({ ...newEvent, desc: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              Evidence Link (Cloud Storage URL)
            </label>
            <input
              type="url"
              placeholder="https://drive.google.com/..."
              className="w-full bg-slate-50 border-none rounded-lg p-2 text-sm"
              value={newEvent.evidenceLink}
              onChange={(e) => setNewEvent({ ...newEvent, evidenceLink: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-700 transition"
          >
            Save Event
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default TimelineManager;
