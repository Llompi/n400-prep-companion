import { useState } from 'react';
import { Icon } from './Icon';

interface IntegratedNoteProps {
  id: string;
  notes: Record<string, string>;
  onSave: (id: string, content: string) => void;
  label?: string;
}

export function IntegratedNote({
  id,
  notes,
  onSave,
  label = 'Add a note...',
}: IntegratedNoteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const noteContent = notes[id] || '';

  const handleSave = (text: string) => {
    onSave(id, text);
  };

  return (
    <div className="mt-2 w-full">
      {!isOpen && !noteContent && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-wider"
        >
          <Icon name="message-square" size={12} />
          {label}
        </button>
      )}
      {(isOpen || noteContent) && (
        <div className="relative group">
          <textarea
            className="w-full bg-amber-50/70 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-md p-2 text-xs text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-400 dark:focus:border-amber-600 focus:ring-1 focus:ring-amber-200 dark:focus:ring-amber-800 transition-all resize-none font-serif leading-relaxed"
            rows={isOpen || noteContent.length > 50 ? 3 : 1}
            placeholder="Type your notes here..."
            value={noteContent}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => handleSave(e.target.value)}
            onBlur={() => !noteContent && setIsOpen(false)}
            autoFocus={isOpen}
          />
          {noteContent && (
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave('');
                  setIsOpen(false);
                }}
                className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400"
                aria-label="Clear note"
              >
                <Icon name="x" size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default IntegratedNote;
