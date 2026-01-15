import { useState } from 'react';
import { Icon } from '../ui/Icon';
import { IntegratedNote } from '../ui/IntegratedNote';
import type { Document, DocumentStatus, NotesStore } from '../../types';

interface DocManagerProps {
  docs: Document[];
  notes: NotesStore;
  onUpdateDocument: (doc: Document) => void;
  onNoteChange: (id: string, content: string) => void;
}

const STATUS_ORDER: DocumentStatus[] = ['missing', 'found', 'copied', 'uploaded', 'packed'];

const STATUS_COLORS: Record<DocumentStatus, string> = {
  packed: 'bg-green-100 text-green-700 border-green-200',
  uploaded: 'bg-blue-100 text-blue-700 border-blue-200',
  copied: 'bg-purple-100 text-purple-700 border-purple-200',
  found: 'bg-amber-100 text-amber-700 border-amber-200',
  missing: 'bg-slate-100 text-slate-500 border-slate-200',
};

export function DocManager({ docs, notes, onUpdateDocument, onNoteChange }: DocManagerProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

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

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-serif text-slate-800">Documents</h2>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {docs.map((doc) => {
          const isExp = expanded === doc.id;
          return (
            <div
              key={doc.id}
              className={`border-b border-slate-50 transition-colors ${
                isExp ? 'bg-slate-50/50' : 'hover:bg-slate-50'
              }`}
            >
              {/* Main Row */}
              <div
                className="p-5 cursor-pointer flex items-center justify-between gap-4"
                onClick={() => setExpanded(isExp ? null : doc.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3
                      className={`font-serif text-base ${
                        doc.status === 'packed'
                          ? 'text-green-700 line-through opacity-70'
                          : 'text-slate-800'
                      }`}
                    >
                      {doc.name}
                    </h3>
                    {doc.required && (
                      <span className="text-[9px] font-bold bg-red-50 text-red-400 px-1.5 py-0.5 rounded tracking-wider uppercase">
                        Req
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-sans">{doc.notes}</p>
                </div>

                <div className="flex items-center gap-3">
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
                  <Icon
                    name={isExp ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    className="text-slate-300"
                  />
                </div>
              </div>

              {/* Expanded Details */}
              {isExp && (
                <div className="px-5 pb-5 pt-0 animate-fade-in">
                  <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                          Expiration Date
                        </label>
                        <input
                          type="date"
                          className="w-full text-xs bg-slate-50 border-none rounded p-2"
                          value={doc.meta?.expiry || ''}
                          onChange={(e) => updateMeta(doc, 'expiry', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                          Issuing Authority
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. DMV"
                          className="w-full text-xs bg-slate-50 border-none rounded p-2"
                          value={doc.meta?.issuer || ''}
                          onChange={(e) => updateMeta(doc, 'issuer', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                        Physical Location Details
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Blue binder, second sleeve"
                        className="w-full text-xs bg-slate-50 border-none rounded p-2"
                        value={doc.meta?.location || ''}
                        onChange={(e) => updateMeta(doc, 'location', e.target.value)}
                      />
                    </div>
                    <IntegratedNote
                      id={`doc_${doc.id}`}
                      notes={notes}
                      onSave={onNoteChange}
                      label="Add notes about this document"
                    />
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => resetStatus(doc)}
                        className="text-xs text-red-300 hover:text-red-500"
                      >
                        Reset Status
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DocManager;
