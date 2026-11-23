"use client";

interface StatsGaugeProps {
  value: number; // 0 - 100
  label: string;
  sublabel?: string;
  color?: "amber" | "arc" | "green";
  unit?: string;
}

export default function StatsGauge({
  value,
  label,
  sublabel,
  color = "amber",
  unit = "%",
}: StatsGaugeProps) {
  const strokeColor =
    color === "green" ? "#4ADE80" : color === "arc" ? "#38BDF8" : "#F59E0B";

  // Arc calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference * 0.75;

  return (
    <div className="workshop-card-riveted p-4 flex items-center gap-4">
      <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-135" viewBox="0 0 100 100">
          {/* Background Track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#27272A"
            strokeWidth="8"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeLinecap="round"
          />
          {/* Animated Value Arc */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-mono font-bold text-lg text-chalk leading-none">
            {value}
            <span className="text-xs font-normal text-chalk-muted">{unit}</span>
          </span>
        </div>
      </div>

      <div className="min-w-0">
        <div className="text-xs font-heading font-medium text-chalk truncate">{label}</div>
        {sublabel && (
          <div className="text-[10px] font-mono text-chalk-faded mt-0.5 truncate leading-tight">
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
}
