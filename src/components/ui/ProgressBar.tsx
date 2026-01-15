interface ProgressBarProps {
  value: number;
  max: number;
  colorClass?: string;
}

export function ProgressBar({ value, max, colorClass = 'bg-blue-300' }: ProgressBarProps) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div className="relative h-5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
      <div
        className={`absolute top-0 left-0 h-full ${colorClass} transition-all duration-1000 ease-out opacity-60`}
        style={{ width: `${percentage}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <span className="text-[10px] font-bold text-slate-600 tracking-wider font-sans">
          {percentage}%
        </span>
      </div>
    </div>
  );
}

export default ProgressBar;
