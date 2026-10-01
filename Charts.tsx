/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

// Pie / Donut Chart for Status Distribution (Excellent, Average, At Risk, Fail)
interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
}

export function DonutChart({ data }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercent = 0;

  function getCoordinatesForPercent(percent: number) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full transform -rotate-90" viewBox="-1.2 -1.2 2.4 2.4">
          <circle cx="0" cy="0" r="0.8" fill="transparent" stroke="#f1f5f9" strokeWidth="0.3" />
          {total === 0 ? (
            <circle cx="0" cy="0" r="0.8" fill="transparent" stroke="#e2e8f0" strokeWidth="0.3" />
          ) : (
            data.map((slice, idx) => {
              if (slice.value === 0) return null;
              const percent = slice.value / total;
              const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
              cumulativePercent += percent;
              const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
              
              const largeArcFlag = percent > 0.5 ? 1 : 0;
              const pathData = [
                `M ${startX * 0.8} ${startY * 0.8}`,
                `A 0.8 0.8 0 <sup>${largeArcFlag}</sup> 1 ${endX * 0.8} ${endY * 0.8}`,
                'L 0 0',
              ].join(' ');
              
              // Simplification: use stroke-dasharray approach for circles or simple arcs
              // Draw as SVG circle segments for reliability
              const circumference = 2 * Math.PI * 0.8;
              const strokeDasharray = `${percent * circumference} ${circumference}`;
              const strokeDashoffset = `${((1 - (cumulativePercent - percent)) % 1) * circumference}`;

              return (
                <circle
                  key={idx}
                  cx="0"
                  cy="0"
                  r="0.8"
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth="0.32"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 ease-out hover:stroke-[0.38]"
                  style={{ transformOrigin: 'center' }}
                />
              );
            })
          )}
          {/* Inner hole */}
          <circle cx="0" cy="0" r="0.55" fill="#ffffff" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-800">{total}</span>
          <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Students</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 text-xs">
        {data.map((item, index) => (
          <div key={index} id={`donut-legend-${index}`} className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-slate-600 font-medium">{item.label}:</span>
            <span className="text-slate-900 font-semibold">
              {item.value} ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Simple Bar Chart for Comparison Metrics
interface BarChartProps {
  categories: string[];
  values: number[];
  color?: string;
  maxVal?: number;
}

export function BarChart({ categories, values, color = '#1e3a8a', maxVal = 100 }: BarChartProps) {
  const max = Math.max(...values, maxVal);

  return (
    <div className="w-full space-y-4 py-2">
      {categories.map((cat, idx) => {
        const val = values[idx] || 0;
        const widthPct = max > 0 ? (val / max) * 100 : 0;
        return (
          <div key={idx} id={`bar-row-${idx}`} className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span className="truncate max-w-[70%]">{cat}</span>
              <span>{Math.round(val * 10) / 10}%</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Half Radial Gauge for Gauging Attendance or Scores
interface AcademicGaugeProps {
  value: number; // 0 to 100
  title: string;
}

export function AcademicGauge({ value, title }: AcademicGaugeProps) {
  // Bound limit
  const val = Math.max(0, Math.min(100, value));
  const normalizedVal = val / 100;
  
  // Custom Status styling
  let color = '#3b82f6'; // blue
  let text = 'Good';
  if (val >= 85) {
    color = '#10b981'; // green
    text = 'Excellent';
  } else if (val < 75 && val >= 60) {
    color = '#f59e0b'; // amber
    text = 'Borderline';
  } else if (val < 60) {
    color = '#ef4444'; // red
    text = 'At Risk';
  }

  // Stroke Dash constants for semicircle r=100
  // Semicircle perimeter = pi * r = 314.15
  const strokeDashoffset = 314.15 - (normalizedVal * 314.15);

  return (
    <div className="flex flex-col items-center justify-center p-3 text-center">
      <div className="relative w-40 h-24 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 220 120">
          <path
            d="M 10 110 A 100 100 0 0 1 210 110"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <path
            d="M 10 110 A 100 100 0 0 1 210 110"
            fill="none"
            stroke={color}
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray="314.15"
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 text-center flex flex-col justify-end">
          <span className="text-3xl font-extrabold text-slate-900 leading-none">{Math.round(val)}%</span>
        </div>
      </div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-2">{title}</p>
      <span
        className="mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors"
        style={{
          backgroundColor: `${color}15`,
          color: color
        }}
      >
        {text}
      </span>
    </div>
  );
}
