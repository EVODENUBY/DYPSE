interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  progressColor?: string;
  textColor?: string;
  showText?: boolean;
}

export default function CircularProgress({
  percentage,
  size = 80,
  strokeWidth = 8,
  trackColor = '#E5E7EB',
  progressColor = '#4F46E5',
  textColor = '#111827',
  showText = true,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-sm font-medium" style={{ color: textColor }}>
            {Math.round(percentage)}%
          </span>
          <span className="text-xs text-gray-500">Complete</span>
        </div>
      )}
    </div>
  );
}
