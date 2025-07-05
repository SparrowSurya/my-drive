import React from "react";

export type CircularProgressProps = {
  progress: number,
  size: number,
  strokeWidth: number,
  color: string,
  trackColor: string,
} & React.HTMLAttributes<HTMLDivElement>;

export default function CircularProgress({
  progress,
  size,
  strokeWidth,
  color,
  trackColor,
  className,
  ...props
}: Readonly<CircularProgressProps>) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const center = size/2;

  return (
    <div className={className ?? "flex justify-center items-center"}  {...props}>
      <svg width={size} height={size}>
        <circle
          stroke={trackColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={center}
          cy={center}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={center}
          cy={center}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
    </div>
  );
}