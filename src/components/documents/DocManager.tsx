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

const STATUS_COLORS: Record<DocumentStatus, string> = {
  packed: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700',
  uploaded: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700',
  copied: 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700',
  found: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-700',
  missing: 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600',
};

export function DocManager({ docs, notes, onUpdateDocument, onSetAllDocuments, onNoteChange }: DocManagerProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddSubModal, setShowAddSubModal] = useState<string | null>(null);
  const [newDocName, setNewDocName] = useState('');
  const [newDocRequired, setNewDocRequired] = useState(false);

  // Organize docs into parent-child structure
  const { parentDocs, childDocsByParent } = useMemo(() => {
    const parents = docs.filter(d => !d.parentId);
    const children: Record<string, Document[]> = {};

    docs.filter(d => d.parentId).forEach(doc => {
      if (!children[doc.parentId!]) {
        children[doc.parentId!] = [];
      }
      children[doc.parentId!].push(doc);
    });

    return { parentDocs: parents, childDocsByParent: children };
  }, [docs]);

  const advanceStatus = (doc: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    const idx = STATUS_ORDER.indexOf(doc.status);
    const nextStatus = STATUS_ORDER[Math.min(idx + 1, STATUS_ORDER.length - 1)];
    onUpdateDocument({ ...doc, status: nextStatus });
  };

  const resetStatus = (doc: Document) => {
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
      // Also remove any children
      const updatedDocs = docs.filter(d => d.id !== docId && d.parentId !== docId);
      onSetAllDocuments(updatedDocs);
      if (expanded === docId) setExpanded(null);
    }
  };

  const renderDocumentRow = (doc: Document, isChild = false) => {
    const isExp = expanded === doc.id;
    const children = childDocsByParent[doc.id] || [];
    const hasChildren = children.length > 0;

    return (
      <div key={doc.id}>
        <div
          className={`border-b border-slate-100 dark:border-slate-700 transition-colors ${
            isExp ? 'bg-slate-50/50 dark:bg-slate-800/50' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
          } ${isChild ? 'ml-6 border-l-2 border-l-slate-200 dark:border-l-slate-600' : ''}`}
        >
          {/* Main Row */}
          <div
            className="p-5 cursor-pointer flex items-center justify-between gap-4"
            onClick={() => setExpanded(isExp ? null : doc.id)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                {hasChildren && (
                  <Icon
                    name={isExp ? 'chevron-down' : 'chevron-up'}
                    size={14}
                    className="text-slate-400 dark:text-slate-500 flex-shrink-0"
                  />
                )}
                <h3
                  className={`font-serif text-base truncate ${
                    doc.status === 'packed'
                      ? 'text-green-700 dark:text-green-400 line-through opacity-70'
                      : 'text-slate-800 dark:text-slate-100'
                  }`}
                >
                  {doc.name}
                </h3>
                {doc.required && (
                  <span className="text-[9px] font-bold bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 px-1.5 py-0.5 rounded tracking-wider uppercase flex-shrink-0">
                    Req
                  </span>
                )}
                {doc.isCustom && (
                  <span className="text-[9px] font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded tracking-wider uppercase flex-shrink-0">
                    Custom
                  </span>
                )}
              </div>
              {doc.notes && (
                <p className="text-xs text-slate-500 dark:text-slate-400 font-sans truncate">{doc.notes}</p>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={(e) => advanceStatus(doc, e)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${
                  STATUS_COLORS[doc.status]
                } flex items-center gap-2 min-w-[100px] justify-center`}
              >
                <Icon
                  name={doc.status === 'packed' ? 'check-circle' : 'circle'}
                  size={12}
                />
                {doc.status}
              </button>
              {doc.isCustom && (
                <button
                  onClick={(e) => handleRemoveDocument(doc.id, e)}
                  className="p-1.5 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors"
                  title="Remove document"
                >
                  <Icon name="trash-2" size={14} />
                </button>
              )}
              <Icon
                name={isExp ? 'chevron-up' : 'chevron-down'}
                size={16}
                className="text-slate-400 dark:text-slate-500"
              />
            </div>
          </div>

          {/* Expanded Details */}
          {isExp && (
            <div className="px-5 pb-5 pt-0 animate-fade-in">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Expiration Date
                    </label>
                    <input
                      type="date"
                      className="w-full text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded p-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={doc.meta?.expiry || ''}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateMeta(doc, 'expiry', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Issuing Authority
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. DMV"
                      className="w-full text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded p-2 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={doc.meta?.issuer || ''}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateMeta(doc, 'issuer', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                    Physical Location Details
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Blue binder, second sleeve"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded p-2 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={doc.meta?.location || ''}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateMeta(doc, 'location', e.target.value)}
                  />
                </div>
                <IntegratedNote
                  id={`doc_${doc.id}`}
                  notes={notes}
                  onSave={onNoteChange}
                  label="Add notes about this document"
                />
                <div className="pt-2 flex justify-between items-center">
                  {!isChild && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAddSubModal(doc.id);
                      }}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                    >
                      <Icon name="folder-plus" size={12} />
                      Add Sub-document
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetStatus(doc);
                    }}
                    className="text-xs text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 ml-auto"
                  >
                    Reset Status
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Render children if expanded */}
        {isExp && children.map(child => renderDocumentRow(child, true))}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif text-slate-800 dark:text-slate-100">Documents</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Icon name="plus" size={16} />
          Add Document
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {parentDocs.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="folder" size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">No documents yet. Add your first document to get started.</p>
          </div>
        ) : (
          parentDocs.map(doc => renderDocumentRow(doc))
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
        title="Add New Document"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              Document Name
            </label>
            <input
              type="text"
              placeholder="e.g. Tax Returns 2024"
              className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-3 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              autoFocus
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={newDocRequired}
              onChange={(e) => setNewDocRequired(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-200">Mark as required</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => {
                setShowAddModal(false);
                setNewDocName('');
                setNewDocRequired(false);
              }}
              className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleAddDocument()}
              disabled={!newDocName.trim()}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Add Document
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
        title="Add Sub-document"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Adding to: <span className="font-medium text-slate-700 dark:text-slate-200">
              {docs.find(d => d.id === showAddSubModal)?.name}
            </span>
          </p>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              Sub-document Name
            </label>
            <input
              type="text"
              placeholder="e.g. 2024, 2023, etc."
              className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-3 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              autoFocus
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={newDocRequired}
              onChange={(e) => setNewDocRequired(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-200">Mark as required</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => {
                setShowAddSubModal(null);
                setNewDocName('');
                setNewDocRequired(false);
              }}
              className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleAddDocument(showAddSubModal!)}
              disabled={!newDocName.trim()}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Add Sub-document
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DocManager;
