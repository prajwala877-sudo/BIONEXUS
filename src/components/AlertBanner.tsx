import React from 'react';
import { AlertCircle, AlertTriangle, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { TelemetryAlert } from '../types/telemetry';

interface AlertBannerProps {
  alerts: TelemetryAlert[];
  onSelectAnimal: (animalId: string) => void;
  onAcknowledgeAlert: (alertId: string) => void;
  onDismiss: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  alerts,
  onSelectAnimal,
  onAcknowledgeAlert,
  onDismiss,
}) => {
  const activeAlerts = alerts.filter((a) => !a.acknowledged);
  if (activeAlerts.length === 0) return null;

  const topAlert = activeAlerts[0];
  const isCritical = topAlert.severity === 'critical';

  return (
    <div
      id="realtime-alert-banner"
      className={`border-b transition-colors px-4 py-2.5 shadow-md ${
        isCritical
          ? 'bg-red-950/90 border-red-800 text-red-100'
          : 'bg-amber-950/90 border-amber-800 text-amber-100'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
        <div className="flex items-start sm:items-center space-x-2.5">
          <div className="p-1 rounded bg-black/20 shrink-0 mt-0.5 sm:mt-0">
            {isCritical ? (
              <AlertCircle className="w-4 h-4 text-red-400 animate-bounce" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap">
              <span
                className={`uppercase font-bold tracking-wider px-1.5 py-0.5 rounded text-[10px] ${
                  isCritical ? 'bg-red-700 text-white' : 'bg-amber-700 text-white'
                }`}
              >
                {topAlert.severity} Real-Time Alert
              </span>
              <span className="font-semibold text-white">
                {topAlert.animalName} ({topAlert.species})
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-200">
                {topAlert.parameterLabel}:{' '}
                <strong className="text-white font-mono text-sm">{topAlert.currentValue}</strong>{' '}
                (Breached {topAlert.thresholdViolated} limit of{' '}
                <span className="font-mono">{topAlert.thresholdValue}</span>,{' '}
                {topAlert.deviationSD > 0 ? `+${topAlert.deviationSD}` : topAlert.deviationSD} SD)
              </span>
            </div>
            <p className="text-slate-300 text-[11px] mt-0.5 line-clamp-1">
              {topAlert.message} • <span className="text-emerald-300 font-medium">{topAlert.leadTimeEstimate}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
          <button
            id="banner-acknowledge-btn"
            onClick={() => onAcknowledgeAlert(topAlert.id)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-black/30 hover:bg-black/40 border border-white/20 text-white transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ack</span>
          </button>

          <button
            id="banner-view-animal-btn"
            onClick={() => onSelectAnimal(topAlert.animalId)}
            className={`flex items-center space-x-1 px-3 py-1 rounded font-semibold transition-colors ${
              isCritical
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            <span>Inspect Vitals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            id="banner-dismiss-btn"
            onClick={onDismiss}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-black/20"
            title="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
