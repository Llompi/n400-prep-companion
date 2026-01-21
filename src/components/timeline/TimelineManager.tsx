import { useState, useMemo, type FormEvent } from 'react';
import { Icon } from '../ui/Icon';
import { Modal } from '../ui/Modal';
import { IntegratedNote } from '../ui/IntegratedNote';
import type { TimelineEvent, UserSettings, NotesStore, EventType, Document, EventCategory } from '../../types';
import { DEFAULT_EVENT_CATEGORIES } from '../../types';

interface TimelineManagerProps {
  events: TimelineEvent[];
  docs: Document[];
  settings: UserSettings;
  notes: NotesStore;
  onAddEvent: (event: TimelineEvent) => void;
  onUpdateEvent: (event: TimelineEvent) => void;
  onDeleteEvent: (id: string) => void;
  onNoteChange: (id: string, content: string) => void;
  onUpdateSettings: (settings: UserSettings) => void;
}

// Generate color classes for a given color name
const getColorClasses = (color: string) => {
  const colorMap: Record<string, string> = {
    purple: 'text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/50',
    green: 'text-green-600 dark:text-green-300 bg-green-100 dark:bg-green-900/50',
    blue: 'text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50',
    red: 'text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-900/50',
    amber: 'text-amber-600 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50',
    slate: 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700',
    pink: 'text-pink-600 dark:text-pink-300 bg-pink-100 dark:bg-pink-900/50',
    cyan: 'text-cyan-600 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-900/50',
    orange: 'text-orange-600 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/50',
    teal: 'text-teal-600 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/50',
    indigo: 'text-indigo-600 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50',
  };
  return colorMap[color] || colorMap.slate;
};

const AVAILABLE_COLORS = ['green', 'blue', 'purple', 'red', 'amber', 'pink', 'cyan', 'orange', 'teal', 'indigo', 'slate'];

interface EventForm {
  id?: string;
  date: string;
  endDate: string;
  type: EventType;
  title: string;
  desc: string;
  linkedDocIds: string[];
  evidenceLink: string;
}

const INITIAL_FORM: EventForm = {
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
  onUpdateEvent,
  onDeleteEvent,
  onNoteChange,
  onUpdateSettings,
}: TimelineManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [eventForm, setEventForm] = useState<EventForm>(INITIAL_FORM);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategory, setNewCategory] = useState({ label: '', color: 'blue' });
  const [editingCategory, setEditingCategory] = useState<EventCategory | null>(null);

  // Get event categories from settings or use defaults
  const eventCategories = settings.eventCategories || DEFAULT_EVENT_CATEGORIES;

  // Build filter options from categories
  const filterOptions = useMemo(() => {
    return ['all', ...eventCategories.map(c => c.id)];
  }, [eventCategories]);

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [events]
  );

  const filteredEvents =
    filter === 'all' ? sortedEvents : sortedEvents.filter((e) => e.type === filter);

  // Get category by ID
  const getCategory = (typeId: string): EventCategory => {
    return eventCategories.find(c => c.id === typeId) || { id: typeId, label: typeId, color: 'slate' };
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const event: TimelineEvent = {
      id: isEditing && eventForm.id ? eventForm.id : Date.now().toString(),
      date: eventForm.date,
      endDate: eventForm.endDate || undefined,
      type: eventForm.type,
      title: eventForm.title,
      desc: eventForm.desc || undefined,
      linkedDocIds: eventForm.linkedDocIds.length > 0 ? eventForm.linkedDocIds : undefined,
      evidenceLink: eventForm.evidenceLink || undefined,
    };

    if (isEditing) {
      onUpdateEvent(event);
    } else {
      onAddEvent(event);
    }

    closeModal();
  };

  const openAddModal = () => {
    setEventForm(INITIAL_FORM);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (ev: TimelineEvent) => {
    setEventForm({
      id: ev.id,
      date: ev.date,
      endDate: ev.endDate || '',
      type: ev.type,
      title: ev.title,
      desc: ev.desc || '',
      linkedDocIds: ev.linkedDocIds || [],
      evidenceLink: ev.evidenceLink || '',
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEventForm(INITIAL_FORM);
  };

  const toggleDocLink = (docId: string) => {
    setEventForm(prev => ({
      ...prev,
      linkedDocIds: prev.linkedDocIds.includes(docId)
        ? prev.linkedDocIds.filter(id => id !== docId)
        : [...prev.linkedDocIds, docId]
    }));
  };

  const getDocName = (docId: string) => {
    const doc = docs.find(d => d.id === docId);
    return doc?.name || docId;
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this event?')) {
      onDeleteEvent(id);
    }
  };

  // Category management
  const handleAddCategory = () => {
    if (!newCategory.label.trim()) return;
    const id = newCategory.label.toLowerCase().replace(/\s+/g, '-');
    const updatedCategories = [...eventCategories, { id, label: newCategory.label, color: newCategory.color }];
    onUpdateSettings({ ...settings, eventCategories: updatedCategories });
    setNewCategory({ label: '', color: 'blue' });
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !editingCategory.label.trim()) return;
    const updatedCategories = eventCategories.map(c =>
      c.id === editingCategory.id ? editingCategory : c
    );
    onUpdateSettings({ ...settings, eventCategories: updatedCategories });
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Delete this category? Events using it will show as "unknown".')) {
      const updatedCategories = eventCategories.filter(c => c.id !== id);
      onUpdateSettings({ ...settings, eventCategories: updatedCategories });
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-slate-800 dark:text-slate-100">Timeline</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCategoryManager(true)}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-3 py-2 rounded-full flex items-center gap-2 text-sm border border-slate-200 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 transition"
          >
            <Icon name="settings" size={16} /> Categories
          </button>
          <button
            onClick={openAddModal}
            className="bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 px-4 py-2 rounded-full flex items-center gap-2 text-sm shadow hover:bg-slate-700 dark:hover:bg-slate-300 transition"
          >
            <Icon name="plus" size={16} /> Add Event
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {filterOptions.map((f) => {
          const cat = f === 'all' ? null : getCategory(f);
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition border whitespace-nowrap ${
                filter === f
                  ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 border-slate-800 dark:border-slate-200'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
              }`}
            >
              {f === 'all' ? 'All' : cat?.label || f}
            </button>
          );
        })}
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
        {filteredEvents.map((ev) => {
          const cat = getCategory(ev.type);
          return (
            <div key={ev.id} className="relative group">
              <div className="absolute -left-[37px] top-5 w-4 h-4 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 z-10 group-hover:scale-110 transition" />
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md dark:hover:shadow-slate-900/50 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${getColorClasses(cat.color)}`}>
                      {cat.label}
                    </span>
                    <h3 className="font-serif text-lg text-slate-800 dark:text-slate-100 mt-2">{ev.title}</h3>
                    <div className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-1">
                      {ev.date} {ev.endDate ? `— ${ev.endDate}` : ''}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditModal(ev)}
                      className="p-1.5 text-slate-300 dark:text-slate-600 hover:text-blue-500 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Edit event"
                    >
                      <Icon name="pencil" size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(ev.id)}
                      className="p-1.5 text-slate-300 dark:text-slate-600 hover:text-red-400 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Delete event"
                    >
                      <Icon name="trash-2" size={16} />
                    </button>
                  </div>
                </div>

                {ev.desc && (
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 font-sans leading-relaxed">
                    {ev.desc}
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap gap-2">
                  {(ev.linkedDocIds && ev.linkedDocIds.length > 0) || ev.evidenceRef || ev.evidenceLink ? (
                    <>
                      {ev.linkedDocIds?.map(docId => (
                        <span
                          key={docId}
                          className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded"
                        >
                          <Icon name="folder" size={12} className="text-amber-500 dark:text-amber-400" />
                          {getDocName(docId)}
                        </span>
                      ))}
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
          );
        })}
      </div>

      {/* Add/Edit Event Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={isEditing ? 'Edit Event' : 'Add Timeline Event'}>
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
                value={eventForm.date}
                onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                End Date
              </label>
              <input
                type="date"
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={eventForm.endDate}
                onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Category
            </label>
            <select
              className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={eventForm.type}
              onChange={(e) => setEventForm({ ...eventForm, type: e.target.value as EventType })}
            >
              {eventCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
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
              value={eventForm.title}
              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
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
              value={eventForm.desc}
              onChange={(e) => setEventForm({ ...eventForm, desc: e.target.value })}
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
                      eventForm.linkedDocIds.includes(doc.id)
                        ? 'bg-blue-100 dark:bg-blue-900/50'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={eventForm.linkedDocIds.includes(doc.id)}
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
            {eventForm.linkedDocIds.length > 0 && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {eventForm.linkedDocIds.length} document{eventForm.linkedDocIds.length > 1 ? 's' : ''} selected
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
              value={eventForm.evidenceLink}
              onChange={(e) => setEventForm({ ...eventForm, evidenceLink: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition"
          >
            {isEditing ? 'Update Event' : 'Save Event'}
          </button>
        </form>
      </Modal>

      {/* Category Manager Modal */}
      <Modal isOpen={showCategoryManager} onClose={() => setShowCategoryManager(false)} title="Manage Event Categories">
        <div className="space-y-4">
          {/* Existing categories */}
          <div className="space-y-2">
            {eventCategories.map(cat => (
              <div key={cat.id} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                {editingCategory?.id === cat.id ? (
                  <>
                    <input
                      type="text"
                      className="flex-1 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded px-2 py-1 text-sm text-slate-800 dark:text-slate-100"
                      value={editingCategory.label}
                      onChange={(e) => setEditingCategory({ ...editingCategory, label: e.target.value })}
                    />
                    <select
                      className="bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded px-2 py-1 text-sm"
                      value={editingCategory.color}
                      onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                    >
                      {AVAILABLE_COLORS.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleUpdateCategory}
                      className="p-1 text-green-600 hover:text-green-700"
                    >
                      <Icon name="check" size={16} />
                    </button>
                    <button
                      onClick={() => setEditingCategory(null)}
                      className="p-1 text-slate-400 hover:text-slate-600"
                    >
                      <Icon name="x" size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getColorClasses(cat.color)}`}>
                      {cat.label}
                    </span>
                    <span className="flex-1 text-sm text-slate-500 dark:text-slate-400">({cat.id})</span>
                    <button
                      onClick={() => setEditingCategory(cat)}
                      className="p-1 text-slate-400 hover:text-blue-500"
                    >
                      <Icon name="pencil" size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-1 text-slate-400 hover:text-red-500"
                    >
                      <Icon name="trash-2" size={14} />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Add new category */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-600">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Add New Category</h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Category name"
                className="flex-1 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                value={newCategory.label}
                onChange={(e) => setNewCategory({ ...newCategory, label: e.target.value })}
              />
              <select
                className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm"
                value={newCategory.color}
                onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
              >
                {AVAILABLE_COLORS.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                onClick={handleAddCategory}
                disabled={!newCategory.label.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg text-sm font-medium transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default TimelineManager;
