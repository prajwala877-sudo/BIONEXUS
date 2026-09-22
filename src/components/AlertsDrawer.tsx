import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  X,
  CheckCircle2,
  ExternalLink,
  Clock,
  Filter,
  Trash2,
  Stethoscope,
  ShieldAlert,
} from 'lucide-react';
import { TelemetryAlert, AlertSeverity } from '../types/telemetry';

interface AlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: TelemetryAlert[];
  onAcknowledgeAlert: (alertId: string) => void;
  onResolveAlert: (alertId: string) => void;
  onSelectAnimal: (animalId: string) => void;
  onClearResolved: () => void;
}

export const AlertsDrawer: React.FC<AlertsDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  onAcknowledgeAlert,
  onResolveAlert,
  onSelectAnimal,
  onClearResolved,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'all' | AlertSeverity>('all');

  if (!isOpen) return null;

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity !== 'all' && a.severity !== filterSeverity) return false;
    return true;
  });

  const activeCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Real-Time Clinical Alert Hub
                </h2>
                <p className="text-[11px] text-slate-400">
                  {activeCount} unacknowledged vitals deviation alerts
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Bar */}
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
              {(['all', 'critical', 'urgent', 'observation'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2 py-1 rounded-md capitalize transition-colors ${
                    filterSeverity === sev
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            <button
              onClick={onClearResolved}
              className="text-slate-500 hover:text-red-600 flex items-center space-x-1 transition-colors"
              title="Clear acknowledged alerts"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear Ack</span>
            </button>
          </div>

          {/* Alert List */}
          <div className="p-5 overflow-y-auto flex-1 space-y-4">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400 mb-2 opacity-80" />
                <p className="font-semibold text-slate-700">No alerts matching filter</p>
                <p className="text-xs mt-1">All animals currently within physiological baseline tolerances.</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const isCritical = alert.severity === 'critical';
                const isUrgent = alert.severity === 'urgent';

                const borderClass = isCritical
                  ? 'border-red-300 bg-red-50/40'
                  : isUrgent
                  ? 'border-orange-300 bg-orange-50/40'
                  : 'border-amber-200 bg-amber-50/30';

                return (
                  <div
                    key={alert.id}
                    className={`rounded-xl border p-4 text-xs transition-all relative ${borderClass}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {isCritical ? (
                          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <div>
                          <span className="font-bold text-slate-900 text-sm">
                            {alert.animalName}
                          </span>{' '}
                          <span className="text-slate-500 italic">({alert.species})</span>
                          <div className="text-[11px] text-slate-500">
                            {alert.enclosure} • #{alert.animalId}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`uppercase font-bold tracking-wider px-2 py-0.5 rounded-full text-[10px] ${
                          isCritical
                            ? 'bg-red-600 text-white'
                            : isUrgent
                            ? 'bg-orange-600 text-white'
                            : 'bg-amber-600 text-white'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>

                    {/* Parameter breach info */}
                    <div className="mt-3 p-2 rounded-lg bg-white/80 border border-slate-200/70">
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="font-semibold">{alert.parameterLabel}:</span>
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {alert.currentValue}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center justify-between mt-1">
                        <span>
                          Threshold ({alert.thresholdViolated}): {alert.thresholdValue}
                        </span>
                        <span className="font-mono font-semibold text-red-600">
                          {alert.deviationSD > 0 ? `+${alert.deviationSD}` : alert.deviationSD} SD
                        </span>
                      </div>
                    </div>

                    {/* Clinical Details */}
                    <p className="mt-2.5 text-slate-700 text-[11px] leading-relaxed">
                      {alert.message}
                    </p>

                    <div className="mt-2 p-2 rounded-lg bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900">
                      <strong className="block text-blue-950 font-semibold mb-0.5">
                        Protocol:
                      </strong>
                      {alert.suggestedResponse}
                    </div>

                    {/* Metadata and lead time */}
                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {alert.timestamp}
                      </span>
                      <span className="text-emerald-700 font-medium">
                        {alert.leadTimeEstimate}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          onSelectAnimal(alert.animalId);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded bg-slate-900 text-white text-xs font-medium flex items-center space-x-1 hover:bg-slate-800 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Inspect Animal</span>
                      </button>

                      <div className="flex items-center space-x-1.5">
                        {!alert.acknowledged ? (
                          <button
                            onClick={() => onAcknowledgeAlert(alert.id)}
                            className="px-2.5 py-1 rounded border border-slate-300 hover:bg-white text-slate-700 text-xs font-semibold flex items-center space-x-1 transition-colors"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Acknowledge</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-semibold flex items-center">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Acknowledged
                          </span>
                        )}

                        <button
                          onClick={() => onResolveAlert(alert.id)}
                          className="px-2.5 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold transition-colors"
                        >
                          Resolve
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-1.5">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              <span>Layer 4 Clinical Feedback Enabled</span>
            </div>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
