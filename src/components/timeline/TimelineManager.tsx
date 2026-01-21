import { useState, useMemo, type FormEvent } from 'react';
import { Icon } from '../ui/Icon';
import { Modal } from '../ui/Modal';
import { IntegratedNote } from '../ui/IntegratedNote';
import type { TimelineEvent, UserSettings, NotesStore, EventType, Document } from '../../types';

interface TimelineManagerProps {
  events: TimelineEvent[];
  docs: Document[];
  settings: UserSettings;
  notes: NotesStore;
  onAddEvent: (event: TimelineEvent) => void;
  onDeleteEvent: (id: string) => void;
  onNoteChange: (id: string, content: string) => void;
}

const EVENT_TYPE_COLORS: Record<EventType | 'other', string> = {
  trip: 'text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/50',
  address: 'text-green-600 dark:text-green-300 bg-green-100 dark:bg-green-900/50',
  employment: 'text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50',
  legal: 'text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-900/50',
  tax: 'text-amber-600 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50',
  other: 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700',
};

const FILTER_OPTIONS = ['all', 'address', 'employment', 'trip', 'tax', 'legal'] as const;

interface NewEventForm {
  date: string;
  endDate: string;
  type: EventType;
  title: string;
  desc: string;
  linkedDocIds: string[];
  evidenceLink: string;
}

const INITIAL_FORM: NewEventForm = {
  date: '',
  endDate: '',
  type: 'address',
  title: '',
  desc: '',
  linkedDocIds: [],
  evidenceLink: '',
};

export function TimelineManager({
  events,
  docs,
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
      id: Date.now().toString(),
      date: newEvent.date,
      endDate: newEvent.endDate || undefined,
      type: newEvent.type,
      title: newEvent.title,
      desc: newEvent.desc || undefined,
      linkedDocIds: newEvent.linkedDocIds.length > 0 ? newEvent.linkedDocIds : undefined,
      evidenceLink: newEvent.evidenceLink || undefined,
    };
    onAddEvent(event);
    setIsAdding(false);
    setNewEvent(INITIAL_FORM);
  };

  const toggleDocLink = (docId: string) => {
    setNewEvent(prev => ({
      ...prev,
      linkedDocIds: prev.linkedDocIds.includes(docId)
        ? prev.linkedDocIds.filter(id => id !== docId)
        : [...prev.linkedDocIds, docId]
    }));
  };

  // Helper to get document name by ID
  const getDocName = (docId: string) => {
    const doc = docs.find(d => d.id === docId);
    return doc?.name || docId;
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this event?')) {
      onDeleteEvent(id);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-slate-800 dark:text-slate-100">Timeline</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 px-4 py-2 rounded-full flex items-center gap-2 text-sm shadow hover:bg-slate-700 dark:hover:bg-slate-300 transition"
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
                ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 border-slate-800 dark:border-slate-200'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative pl-8 border-l border-slate-200 dark:border-slate-700 space-y-8">
        {/* Future Node - Interview */}
        <div className="relative">
          <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-blue-500 dark:bg-blue-400 ring-4 ring-blue-100 dark:ring-blue-900/50" />
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                  Upcoming
                </span>
                <h3 className="font-serif text-lg text-slate-800 dark:text-slate-100 mt-1">Interview</h3>
                <div className="text-sm text-slate-500 dark:text-slate-400 font-sans mt-1">
                  {settings.interviewDate || 'Date pending'}
                </div>
              </div>
              <Icon name="flag" className="text-blue-300 dark:text-blue-600" size={24} />
            </div>
            <IntegratedNote id="timeline_target" notes={notes} onSave={onNoteChange} />
          </div>
        </div>

        {/* Events */}
        {filteredEvents.map((ev) => (
          <div key={ev.id} className="relative group">
            <div className="absolute -left-[37px] top-5 w-4 h-4 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 z-10 group-hover:scale-110 transition" />
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md dark:hover:shadow-slate-900/50 transition">
              <div className="flex justify-between items-start">
                <div>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${
                      EVENT_TYPE_COLORS[ev.type] || EVENT_TYPE_COLORS.other
                    }`}
                  >
                    {ev.type}
                  </span>
                  <h3 className="font-serif text-lg text-slate-800 dark:text-slate-100 mt-2">{ev.title}</h3>
                  <div className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-1">
                    {ev.date} {ev.endDate ? `— ${ev.endDate}` : ''}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(ev.id)}
                  className="text-slate-300 dark:text-slate-600 hover:text-red-400 dark:hover:text-red-400 transition"
                  aria-label="Delete event"
                >
                  <Icon name="trash-2" size={16} />
                </button>
              </div>

              {ev.desc && (
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 font-sans leading-relaxed">
                  {ev.desc}
                </p>
              )}

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap gap-2">
                {(ev.linkedDocIds && ev.linkedDocIds.length > 0) || ev.evidenceRef || ev.evidenceLink ? (
                  <>
                    {/* Display linked documents */}
                    {ev.linkedDocIds?.map(docId => (
                      <span
                        key={docId}
                        className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded"
                      >
                        <Icon name="folder" size={12} className="text-amber-500 dark:text-amber-400" />
                        {getDocName(docId)}
                      </span>
                    ))}
                    {/* Legacy: display old evidenceRef if no linkedDocIds */}
                    {ev.evidenceRef && (!ev.linkedDocIds || ev.linkedDocIds.length === 0) && (
                      <span className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                        <Icon name="folder" size={12} className="text-amber-500 dark:text-amber-400" />
                        {ev.evidenceRef}
                      </span>
                    )}
                    {ev.evidenceLink && (
                      <a
                        href={ev.evidenceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-900 transition"
                      >
                        <Icon name="link" size={12} /> Link
                      </a>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-red-400 dark:text-red-300 italic flex items-center gap-1">
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
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                Start Date
              </label>
              <input
                type="date"
                required
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                End Date
              </label>
              <input
                type="date"
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newEvent.endDate}
                onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Category
            </label>
            <select
              className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Moved to Seattle"
              className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Description
            </label>
            <textarea
              className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Add details about this event..."
              value={newEvent.desc}
              onChange={(e) => setNewEvent({ ...newEvent, desc: e.target.value })}
            />
          </div>
          {/* Document Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
              Link Documents
            </label>
            {docs.length > 0 ? (
              <div className="max-h-40 overflow-y-auto bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-2 space-y-1">
                {docs.filter(d => !d.parentId).map(doc => (
                  <label
                    key={doc.id}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                      newEvent.linkedDocIds.includes(doc.id)
                        ? 'bg-blue-100 dark:bg-blue-900/50'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={newEvent.linkedDocIds.includes(doc.id)}
                      onChange={() => toggleDocLink(doc.id)}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                    />
                    <Icon name="folder" size={14} className="text-amber-500 dark:text-amber-400 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-200 truncate">{doc.name}</span>
                    {doc.required && (
                      <span className="text-[9px] font-semibold bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 px-1 py-0.5 rounded ml-auto flex-shrink-0">
                        REQ
                      </span>
                    )}
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500 italic">
                No documents available. Add documents in the Documents tab.
              </p>
            )}
            {newEvent.linkedDocIds.length > 0 && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {newEvent.linkedDocIds.length} document{newEvent.linkedDocIds.length > 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Evidence Link (Cloud Storage URL)
            </label>
            <input
              type="url"
              placeholder="https://drive.google.com/..."
              className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newEvent.evidenceLink}
              onChange={(e) => setNewEvent({ ...newEvent, evidenceLink: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition"
          >
            Save Event
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default TimelineManager;
