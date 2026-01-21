import type { ReactNode } from 'react';
import { Icon } from './Icon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800 z-10">
          <h3 id="modal-title" className="font-serif text-lg text-slate-800 dark:text-slate-100">
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Icon name="x" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
