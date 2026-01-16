interface ProgressBarProps {
  value: number;
  max: number;
  colorClass?: string;
}

export function ProgressBar({ value, max, colorClass = 'bg-blue-400 dark:bg-blue-500' }: ProgressBarProps) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div className="relative h-5 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden shadow-inner">
      <div
        className={`absolute top-0 left-0 h-full ${colorClass} transition-all duration-1000 ease-out opacity-70`}
        style={{ width: `${percentage}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <span className="text-[10px] font-bold text-neutral-700 dark:text-neutral-200 tracking-wider font-sans">
          {percentage}%
        </span>
      </div>
    </div>
  );
}

export default ProgressBar;
