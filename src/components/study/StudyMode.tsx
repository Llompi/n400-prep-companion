import { useState, useMemo, type ChangeEvent } from 'react';
import { Icon } from '../ui/Icon';
import { IntegratedNote } from '../ui/IntegratedNote';
import { ParticleBackground } from './ParticleBackground';
import type { CivicsQuestion, MasteryStore, NotesStore } from '../../types';

interface StudyModeProps {
  questions: CivicsQuestion[];
  mastery: MasteryStore;
  notes: NotesStore;
  onToggleMastery: (questionId: number) => void;
  onNoteChange: (id: string, content: string) => void;
  onImportQuestions: (questions: CivicsQuestion[]) => void;
}

export function StudyMode({
  questions,
  mastery,
  notes,
  onToggleMastery,
  onNoteChange,
  onImportQuestions,
}: StudyModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showMastered, setShowMastered] = useState(true);

  const activeQuestions = useMemo(() => {
    return showMastered ? questions : questions.filter((q) => !mastery[q.id]);
  }, [questions, mastery, showMastered]);

  const currentQ = activeQuestions[currentIndex];

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activeQuestions.length);
    }, 200);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + activeQuestions.length) % activeQuestions.length);
    }, 200);
  };

  const handleExport = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = 'n400_questions.json';
    a.click();
  };

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target?.result as string);
        if (Array.isArray(imported)) {
          onImportQuestions(imported);
          alert('Questions Imported');
        }
      } catch {
        alert('Invalid JSON');
      }
    };
    reader.readAsText(file);
  };

  if (!currentQ) {
    return (
      <div className="p-10 text-center font-serif text-neutral-500 dark:text-neutral-400">
        No questions available. {showMastered ? '' : 'All questions mastered!'}
      </div>
    );
  }

  return (
    <div className="relative min-h-[600px] flex flex-col">
      {/* Physics Background */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl opacity-50 dark:opacity-30 z-0">
        <ParticleBackground />
      </div>

      <div className="relative z-10 max-w-lg mx-auto w-full space-y-6 pt-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm p-3 rounded-full shadow-sm border border-neutral-100 dark:border-neutral-700">
          <h2 className="text-lg font-serif pl-4 text-neutral-700 dark:text-neutral-200">Flashcards</h2>
          <div className="flex items-center gap-3 pr-2">
            <label className="text-xs text-neutral-600 dark:text-neutral-300 font-bold flex items-center gap-2 cursor-pointer bg-neutral-100 dark:bg-neutral-700 px-3 py-1.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-600 transition">
              <input
                type="checkbox"
                checked={!showMastered}
                onChange={() => {
                  setShowMastered(!showMastered);
                  setCurrentIndex(0);
                }}
                className="accent-primary-600"
              />
              Study Needs
            </label>
            <div className="flex gap-1">
              <button
                onClick={handleExport}
                title="Export Questions"
                className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <Icon name="download" size={16} />
              </button>
              <label className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer">
                <Icon name="upload" size={16} />
                <input
                  type="file"
                  className="hidden"
                  accept=".json"
                  onChange={handleImport}
                />
              </label>
            </div>
          </div>
        </div>

        {/* 3D Card */}
        <div
          className="h-80 w-full cursor-pointer"
          style={{ perspective: '1000px' }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div
            className="relative w-full h-full transition-transform duration-500"
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* FRONT */}
            <div
              className="absolute w-full h-full bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border-2 border-white dark:border-neutral-700 flex flex-col items-center justify-center p-8 text-center"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="absolute top-6 left-6 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
                {currentQ.section}
              </div>
              <div className="absolute top-6 right-6 text-2xl font-serif text-neutral-200 dark:text-neutral-600 font-bold">
                Q{currentQ.id}
              </div>
              <h3 className="text-2xl font-serif text-neutral-800 dark:text-neutral-100 leading-snug">
                {currentQ.q}
              </h3>
              <div className="absolute bottom-6 text-xs font-bold text-primary-400 dark:text-primary-400 uppercase tracking-widest animate-pulse">
                Tap to Reveal
              </div>
            </div>

            {/* BACK */}
            <div
              className="absolute w-full h-full bg-neutral-800 dark:bg-neutral-700 rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 text-center border-2 border-neutral-700 dark:border-neutral-600"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <div className="absolute top-6 left-6 text-xs font-bold text-neutral-500 uppercase tracking-widest">
                Answer
              </div>
              <p className="text-xl font-medium text-neutral-50 font-serif leading-relaxed">
                {currentQ.a}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-4">
          <button
            onClick={prevCard}
            className="p-4 bg-white dark:bg-neutral-800 rounded-full shadow-sm hover:shadow-md dark:shadow-neutral-900/50 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition border border-neutral-100 dark:border-neutral-700"
            aria-label="Previous question"
          >
            <Icon name="arrow-left" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMastery(currentQ.id);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm shadow-sm transition transform active:scale-95 ${
              mastery[currentQ.id]
                ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 ring-2 ring-green-200 dark:ring-green-700'
                : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-100 dark:border-neutral-700'
            }`}
          >
            {mastery[currentQ.id] ? (
              <>
                <Icon name="check" size={16} /> Mastered
              </>
            ) : (
              <>
                <Icon name="circle" size={16} /> Mark as Mastered
              </>
            )}
          </button>

          <button
            onClick={nextCard}
            className="p-4 bg-white dark:bg-neutral-800 rounded-full shadow-sm hover:shadow-md dark:shadow-neutral-900/50 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition border border-neutral-100 dark:border-neutral-700"
            aria-label="Next question"
          >
            <Icon name="arrow-right" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="text-center text-xs text-neutral-500 dark:text-neutral-400">
          {currentIndex + 1} of {activeQuestions.length}
        </div>

        {/* Card-Specific Note */}
        <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm p-4 rounded-xl border border-neutral-100 dark:border-neutral-700 shadow-sm">
          <IntegratedNote
            id={`q_${currentQ.id}`}
            notes={notes}
            onSave={onNoteChange}
            label={`Notes on Q${currentQ.id}`}
          />
        </div>
      </div>
    </div>
  );
}

export default StudyMode;
