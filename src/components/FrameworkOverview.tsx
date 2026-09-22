import React from 'react';
import {
  Activity,
  CheckCircle,
  TrendingUp,
  Clock,
  ShieldCheck,
  Share2,
  Info,
  Calendar,
  BarChart2,
  Flag,
  Bell,
  Check,
  Sliders,
  Layers,
} from 'lucide-react';

export const FrameworkOverview: React.FC = () => {
  return (
    <div id="framework-overview-view" className="space-y-6">
      {/* Top Header matching Screenshot 1 */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Network & Telemetry Reliability Overview
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time performance summary • Multi-species sensor mesh across 486 animals
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>May 20 – May 26, 2025</span>
          </div>
        </div>
      </div>

      {/* Top Row: Circular Radial Progress & Early Detection Timeline (Matching Screenshot 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Semi-circular Gauge Card (5 / 12 width) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col items-center justify-center text-center">
          {/* Circular SVG Gauge */}
          <div className="relative w-56 h-36 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 200 120" className="w-full h-full">
              {/* Background Arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="16"
                strokeLinecap="round"
              />
              {/* Active Progress Arc (94.6% of half circle = ~170 degrees) */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#10b981"
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray="251.2"
                strokeDashoffset="13.5"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute bottom-2 flex flex-col items-center">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight font-mono">
                94.6%
              </span>
            </div>
          </div>

          <h3 className="text-base font-bold text-slate-900 mt-2">
            Packet Delivery Success Rate
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Percentage of biosensor and microclimate packets successfully delivered to telemetry gateway
          </p>

          <div className="mt-4 inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Performing Well</span>
          </div>
        </div>

        {/* Right: Early Detection Timeline (7 / 12 width) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Early Detection Timeline</h3>

            {/* 4-Step Interactive Timeline Process */}
            <div className="mt-6 relative">
              {/* Connecting line */}
              <div className="absolute top-5 left-8 right-8 h-0.5 bg-slate-200 -z-0" />

              <div className="grid grid-cols-4 gap-2 relative z-10 text-center">
                {/* Step 1: Baseline */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-50 border-2 border-blue-400 flex items-center justify-center text-blue-600 shadow-xs">
                    <BarChart2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 mt-2">Baseline</span>
                  <span className="text-[11px] text-slate-400 font-mono mt-0.5">May 20, 00:00</span>
                </div>

                {/* Step 2: Anomaly Flagged */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-teal-50 border-2 border-teal-500 flex items-center justify-center text-teal-600 shadow-xs">
                    <Flag className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 mt-2">Anomaly Flagged</span>
                  <span className="text-[11px] text-slate-400 font-mono mt-0.5">May 21, 08:42</span>
                </div>

                {/* Step 3: Alert Sent */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-amber-50 border-2 border-amber-400 flex items-center justify-center text-amber-600 shadow-xs">
                    <Bell className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 mt-2">Alert Sent</span>
                  <span className="text-[11px] text-slate-400 font-mono mt-0.5">May 21, 08:45</span>
                </div>

                {/* Step 4: Confirmed */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-xs">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 mt-2">Confirmed</span>
                  <span className="text-[11px] text-slate-400 font-mono mt-0.5">May 21, 09:10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info callout at bottom of right card */}
          <div className="mt-6 p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center space-x-3 text-xs text-blue-950">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span>
              Early detection helps reduce clinical impact, improves keeper lead-time (+3.7 days avg), and prevents acute illness escalation.
            </span>
          </div>
        </div>
      </div>

      {/* Middle Row: 3 Trend Charts matching Screenshot 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Chart 1: Packet Delivery Success Rate */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
            <span className="font-bold text-slate-900">Packet Delivery Success Rate (%)</span>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="mt-4 h-40 flex flex-col justify-between">
            <div className="relative h-28 w-full flex items-end">
              <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                {/* Horizontal reference lines */}
                <line x1="0" y1="20" x2="300" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="50" x2="300" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="80" x2="300" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                {/* Line Path */}
                <polyline
                  points="20,45 65,48 110,40 155,62 200,43 245,46 280,44"
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Points */}
                {[
                  [20, 45],
                  [65, 48],
                  [110, 40],
                  [155, 62],
                  [200, 43],
                  [245, 46],
                  [280, 44],
                ].map(([x, y], idx) => (
                  <circle key={idx} cx={x} cy={y} r="3.5" fill="#0d9488" stroke="#ffffff" strokeWidth="1.5" />
                ))}
              </svg>
            </div>
            {/* Days axis */}
            <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-1">
              <span>May 20</span>
              <span>May 21</span>
              <span>May 22</span>
              <span>May 23</span>
              <span>May 24</span>
              <span>May 25</span>
              <span>May 26</span>
            </div>
          </div>
        </div>

        {/* Chart 2: End-to-End Latency */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
            <span className="font-bold text-slate-900">End-to-End Latency (ms)</span>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="mt-4 h-40 flex flex-col justify-between">
            <div className="flex items-center justify-end space-x-3 text-[10px] text-slate-500 mb-1">
              <span className="flex items-center">
                <span className="w-3 h-0.5 bg-blue-600 mr-1" /> Average Latency
              </span>
              <span className="flex items-center">
                <span className="w-3 h-0.5 border-b border-dashed border-slate-400 mr-1" /> Baseline (7d Avg)
              </span>
            </div>
            <div className="relative h-24 w-full flex items-end">
              <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                {/* Baseline reference */}
                <line x1="20" y1="58" x2="280" y2="58" stroke="#94a3b8" strokeDasharray="3,3" strokeWidth="1.5" />
                {/* Latency line */}
                <polyline
                  points="20,55 65,65 110,48 155,30 200,52 245,56 280,62"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {[
                  [20, 55],
                  [65, 65],
                  [110, 48],
                  [155, 30],
                  [200, 52],
                  [245, 56],
                  [280, 62],
                ].map(([x, y], idx) => (
                  <circle key={idx} cx={x} cy={y} r="3.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                ))}
              </svg>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-1">
              <span>May 20</span>
              <span>May 21</span>
              <span>May 22</span>
              <span>May 23</span>
              <span>May 24</span>
              <span>May 25</span>
              <span>May 26</span>
            </div>
          </div>
        </div>

        {/* Chart 3: Network Anomalies Detected Bar Chart */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
            <span className="font-bold text-slate-900">Health & Telemetry Anomalies Detected</span>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="mt-4 h-40 flex flex-col justify-between">
            <div className="relative h-28 w-full flex items-end justify-between px-2">
              {/* Bars for each day matching Screenshot */}
              {[
                { day: 'May 20', val: 3, h: '18%' },
                { day: 'May 21', val: 16, h: '85%' },
                { day: 'May 22', val: 9, h: '50%' },
                { day: 'May 23', val: 6, h: '35%' },
                { day: 'May 24', val: 4, h: '22%' },
                { day: 'May 25', val: 2, h: '12%' },
                { day: 'May 26', val: 1, h: '8%' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center w-6 group cursor-pointer">
                  <span className="text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.val}
                  </span>
                  <div
                    className="w-4 bg-blue-500 rounded-t-sm group-hover:bg-blue-600 transition-colors"
                    style={{ height: item.h }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-1">
              <span>May 20</span>
              <span>May 21</span>
              <span>May 22</span>
              <span>May 23</span>
              <span>May 24</span>
              <span>May 25</span>
              <span>May 26</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Summary Cards matching Screenshot 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-mono text-slate-900">94.6%</span>
            <p className="text-xs text-slate-500">Packet Delivery Success Rate</p>
            <span className="text-[11px] text-emerald-600 font-semibold">▲ 1.8% vs last 7 days</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-mono text-slate-900">61 ms</span>
            <p className="text-xs text-slate-500">Average End-to-End Latency</p>
            <span className="text-[11px] text-emerald-600 font-semibold">▼ 6 ms vs last 7 days</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-mono text-slate-900">98.7%</span>
            <p className="text-xs text-slate-500">Anomaly Detection Accuracy</p>
            <span className="text-[11px] text-emerald-600 font-semibold">▲ 2.3% vs last 7 days</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-mono text-slate-900">1.2M</span>
            <p className="text-xs text-slate-500">Packets Monitored</p>
            <span className="text-[11px] text-purple-600 font-semibold">▲ 12.4% vs last 7 days</span>
          </div>
        </div>
      </div>

      {/* Cohort Benchmark Table (from Table 1 & Table 2 of Research Paper) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-2">
          Clinical Event Category Detection Performance (Table 2 Benchmark)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Empirical validation across 173 documented veterinary events in the 12-month multi-institution trial
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="py-2.5">Category</th>
                <th className="py-2.5 text-right">Documented Events</th>
                <th className="py-2.5 text-right">Early Sensitivity (%)</th>
                <th className="py-2.5 text-right">Precision (%)</th>
                <th className="py-2.5 text-right">Mean Lead Time</th>
                <th className="py-2.5 pl-4">Primary Biomarkers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-2.5 font-semibold text-slate-900">Cardiovascular</td>
                <td className="py-2.5 text-right font-mono">38</td>
                <td className="py-2.5 text-right font-mono font-bold text-emerald-600">92.1%</td>
                <td className="py-2.5 text-right font-mono">78.4%</td>
                <td className="py-2.5 text-right font-mono text-blue-600 font-semibold">5.2 days</td>
                <td className="py-2.5 pl-4 text-slate-500">Continuous radar HR, waveform HRV, BP variance</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-slate-900">Metabolic / Endocrine</td>
                <td className="py-2.5 text-right font-mono">26</td>
                <td className="py-2.5 text-right font-mono font-bold text-emerald-600">88.4%</td>
                <td className="py-2.5 text-right font-mono">73.6%</td>
                <td className="py-2.5 text-right font-mono text-blue-600 font-semibold">4.8 days</td>
                <td className="py-2.5 pl-4 text-slate-500">Core thermoregulation, diurnal weight loss, feeding index</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-slate-900">Infectious / Pyrexia</td>
                <td className="py-2.5 text-right font-mono">34</td>
                <td className="py-2.5 text-right font-mono font-bold text-emerald-600">82.6%</td>
                <td className="py-2.5 text-right font-mono">68.9%</td>
                <td className="py-2.5 text-right font-mono text-blue-600 font-semibold">3.1 days</td>
                <td className="py-2.5 pl-4 text-slate-500">Subcutaneous temp spikes, tachypnea, lethargy scores</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-slate-900">Gastrointestinal</td>
                <td className="py-2.5 text-right font-mono">22</td>
                <td className="py-2.5 text-right font-mono font-bold text-emerald-600">86.4%</td>
                <td className="py-2.5 text-right font-mono">71.2%</td>
                <td className="py-2.5 text-right font-mono text-blue-600 font-semibold">3.6 days</td>
                <td className="py-2.5 pl-4 text-slate-500">Locomotion pauses, abdominal micro-movements</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-slate-900">Behavioral Welfare</td>
                <td className="py-2.5 text-right font-mono">20</td>
                <td className="py-2.5 text-right font-mono font-bold text-emerald-600">90.0%</td>
                <td className="py-2.5 text-right font-mono">74.3%</td>
                <td className="py-2.5 text-right font-mono text-blue-600 font-semibold">5.7 days</td>
                <td className="py-2.5 pl-4 text-slate-500">Vision pose tracking, stereotypic pacing, social proximity</td>
              </tr>
              <tr className="bg-slate-50 font-bold">
                <td className="py-2.5 text-slate-900">Cohort Overall</td>
                <td className="py-2.5 text-right font-mono">173</td>
                <td className="py-2.5 text-right font-mono text-emerald-700">84.3%</td>
                <td className="py-2.5 text-right font-mono">71.4%</td>
                <td className="py-2.5 text-right font-mono text-blue-700">3.7 days</td>
                <td className="py-2.5 pl-4 text-slate-600">False alarm rate: 2.1 per animal-year</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
