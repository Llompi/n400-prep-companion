import { useState, useMemo } from 'react';
import { Icon } from '../ui/Icon';
import { IntegratedNote } from '../ui/IntegratedNote';
import { Modal } from '../ui/Modal';
import type { Document, DocumentStatus, NotesStore } from '../../types';

interface DocManagerProps {
  docs: Document[];
  notes: NotesStore;
  onUpdateDocument: (doc: Document) => void;
  onSetAllDocuments: (docs: Document[]) => void;
  onNoteChange: (id: string, content: string) => void;
}

const STATUS_ORDER: DocumentStatus[] = ['missing', 'found', 'copied', 'uploaded', 'packed'];

const STATUS_CONFIG: Record<DocumentStatus, { bg: string; text: string; icon: 'circle' | 'check-circle' }> = {
  missing: { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-500 dark:text-slate-400', icon: 'circle' },
  found: { bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', icon: 'circle' },
  copied: { bg: 'bg-purple-50 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', icon: 'circle' },
  uploaded: { bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', icon: 'circle' },
  packed: { bg: 'bg-green-50 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', icon: 'check-circle' },
};

export function DocManager({ docs, notes, onUpdateDocument, onSetAllDocuments, onNoteChange }: DocManagerProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddSubModal, setShowAddSubModal] = useState<string | null>(null);
  const [newDocName, setNewDocName] = useState('');
  const [newDocRequired, setNewDocRequired] = useState(false);

  // Organize docs: parents first, then their children immediately after
  const organizedDocs = useMemo(() => {
    const parents = docs.filter(d => !d.parentId);
    const result: { doc: Document; isChild: boolean; parentName?: string }[] = [];

    parents.forEach(parent => {
      result.push({ doc: parent, isChild: false });
      const children = docs.filter(d => d.parentId === parent.id);
      children.forEach(child => {
        result.push({ doc: child, isChild: true, parentName: parent.name });
      });
    });

    return result;
  }, [docs]);

  const advanceStatus = (doc: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    const idx = STATUS_ORDER.indexOf(doc.status);
    const nextStatus = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
    onUpdateDocument({ ...doc, status: nextStatus });
  };

  const resetStatus = (doc: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateDocument({ ...doc, status: 'missing' });
  };

  const updateMeta = (doc: Document, field: keyof Document['meta'], value: string) => {
    onUpdateDocument({
      ...doc,
      meta: { ...doc.meta, [field]: value },
    });
  };

  const handleAddDocument = (parentId?: string) => {
    if (!newDocName.trim()) return;

    const newDoc: Document = {
      id: `custom_${Date.now()}`,
      name: newDocName.trim(),
      status: 'missing',
      required: newDocRequired,
      meta: {},
      isCustom: true,
      parentId,
    };

    onSetAllDocuments([...docs, newDoc]);
    setNewDocName('');
    setNewDocRequired(false);
    setShowAddModal(false);
    setShowAddSubModal(null);
  };

  const handleRemoveDocument = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Remove this document from the list?')) {
      const updatedDocs = docs.filter(d => d.id !== docId && d.parentId !== docId);
      onSetAllDocuments(updatedDocs);
      if (expanded === docId) setExpanded(null);
    }
  };

  const toggleExpand = (docId: string) => {
    setExpanded(expanded === docId ? null : docId);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif text-slate-800 dark:text-slate-100">Documents</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
        >
          <Icon name="plus" size={16} />
          <span className="font-medium">Add</span>
        </button>
      </div>

      {/* Document List */}
      <div className="space-y-2">
        {organizedDocs.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-100 dark:border-slate-700">
            <Icon name="folder" size={48} className="mx-auto text-slate-200 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No documents yet</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Add your first document
            </button>
          </div>
        ) : (
          organizedDocs.map(({ doc, isChild }) => {
            const isExp = expanded === doc.id;
            const config = STATUS_CONFIG[doc.status];
            const hasChildren = docs.some(d => d.parentId === doc.id);

            return (
              <div
                key={doc.id}
                className={`group ${isChild ? 'ml-8' : ''}`}
              >
                {/* Document Card */}
                <div
                  onClick={() => toggleExpand(doc.id)}
                  className={`
                    bg-white dark:bg-slate-800 rounded-xl p-4 cursor-pointer
                    border border-transparent hover:border-slate-200 dark:hover:border-slate-600
                    transition-all duration-200
                    ${isExp ? 'ring-2 ring-blue-100 dark:ring-blue-900 border-blue-200 dark:border-blue-800' : ''}
                    ${isChild ? 'bg-slate-50/50 dark:bg-slate-800/50' : ''}
                  `}
                >
                  <div className="flex items-center gap-4">
                    {/* Expand indicator for parents with children */}
                    <div className="w-5 flex-shrink-0">
                      {hasChildren && (
                        <Icon
                          name={isExp ? 'chevron-down' : 'chevron-up'}
                          size={16}
                          className="text-slate-300 dark:text-slate-600"
                        />
                      )}
                      {isChild && (
                        <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-600 ml-1.5" />
                      )}
                    </div>

                    {/* Document Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-medium truncate ${
                          doc.status === 'packed'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-slate-800 dark:text-slate-100'
                        }`}>
                          {doc.name}
                        </h3>
                        {doc.required && (
                          <span className="text-[10px] font-semibold bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded">
                            REQ
                          </span>
                        )}
                        {doc.isCustom && (
                          <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded">
                            CUSTOM
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Button */}
                    <button
                      onClick={(e) => advanceStatus(doc, e)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${config.bg} ${config.text}`}
                    >
                      <Icon name={config.icon} size={14} />
                      <span className="capitalize">{doc.status}</span>
                    </button>

                    {/* Delete for custom docs */}
                    {doc.isCustom && (
                      <button
                        onClick={(e) => handleRemoveDocument(doc.id, e)}
                        className="p-1.5 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Icon name="trash-2" size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExp && (
                  <div className="mt-2 ml-9 mr-2 animate-fade-in">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 space-y-4 border border-slate-100 dark:border-slate-700">
                      {/* Meta Fields */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">
                            Expiration
                          </label>
                          <input
                            type="date"
                            className="w-full text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            value={doc.meta?.expiry || ''}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updateMeta(doc, 'expiry', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">
                            Issuer
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. DMV, IRS"
                            className="w-full text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            value={doc.meta?.issuer || ''}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updateMeta(doc, 'issuer', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">
                          Location
                        </label>
                        <input
                          type="text"
                          placeholder="Where is this document stored?"
                          className="w-full text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          value={doc.meta?.location || ''}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => updateMeta(doc, 'location', e.target.value)}
                        />
                      </div>

                      {/* Notes */}
                      <IntegratedNote
                        id={`doc_${doc.id}`}
                        notes={notes}
                        onSave={onNoteChange}
                        label="Add notes"
                      />

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                        {!isChild && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAddSubModal(doc.id);
                            }}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1.5 font-medium"
                          >
                            <Icon name="plus" size={14} />
                            Add sub-item
                          </button>
                        )}
                        <button
                          onClick={(e) => resetStatus(doc, e)}
                          className="text-xs text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 ml-auto"
                        >
                          Reset status
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Document Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setNewDocName('');
          setNewDocRequired(false);
        }}
        title="Add Document"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
              Document name
            </label>
            <input
              type="text"
              placeholder="e.g. Birth Certificate"
              className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              autoFocus
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={newDocRequired}
              onChange={(e) => setNewDocRequired(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-600 dark:text-slate-300">Mark as required</span>
          </label>
          <div className="flex justify-end gap-3 pt-3">
            <button
              onClick={() => {
                setShowAddModal(false);
                setNewDocName('');
                setNewDocRequired(false);
              }}
              className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={() => handleAddDocument()}
              disabled={!newDocName.trim()}
              className="px-5 py-2 text-sm bg-slate-800 dark:bg-slate-100 hover:bg-slate-700 dark:hover:bg-white disabled:bg-slate-200 dark:disabled:bg-slate-700 text-white dark:text-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 rounded-lg font-medium transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Sub-document Modal */}
      <Modal
        isOpen={!!showAddSubModal}
        onClose={() => {
          setShowAddSubModal(null);
          setNewDocName('');
          setNewDocRequired(false);
        }}
        title="Add Sub-item"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Adding to <span className="font-medium text-slate-700 dark:text-slate-200">
              {docs.find(d => d.id === showAddSubModal)?.name}
            </span>
          </p>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
              Name
            </label>
            <input
              type="text"
              placeholder="e.g. 2024, Copy 1"
              className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              autoFocus
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={newDocRequired}
              onChange={(e) => setNewDocRequired(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-600 dark:text-slate-300">Mark as required</span>
          </label>
          <div className="flex justify-end gap-3 pt-3">
            <button
              onClick={() => {
                setShowAddSubModal(null);
                setNewDocName('');
                setNewDocRequired(false);
              }}
              className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={() => handleAddDocument(showAddSubModal!)}
              disabled={!newDocName.trim()}
              className="px-5 py-2 text-sm bg-slate-800 dark:bg-slate-100 hover:bg-slate-700 dark:hover:bg-white disabled:bg-slate-200 dark:disabled:bg-slate-700 text-white dark:text-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 rounded-lg font-medium transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DocManager;
