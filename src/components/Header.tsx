import React from 'react';
import {
  Activity,
  AlertTriangle,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Layers,
  LayoutGrid,
  LineChart,
} from 'lucide-react';
import { alertAudio } from '../utils/audioAlert';

interface HeaderProps {
  currentView: 'matrix' | 'patient' | 'analytics';
  setCurrentView: (view: 'matrix' | 'patient' | 'analytics') => void;
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;
  streamSpeed: number;
  setStreamSpeed: (speed: number) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  activeAlertsCount: number;
  criticalCount: number;
  onOpenAlerts: () => void;
  onInjectAnomaly: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  isStreaming,
  setIsStreaming,
  streamSpeed,
  setStreamSpeed,
  isMuted,
  setIsMuted,
  activeAlertsCount,
  criticalCount,
  onOpenAlerts,
  onInjectAnomaly,
  onResetData,
}) => {
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    alertAudio.setMuted(nextMuted);
    if (!nextMuted) {
      alertAudio.playAlert('observation');
    }
  };

  return (
    <header id="app-header" className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Brand & Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-900/30">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg font-bold tracking-tight text-white">BioNexus</h1>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                    Precision Telemetry
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Multi-Species Real-Time Vitals & Anomaly Detection Framework
                </p>
              </div>
            </div>

            {/* Mobile Alerts Trigger */}
            <button
              id="mobile-alerts-toggle"
              onClick={onOpenAlerts}
              className="md:hidden relative p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg border border-slate-700"
              title="View Alerts"
            >
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              {activeAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-slate-900">
                  {activeAlertsCount}
                </span>
              )}
            </button>
          </div>

          {/* Navigation Views */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs font-medium self-start md:self-auto overflow-x-auto max-w-full">
            <button
              id="nav-view-matrix"
              onClick={() => setCurrentView('matrix')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                currentView === 'matrix'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Simultaneous Matrix</span>
            </button>

            <button
              id="nav-view-patient"
              onClick={() => setCurrentView('patient')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                currentView === 'patient'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <LineChart className="w-3.5 h-3.5" />
              <span>Patient Dashboard</span>
            </button>

            <button
              id="nav-view-analytics"
              onClick={() => setCurrentView('analytics')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                currentView === 'analytics'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Framework Analytics</span>
            </button>
          </div>

          {/* Telemetry Stream Controls & Real-Time Alert Hub */}
          <div className="flex items-center space-x-2 self-end md:self-auto">
            {/* Live Ticker status */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 bg-slate-800/60 border border-slate-700/80 rounded-lg text-xs text-slate-300">
              <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{isStreaming ? 'Stream Active' : 'Stream Paused'}</span>
            </div>

            {/* Play/Pause Live Simulation */}
            <button
              id="stream-play-pause-btn"
              onClick={() => setIsStreaming(!isStreaming)}
              className={`p-1.5 rounded-lg border text-xs flex items-center space-x-1 transition-colors ${
                isStreaming
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  : 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500'
              }`}
              title={isStreaming ? 'Pause live stream' : 'Resume live stream'}
            >
              {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isStreaming ? 'Pause' : 'Resume'}</span>
            </button>

            {/* Speed Control */}
            <button
              id="stream-speed-btn"
              onClick={() => setStreamSpeed(streamSpeed === 1 ? 2 : streamSpeed === 2 ? 5 : 1)}
              className="px-2 py-1 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-lg transition-colors"
              title="Change simulation speed"
            >
              {streamSpeed}x
            </button>

            {/* Sound Mute Toggle */}
            <button
              id="stream-audio-btn"
              onClick={toggleMute}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                isMuted
                  ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  : 'bg-slate-800 border-emerald-600/60 text-emerald-400 hover:bg-slate-700'
              }`}
              title={isMuted ? 'Unmute alert audio' : 'Mute alert audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Inject Anomaly Simulator */}
            <button
              id="inject-anomaly-btn"
              onClick={onInjectAnomaly}
              className="flex items-center space-x-1 px-2.5 py-1 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-medium rounded-lg transition-colors"
              title="Inject abnormal vital sign spike to test real-time threshold alert"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Simulate Spike</span>
            </button>

            {/* Reset */}
            <button
              id="reset-data-btn"
              onClick={onResetData}
              className="p-1.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
              title="Reset telemetry to baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Active Alerts Button */}
            <button
              id="active-alerts-header-btn"
              onClick={onOpenAlerts}
              className={`relative flex items-center space-x-1.5 px-3 py-1 rounded-lg border text-xs font-medium transition-all ${
                criticalCount > 0
                  ? 'bg-red-950/60 border-red-600/80 text-red-200 animate-pulse'
                  : activeAlertsCount > 0
                  ? 'bg-amber-950/50 border-amber-600/80 text-amber-200'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <AlertTriangle className={`w-3.5 h-3.5 ${criticalCount > 0 ? 'text-red-400' : 'text-amber-400'}`} />
              <span>Alerts</span>
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full font-bold text-[11px] ${
                  criticalCount > 0 ? 'bg-red-600 text-white' : activeAlertsCount > 0 ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300'
                }`}
              >
                {activeAlertsCount}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
