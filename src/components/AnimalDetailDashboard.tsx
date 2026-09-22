import React, { useState } from 'react';
import {
  Heart,
  Activity,
  Thermometer,
  Wind,
  Shield,
  Calendar,
  Clock,
  ChevronDown,
  Info,
  Sliders,
  Sparkles,
  Droplet,
  Scale,
  Gauge,
  UserCheck,
  AlertOctagon,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import { AnimalProfile, VitalParameterKey } from '../types/telemetry';

interface AnimalDetailDashboardProps {
  animal: AnimalProfile;
  allAnimals: AnimalProfile[];
  onSelectAnimal: (animalId: string) => void;
  onBackToMatrix: () => void;
  onTriggerAlert: (paramKey: VitalParameterKey) => void;
}

export const AnimalDetailDashboard: React.FC<AnimalDetailDashboardProps> = ({
  animal,
  allAnimals,
  onSelectAnimal,
  onBackToMatrix,
  onTriggerAlert,
}) => {
  const [selectedParamKey, setSelectedParamKey] = useState<VitalParameterKey>('heartRate');
  const [sdMultiplier, setSdMultiplier] = useState<number>(2.0);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const currentThreshold = animal.thresholds[selectedParamKey];
  const timeSeriesData = animal.timeSeries[selectedParamKey] || [];

  // Dynamic thresholds based on multiplier
  const dynamicUpper = currentThreshold.baselineMean + sdMultiplier * currentThreshold.sd;
  const dynamicLower = Math.max(0, currentThreshold.baselineMean - sdMultiplier * currentThreshold.sd);

  // SVG dimensions for chart
  const width = 640;
  const height = 360;
  const padding = { top: 30, right: 90, bottom: 45, left: 45 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Calculate Y min & max for comfortable plotting
  const values = timeSeriesData.map((d) => d.value);
  const rawMin = Math.min(...values, dynamicLower, currentThreshold.baselineMean - 2.5 * currentThreshold.sd);
  const rawMax = Math.max(...values, dynamicUpper, currentThreshold.baselineMean + 2.5 * currentThreshold.sd);
  const ySpan = rawMax - rawMin || 1;
  const yMin = Math.floor(rawMin - ySpan * 0.15);
  const yMax = Math.ceil(rawMax + ySpan * 0.15);

  const getY = (val: number) => {
    return padding.top + plotHeight - ((val - yMin) / (yMax - yMin)) * plotHeight;
  };

  const getX = (index: number) => {
    if (timeSeriesData.length <= 1) return padding.left;
    return padding.left + (index / (timeSeriesData.length - 1)) * plotWidth;
  };

  // Y-ticks
  const yTickCount = 7;
  const yTicks = Array.from({ length: yTickCount }).map((_, i) => {
    return Math.round(yMin + (i / (yTickCount - 1)) * (yMax - yMin));
  });

  // Calculate coordinates for bands
  const yMean = getY(currentThreshold.baselineMean);
  const yUpper1SD = getY(currentThreshold.baselineMean + 1 * currentThreshold.sd);
  const yLower1SD = getY(currentThreshold.baselineMean - 1 * currentThreshold.sd);
  const yUpper2SD = getY(dynamicUpper);
  const yLower2SD = getY(dynamicLower);

  // Points path
  const pointsString = timeSeriesData.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ');

  // Parameter labels list matching the Screenshot
  const parameterList: { key: VitalParameterKey; label: string; icon: React.ReactNode }[] = [
    { key: 'heartRate', label: 'Heart Rate (bpm)', icon: <Heart className="w-3.5 h-3.5 text-red-500" /> },
    { key: 'systolicBP', label: 'Systolic BP (mmHg)', icon: <Gauge className="w-3.5 h-3.5 text-blue-500" /> },
    { key: 'diastolicBP', label: 'Diastolic BP (mmHg)', icon: <Gauge className="w-3.5 h-3.5 text-indigo-500" /> },
    { key: 'spO2', label: 'SpO₂ (%)', icon: <Droplet className="w-3.5 h-3.5 text-purple-500" /> },
    { key: 'respRate', label: 'Respiratory Rate (breaths/min)', icon: <Wind className="w-3.5 h-3.5 text-emerald-500" /> },
    { key: 'temperature', label: 'Temperature (°C)', icon: <Thermometer className="w-3.5 h-3.5 text-amber-500" /> },
    { key: 'activity', label: 'Activity Level (steps/day)', icon: <Activity className="w-3.5 h-3.5 text-rose-500" /> },
    { key: 'weight', label: 'Weight (kg)', icon: <Scale className="w-3.5 h-3.5 text-cyan-500" /> },
  ];

  return (
    <div id="patient-health-dashboard" className="space-y-6">
      {/* Top Breadcrumb & Animal Switcher Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBackToMatrix}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Return to Simultaneous Matrix"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Patient Health Dashboard</h2>
                <span
                  className={`text-xs uppercase font-bold px-2 py-0.5 rounded-full border ${
                    animal.currentStatus === 'critical'
                      ? 'bg-red-100 text-red-800 border-red-200'
                      : animal.currentStatus === 'urgent'
                      ? 'bg-orange-100 text-orange-800 border-orange-200'
                      : animal.currentStatus === 'observation'
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}
                >
                  {animal.currentStatus}
                </span>
              </div>
              {/* Metadata row matching screenshot */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                <div className="flex items-center space-x-1.5 font-medium text-slate-700">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Patient ID: <strong className="font-mono text-slate-900">{animal.id}</strong> ({animal.name} - {animal.species})
                  </span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Date Range: May 8 – May 15, 2025</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Last Updated: May 15, 2025 08:30 AM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Switch Patient Animal Dropdown */}
          <div className="flex items-center space-x-2 self-start lg:self-auto">
            <span className="text-xs text-slate-500 font-medium">Switch Animal:</span>
            <div className="relative">
              <select
                id="patient-switch-select"
                value={animal.id}
                onChange={(e) => onSelectAnimal(e.target.value)}
                className="pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                {allAnimals.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.avatarIcon} {a.name} ({a.species}) - {a.currentStatus.toUpperCase()}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Dual-Column Layout (Matching Screenshot 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Vital Thresholds Table (4.5 / 12 width) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-200/60">
                  <Shield className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Vital Thresholds</h3>
              </div>

              {/* Sensitivity calibration multiplier */}
              <div className="flex items-center space-x-1 text-xs">
                <span className="text-slate-400">Band:</span>
                <button
                  onClick={() => setSdMultiplier(1.5)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    sdMultiplier === 1.5 ? 'bg-blue-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Strict ±1.5 SD threshold"
                >
                  ±1.5 SD
                </button>
                <button
                  onClick={() => setSdMultiplier(2.0)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    sdMultiplier === 2.0 ? 'bg-blue-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Standard ±2.0 SD threshold"
                >
                  ±2 SD
                </button>
                <button
                  onClick={() => setSdMultiplier(2.5)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    sdMultiplier === 2.5 ? 'bg-blue-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Relaxed ±2.5 SD threshold"
                >
                  ±2.5 SD
                </button>
              </div>
            </div>

            {/* Threshold Table */}
            <div className="mt-4 overflow-x-auto">
              <table id="vital-thresholds-table" className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 font-semibold text-[11px]">
                    <th className="py-2.5 pr-2">Vital Sign</th>
                    <th className="py-2.5 px-2 text-right">Baseline Mean</th>
                    <th className="py-2.5 px-2 text-right">Lower (-2 SD)</th>
                    <th className="py-2.5 px-2 text-right">Upper (+2 SD)</th>
                    <th className="py-2.5 pl-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {parameterList.map(({ key, label, icon }) => {
                    const thresh = animal.thresholds[key];
                    if (!thresh) return null;
                    const isCurrentSelected = selectedParamKey === key;
                    const currentVal = animal.currentVitals[key];

                    // Determine status relative to dynamic bounds
                    let statusStyle = 'bg-emerald-100 text-emerald-800';
                    let statusText = 'Normal';

                    if (currentVal > thresh.baselineMean + sdMultiplier * thresh.sd) {
                      statusStyle = 'bg-red-100 text-red-800 font-semibold';
                      statusText = 'High';
                    } else if (currentVal < thresh.baselineMean - sdMultiplier * thresh.sd) {
                      statusStyle = 'bg-red-100 text-red-800 font-semibold';
                      statusText = 'Low';
                    } else if (
                      currentVal > thresh.baselineMean + 1.2 * thresh.sd ||
                      currentVal < thresh.baselineMean - 1.2 * thresh.sd
                    ) {
                      statusStyle = 'bg-amber-100 text-amber-800 font-medium';
                      statusText = 'Caution';
                    }

                    return (
                      <tr
                        key={key}
                        onClick={() => setSelectedParamKey(key)}
                        className={`cursor-pointer transition-colors ${
                          isCurrentSelected ? 'bg-blue-50/70 font-semibold' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-2.5 pr-2 flex items-center space-x-2">
                          <span className="shrink-0">{icon}</span>
                          <span className={`${isCurrentSelected ? 'text-blue-900 font-bold' : 'text-slate-800'}`}>
                            {label.split(' (')[0]}
                            <span className="block text-[10px] font-normal text-slate-400">
                              ({thresh.unit})
                            </span>
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono text-slate-800">
                          {thresh.baselineMean}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono text-slate-600">
                          {(thresh.baselineMean - sdMultiplier * thresh.sd).toFixed(thresh.sd < 1 ? 1 : 0)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono text-slate-600">
                          {(thresh.baselineMean + sdMultiplier * thresh.sd).toFixed(thresh.sd < 1 ? 1 : 0)}
                        </td>
                        <td className="py-2.5 pl-2 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] ${statusStyle}`}>
                            {statusText}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer note matching screenshot */}
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Thresholds are based on baseline mean ± {sdMultiplier} standard deviations (SD).
          </div>
        </div>

        {/* Right Column: Health Monitoring Over Time Chart (7 / 12 width) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            {/* Chart Header with Parameter Select Dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Health Monitoring Over Time</h3>
              <div className="relative">
                <select
                  id="chart-parameter-select"
                  value={selectedParamKey}
                  onChange={(e) => setSelectedParamKey(e.target.value as VitalParameterKey)}
                  className="pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  {parameterList.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* SVG Interactive Confidence Band Chart */}
            <div className="mt-4 relative bg-slate-50/50 rounded-xl p-2 border border-slate-100">
              <svg
                id="health-monitoring-svg-chart"
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-auto overflow-visible select-none"
              >
                {/* Y-Axis Gridlines & Ticks */}
                {yTicks.map((tickVal) => {
                  const y = getY(tickVal);
                  return (
                    <g key={tickVal}>
                      <line
                        x1={padding.left}
                        y1={y}
                        x2={width - padding.right}
                        y2={y}
                        stroke="#e2e8f0"
                        strokeDasharray="2,2"
                        strokeWidth="1"
                      />
                      <text
                        x={padding.left - 8}
                        y={y + 4}
                        textAnchor="end"
                        className="text-[11px] fill-slate-400 font-mono"
                      >
                        {tickVal}
                      </text>
                    </g>
                  );
                })}

                {/* X-Axis Gridlines & Date Labels */}
                {timeSeriesData.map((d, i) => {
                  const x = getX(i);
                  return (
                    <g key={d.dateLabel}>
                      <line
                        x1={x}
                        y1={padding.top}
                        x2={x}
                        y2={height - padding.bottom}
                        stroke="#e2e8f0"
                        strokeDasharray="2,2"
                        strokeWidth="1"
                      />
                      <text
                        x={x}
                        y={height - padding.bottom + 18}
                        textAnchor="middle"
                        className="text-[11px] fill-slate-500 font-medium"
                      >
                        {d.dateLabel}
                      </text>
                    </g>
                  );
                })}

                {/* Shaded Confidence Ribbon: ±2 SD Band (Lighter Blue) */}
                <rect
                  x={padding.left}
                  y={Math.min(yUpper2SD, yLower2SD)}
                  width={plotWidth}
                  height={Math.abs(yLower2SD - yUpper2SD)}
                  fill="#e0f2fe"
                  opacity="0.65"
                />

                {/* Shaded Confidence Ribbon: ±1 SD Band (Medium Light Blue) */}
                <rect
                  x={padding.left}
                  y={Math.min(yUpper1SD, yLower1SD)}
                  width={plotWidth}
                  height={Math.abs(yLower1SD - yUpper1SD)}
                  fill="#bae6fd"
                  opacity="0.75"
                />

                {/* Baseline Mean Horizontal Reference Line */}
                <line
                  x1={padding.left}
                  y1={yMean}
                  x2={width - padding.right}
                  y2={yMean}
                  stroke="#0284c7"
                  strokeWidth="1.8"
                />

                {/* Upper Threshold Line (+2 SD) */}
                <line
                  x1={padding.left}
                  y1={yUpper2SD}
                  x2={width - padding.right}
                  y2={yUpper2SD}
                  stroke="#2563eb"
                  strokeDasharray="4,3"
                  strokeWidth="1.5"
                />
                <text
                  x={width - padding.right + 6}
                  y={yUpper2SD + 3}
                  className="text-[10px] fill-blue-700 font-semibold"
                >
                  Upper (+{sdMultiplier} SD)
                </text>

                {/* Lower Threshold Line (-2 SD) */}
                <line
                  x1={padding.left}
                  y1={yLower2SD}
                  x2={width - padding.right}
                  y2={yLower2SD}
                  stroke="#2563eb"
                  strokeDasharray="4,3"
                  strokeWidth="1.5"
                />
                <text
                  x={width - padding.right + 6}
                  y={yLower2SD + 3}
                  className="text-[10px] fill-blue-700 font-semibold"
                >
                  Lower (-{sdMultiplier} SD)
                </text>

                {/* Data Points Connecting Polyline */}
                <polyline
                  points={pointsString}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points and Flagged Anomalies */}
                {timeSeriesData.map((point, index) => {
                  const cx = getX(index);
                  const cy = getY(point.value);
                  const isOut = point.value > dynamicUpper || point.value < dynamicLower;
                  const isHovered = hoveredPointIndex === index;

                  if (isOut) {
                    // Flagged Anomaly: Red diamond marker with value text callout!
                    return (
                      <g
                        key={index}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredPointIndex(index)}
                        onMouseLeave={() => setHoveredPointIndex(null)}
                      >
                        {/* Red Diamond */}
                        <polygon
                          points={`${cx},${cy - 8} ${cx + 7},${cy} ${cx},${cy + 8} ${cx - 7},${cy}`}
                          fill="#fee2e2"
                          stroke="#ef4444"
                          strokeWidth="2.5"
                        />
                        {/* Value text pill above or below */}
                        <rect
                          x={cx - 16}
                          y={point.value > dynamicUpper ? cy - 24 : cy + 10}
                          width="32"
                          height="16"
                          rx="4"
                          fill="#ef4444"
                        />
                        <text
                          x={cx}
                          y={point.value > dynamicUpper ? cy - 12 : cy + 22}
                          textAnchor="middle"
                          className="text-[10px] fill-white font-bold font-mono"
                        >
                          {point.value}
                        </text>
                      </g>
                    );
                  }

                  // Normal data point
                  return (
                    <g
                      key={index}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPointIndex(index)}
                      onMouseLeave={() => setHoveredPointIndex(null)}
                    >
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? 5.5 : 4}
                        fill="#0284c7"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                    </g>
                  );
                })}

                {/* Y-Axis Label */}
                <text
                  x={-height / 2}
                  y={13}
                  transform="rotate(-90)"
                  textAnchor="middle"
                  className="text-[11px] fill-slate-500 font-semibold"
                >
                  {currentThreshold.label} ({currentThreshold.unit})
                </text>

                {/* X-Axis Label */}
                <text
                  x={width / 2}
                  y={height - 5}
                  textAnchor="middle"
                  className="text-[11px] fill-slate-500 font-semibold"
                >
                  Date
                </text>
              </svg>

              {/* Hover Tooltip Overlay */}
              {hoveredPointIndex !== null && timeSeriesData[hoveredPointIndex] && (
                <div
                  className="absolute z-20 pointer-events-none bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-slate-700"
                  style={{
                    left: `${(getX(hoveredPointIndex) / width) * 100}%`,
                    top: `${Math.max(10, (getY(timeSeriesData[hoveredPointIndex].value) / height) * 100 - 15)}%`,
                    transform: 'translate(-50%, -100%)',
                  }}
                >
                  <div className="font-bold text-slate-200">
                    {timeSeriesData[hoveredPointIndex].dateLabel}
                  </div>
                  <div className="font-mono text-sm text-emerald-400">
                    {timeSeriesData[hoveredPointIndex].value} {currentThreshold.unit}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Baseline: {currentThreshold.baselineMean} (
                    {timeSeriesData[hoveredPointIndex].deviationSD > 0 ? '+' : ''}
                    {timeSeriesData[hoveredPointIndex].deviationSD} SD)
                  </div>
                  {timeSeriesData[hoveredPointIndex].isAnomaly && (
                    <div className="text-[11px] text-red-300 font-semibold mt-1 flex items-center">
                      <AlertOctagon className="w-3 h-3 mr-1 text-red-400" />
                      Outside ±{sdMultiplier} SD Band
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Legend matching Screenshot 2 */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-y-2 text-xs text-slate-600">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <div className="flex items-center space-x-1.5">
                  <div className="w-4 h-0.5 bg-sky-600 rounded-full" />
                  <span>Baseline (Mean)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-3.5 h-3.5 bg-sky-200 rounded-xs border border-sky-300" />
                  <span>±1 SD</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-3.5 h-3.5 bg-sky-100 rounded-xs border border-sky-200" />
                  <span>±2 SD</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 bg-sky-600 rounded-full" />
                  <span>Data Point</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-red-500 font-bold">◇</span>
                  <span className="font-medium text-red-600">Flagged Anomaly</span>
                </div>
              </div>

              {/* Trigger test spike button for this parameter */}
              <button
                id="btn-trigger-chart-spike"
                onClick={() => onTriggerAlert(selectedParamKey)}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
                title="Inject sudden spike for this parameter"
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Inject Anomaly Spike</span>
              </button>
            </div>
          </div>

          <div className="mt-3 pt-2 text-[11px] text-slate-400">
            ◇ Anomalies are data points outside the ±{sdMultiplier} SD threshold bands.
          </div>
        </div>
      </div>

      {/* Anomaly Detection Formulation (from Section IV & Methodology of the Paper) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-3 border-b border-slate-100 gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Layer 3: Machine Learning Anomaly Detection Model
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Multivariate autoencoder reconstruction, isolation forest density, and rule-based clinical safeguards
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-semibold flex items-center">
              <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Lead Time: {animal.estimatedLeadTimeDays} Days Ahead of Symptoms
            </span>
            <span className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-lg font-semibold uppercase">
              Category: {animal.suspectedCategory}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 text-xs">
          {/* Composite Anomaly Score */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-500 font-medium">Composite Anomaly Score (S)</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-slate-900">
                {animal.compositeScore.toFixed(2)}
              </span>
              <span className="text-[11px] text-slate-400">Threshold: 0.65</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Formula: <code>S = w₁·r + w₂·φ + w₃·ρ</code>
            </p>
          </div>

          {/* Autoencoder Error */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-500 font-medium">Autoencoder Reconstruction (r)</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-blue-700">
                {animal.autoencoderError.toFixed(2)}
              </span>
              <span className="text-[11px] text-slate-400">Weight: 0.45</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Deep autoencoder trained on 12-month baseline signals
            </p>
          </div>

          {/* Isolation Forest */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-500 font-medium">Isolation Forest Score (φ)</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-purple-700">
                {animal.isolationForestScore.toFixed(2)}
              </span>
              <span className="text-[11px] text-slate-400">Weight: 0.35</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Rare behavioral anomaly event tree density
            </p>
          </div>

          {/* Rule-Based Safeguards */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-500 font-medium">Rule Safeguard Score (ρ)</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-rose-700">
                {animal.ruleSeverity.toFixed(2)}
              </span>
              <span className="text-[11px] text-slate-400">Weight: 0.20</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Deterministic pyrexia, hypoxia, and bradycardia bounds
            </p>
          </div>
        </div>

        {/* Clinical Guidance */}
        <div className="mt-4 p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 flex items-start space-x-2.5">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <strong className="font-semibold text-blue-950">Clinical Telemetry Protocol:</strong>{' '}
            For {animal.species} ({animal.name}), when parameters remain outside the ±{sdMultiplier} SD threshold for longer than the 4-hour temporal window (W), prompt keeper rounds verification is triggered before clinical symptoms manifest.
          </div>
        </div>
      </div>
    </div>
  );
};
