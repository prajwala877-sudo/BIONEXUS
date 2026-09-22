import React, { useState } from 'react';
import {
  Activity,
  Heart,
  Thermometer,
  Wind,
  Zap,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Radio,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Check,
} from 'lucide-react';
import { AnimalProfile, AlertSeverity, TaxonomicGroup, VitalParameterKey } from '../types/telemetry';

interface MultiAnimalMatrixProps {
  animals: AnimalProfile[];
  onSelectAnimal: (animalId: string) => void;
  onInjectAnimalSpike: (animalId: string, paramKey: VitalParameterKey) => void;
}

export const MultiAnimalMatrix: React.FC<MultiAnimalMatrixProps> = ({
  animals,
  onSelectAnimal,
  onInjectAnimalSpike,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<'all' | TaxonomicGroup>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | AlertSeverity>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'severity' | 'score' | 'name'>('severity');

  // Filter animals
  const filtered = animals.filter((animal) => {
    if (selectedGroup !== 'all' && animal.group !== selectedGroup) return false;
    if (selectedSeverity !== 'all' && animal.currentStatus !== selectedSeverity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        animal.name.toLowerCase().includes(q) ||
        animal.species.toLowerCase().includes(q) ||
        animal.id.toLowerCase().includes(q) ||
        animal.enclosure.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Sort animals
  const severityWeight: Record<AlertSeverity, number> = {
    critical: 4,
    urgent: 3,
    observation: 2,
    normal: 1,
  };

  const sortedAnimals = [...filtered].sort((a, b) => {
    if (sortBy === 'severity') {
      const diff = severityWeight[b.currentStatus] - severityWeight[a.currentStatus];
      if (diff !== 0) return diff;
      return b.compositeScore - a.compositeScore;
    }
    if (sortBy === 'score') {
      return b.compositeScore - a.compositeScore;
    }
    return a.name.localeCompare(b.name);
  });

  const normalCount = animals.filter((a) => a.currentStatus === 'normal').length;
  const observationCount = animals.filter((a) => a.currentStatus === 'observation').length;
  const urgentCount = animals.filter((a) => a.currentStatus === 'urgent').length;
  const criticalCount = animals.filter((a) => a.currentStatus === 'critical').length;

  return (
    <div id="simultaneous-matrix-view" className="space-y-6">
      {/* Top Banner & Multi-Species Overview Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Simultaneous Wildlife Telemetry Matrix
              </h2>
            </div>
            <p className="text-sm text-slate-500 mt-1 max-w-3xl">
              Continuously streaming bio-signals across wearable transponders, non-contact radar, and
              microclimate sensors. Automated autoencoders flag deviations exceeding baseline mean ± 2 SD.
            </p>
          </div>

          {/* Quick Stats Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
            <div className="px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-100 flex flex-col">
              <span className="text-xs text-emerald-700 font-medium">Normal</span>
              <span className="text-lg font-bold text-emerald-900">{normalCount}</span>
            </div>
            <div className="px-3 py-2 bg-amber-50 rounded-xl border border-amber-100 flex flex-col">
              <span className="text-xs text-amber-700 font-medium">Observation</span>
              <span className="text-lg font-bold text-amber-900">{observationCount}</span>
            </div>
            <div className="px-3 py-2 bg-orange-50 rounded-xl border border-orange-100 flex flex-col">
              <span className="text-xs text-orange-700 font-medium">Urgent</span>
              <span className="text-lg font-bold text-orange-900">{urgentCount}</span>
            </div>
            <div className="px-3 py-2 bg-red-50 rounded-xl border border-red-100 flex flex-col">
              <span className="text-xs text-red-700 font-medium">Critical</span>
              <span className="text-lg font-bold text-red-900">{criticalCount}</span>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="search-animal-input"
                type="text"
                placeholder="Search animal, ID, enclosure..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Taxonomic Filter */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setSelectedGroup('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedGroup === 'all'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Taxa
              </button>
              <button
                onClick={() => setSelectedGroup('mammal')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedGroup === 'mammal'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mammals
              </button>
              <button
                onClick={() => setSelectedGroup('bird')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedGroup === 'bird'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Birds
              </button>
              <button
                onClick={() => setSelectedGroup('reptile')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedGroup === 'reptile'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Reptiles
              </button>
            </div>

            {/* Severity Filter */}
            <select
              id="filter-severity-select"
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value as 'all' | AlertSeverity)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Alert Severities</option>
              <option value="critical">Critical Only</option>
              <option value="urgent">Urgent Only</option>
              <option value="observation">Observation Only</option>
              <option value="normal">Normal Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center space-x-2 self-end md:self-auto">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Sort:</span>
            <select
              id="sort-animals-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'severity' | 'score' | 'name')}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            >
              <option value="severity">Severity Rank</option>
              <option value="score">Composite Anomaly Score</option>
              <option value="name">Animal Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Simultaneous Animals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sortedAnimals.map((animal) => {
          const isCritical = animal.currentStatus === 'critical';
          const isUrgent = animal.currentStatus === 'urgent';
          const isObservation = animal.currentStatus === 'observation';

          const cardBorderColor = isCritical
            ? 'border-red-300 ring-1 ring-red-300 shadow-md shadow-red-50 bg-white'
            : isUrgent
            ? 'border-orange-300 ring-1 ring-orange-200 bg-white'
            : isObservation
            ? 'border-amber-300 bg-white'
            : 'border-slate-200/80 hover:border-emerald-300 bg-white';

          // Status Badge styling
          const badgeStyles = isCritical
            ? 'bg-red-100 text-red-800 border-red-200'
            : isUrgent
            ? 'bg-orange-100 text-orange-800 border-orange-200'
            : isObservation
            ? 'bg-amber-100 text-amber-800 border-amber-200'
            : 'bg-emerald-100 text-emerald-800 border-emerald-200';

          // Check if heart rate is out of bounds
          const hrThreshold = animal.thresholds.heartRate;
          const hrValue = animal.currentVitals.heartRate;
          const hrIsOut = hrValue > hrThreshold.upperThreshold || hrValue < hrThreshold.lowerThreshold;

          // Check temperature
          const tempThreshold = animal.thresholds.temperature;
          const tempValue = animal.currentVitals.temperature;
          const tempIsOut = tempValue > tempThreshold.upperThreshold || tempValue < tempThreshold.lowerThreshold;

          // Check resp rate
          const respThreshold = animal.thresholds.respRate;
          const respValue = animal.currentVitals.respRate;
          const respIsOut = respValue > respThreshold.upperThreshold || respValue < respThreshold.lowerThreshold;

          return (
            <div
              key={animal.id}
              id={`animal-card-${animal.id}`}
              className={`rounded-2xl border p-5 transition-all relative flex flex-col justify-between ${cardBorderColor}`}
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl p-2 bg-slate-100 rounded-xl select-none" role="img" aria-label={animal.species}>
                      {animal.avatarIcon}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-slate-900 text-base">{animal.name}</h3>
                        <span className="text-xs text-slate-400 font-mono">#{animal.id}</span>
                      </div>
                      <p className="text-xs text-slate-500 italic">{animal.species}</p>
                      <p className="text-[11px] text-slate-400">{animal.enclosure}</p>
                    </div>
                  </div>

                  {/* Status badge */}
                  <span
                    className={`uppercase font-bold tracking-wider px-2 py-0.5 rounded-full text-[10px] border ${badgeStyles}`}
                  >
                    {animal.currentStatus}
                  </span>
                </div>

                {/* Animated ECG / Radar Wave Simulation */}
                <div className="mt-3.5 px-3 py-2 bg-slate-900 rounded-xl flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Radio
                      className={`w-3.5 h-3.5 ${
                        isCritical ? 'text-red-400 animate-ping' : 'text-emerald-400 animate-pulse'
                      }`}
                    />
                    <span className="font-mono text-[11px] text-slate-300">
                      Radar / Bio-Telemetry
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-24 h-5 overflow-visible" viewBox="0 0 100 20">
                      <path
                        d="M 0 10 L 20 10 L 25 10 L 30 2 L 35 18 L 40 5 L 45 15 L 50 10 L 100 10"
                        fill="none"
                        stroke={isCritical ? '#f87171' : isUrgent ? '#fb923c' : '#34d399'}
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-pulse"
                      />
                    </svg>
                    <span
                      className={`font-mono font-bold text-xs ${
                        hrIsOut ? 'text-red-400' : 'text-emerald-400'
                      }`}
                    >
                      {animal.currentVitals.heartRate} bpm
                    </span>
                  </div>
                </div>

                {/* Real-Time Parameter Grid */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  {/* Heart Rate */}
                  <div
                    className={`p-2 rounded-xl border flex flex-col justify-between ${
                      hrIsOut
                        ? 'bg-red-50 border-red-200 text-red-900'
                        : 'bg-slate-50 border-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[11px] flex items-center space-x-1">
                        <Heart className="w-3 h-3 text-red-500 inline mr-1" />
                        Heart Rate
                      </span>
                      {hrIsOut ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-red-200 text-red-800 rounded">
                          {hrValue > hrThreshold.upperThreshold ? '> +2 SD' : '< -2 SD'}
                        </span>
                      ) : (
                        <Check className="w-3 h-3 text-emerald-500" />
                      )}
                    </div>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span className="text-base font-bold font-mono">
                        {animal.currentVitals.heartRate}{' '}
                        <span className="text-[10px] font-normal text-slate-500">bpm</span>
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {hrThreshold.lowerThreshold}-{hrThreshold.upperThreshold}
                      </span>
                    </div>
                  </div>

                  {/* Body Temperature */}
                  <div
                    className={`p-2 rounded-xl border flex flex-col justify-between ${
                      tempIsOut
                        ? 'bg-red-50 border-red-200 text-red-900'
                        : 'bg-slate-50 border-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[11px] flex items-center space-x-1">
                        <Thermometer className="w-3 h-3 text-amber-500 inline mr-1" />
                        Temperature
                      </span>
                      {tempIsOut ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-red-200 text-red-800 rounded">
                          {tempValue > tempThreshold.upperThreshold ? '> +2 SD' : '< -2 SD'}
                        </span>
                      ) : (
                        <Check className="w-3 h-3 text-emerald-500" />
                      )}
                    </div>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span className="text-base font-bold font-mono">
                        {animal.currentVitals.temperature.toFixed(1)}{' '}
                        <span className="text-[10px] font-normal text-slate-500">°C</span>
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {tempThreshold.lowerThreshold.toFixed(1)}-{tempThreshold.upperThreshold.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Respiration Rate */}
                  <div
                    className={`p-2 rounded-xl border flex flex-col justify-between ${
                      respIsOut
                        ? 'bg-red-50 border-red-200 text-red-900'
                        : 'bg-slate-50 border-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[11px] flex items-center space-x-1">
                        <Wind className="w-3 h-3 text-teal-500 inline mr-1" />
                        Resp Rate
                      </span>
                      {respIsOut ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-red-200 text-red-800 rounded">
                          {respValue > respThreshold.upperThreshold ? '> +2 SD' : '< -2 SD'}
                        </span>
                      ) : (
                        <Check className="w-3 h-3 text-emerald-500" />
                      )}
                    </div>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span className="text-base font-bold font-mono">
                        {animal.currentVitals.respRate}{' '}
                        <span className="text-[10px] font-normal text-slate-500">br/m</span>
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {respThreshold.lowerThreshold}-{respThreshold.upperThreshold}
                      </span>
                    </div>
                  </div>

                  {/* SpO2 */}
                  <div className="p-2 rounded-xl border bg-slate-50 border-slate-100 text-slate-800 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[11px] flex items-center space-x-1">
                        <Activity className="w-3 h-3 text-blue-500 inline mr-1" />
                        SpO₂
                      </span>
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span className="text-base font-bold font-mono">
                        {animal.currentVitals.spO2}{' '}
                        <span className="text-[10px] font-normal text-slate-500">%</span>
                      </span>
                      <span className="text-[10px] text-slate-400">
                        &gt; {animal.thresholds.spO2.lowerThreshold}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Autoencoder Anomaly Score Meter */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Composite Anomaly Score (S)</span>
                    <span
                      className={`font-mono font-bold ${
                        animal.compositeScore > 0.7
                          ? 'text-red-600'
                          : animal.compositeScore > 0.4
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {animal.compositeScore.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        animal.compositeScore > 0.7
                          ? 'bg-red-500'
                          : animal.compositeScore > 0.4
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, animal.compositeScore * 100)}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Autoencoder error: {animal.autoencoderError.toFixed(2)}</span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Lead: ~{animal.estimatedLeadTimeDays}d
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {/* Simulation trigger for this animal */}
                <button
                  id={`btn-spike-${animal.id}`}
                  onClick={() => onInjectAnimalSpike(animal.id, 'heartRate')}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center space-x-1 transition-colors"
                  title="Simulate sudden physiological spike in this animal"
                >
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>Test Spike</span>
                </button>

                {/* Inspect deep dive dashboard */}
                <button
                  id={`btn-inspect-${animal.id}`}
                  onClick={() => onSelectAnimal(animal.id)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center space-x-1 transition-colors shadow-xs"
                >
                  <span>Open Dashboard</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
