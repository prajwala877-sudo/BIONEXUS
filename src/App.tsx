import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { AlertBanner } from './components/AlertBanner';
import { MultiAnimalMatrix } from './components/MultiAnimalMatrix';
import { AnimalDetailDashboard } from './components/AnimalDetailDashboard';
import { FrameworkOverview } from './components/FrameworkOverview';
import { AlertsDrawer } from './components/AlertsDrawer';
import { INITIAL_ANIMALS, INITIAL_ALERTS } from './data/animalsData';
import { AnimalProfile, TelemetryAlert, VitalParameterKey, AlertSeverity } from './types/telemetry';
import { alertAudio } from './utils/audioAlert';

export default function App() {
  const [animals, setAnimals] = useState<AnimalProfile[]>(INITIAL_ANIMALS);
  const [alerts, setAlerts] = useState<TelemetryAlert[]>(INITIAL_ALERTS);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>('PH-102938');
  const [currentView, setCurrentView] = useState<'matrix' | 'patient' | 'analytics'>('matrix');
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [streamSpeed, setStreamSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState<boolean>(false);
  const [bannerDismissed, setBannerDismissed] = useState<boolean>(false);

  const selectedAnimal = animals.find((a) => a.id === selectedAnimalId) || animals[0];

  // Acknowledge alert
  const handleAcknowledgeAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  }, []);

  // Resolve alert
  const handleResolveAlert = useCallback((alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  }, []);

  // Clear resolved
  const handleClearResolved = useCallback(() => {
    setAlerts((prev) => prev.filter((a) => !a.acknowledged));
  }, []);

  // Reset all data to baseline
  const handleResetData = useCallback(() => {
    setAnimals(INITIAL_ANIMALS);
    setAlerts(INITIAL_ALERTS);
    setBannerDismissed(false);
  }, []);

  // Inject specific animal spike
  const handleInjectAnimalSpike = useCallback(
    (animalId: string, paramKey: VitalParameterKey) => {
      setAnimals((prev) =>
        prev.map((animal) => {
          if (animal.id !== animalId) return animal;

          const thresh = animal.thresholds[paramKey];
          if (!thresh) return animal;

          // Spike to +3.5 SD
          const spikedVal = Number((thresh.baselineMean + 3.2 * thresh.sd).toFixed(1));
          const newVitals = { ...animal.currentVitals, [paramKey]: spikedVal };

          // Update time series
          const currentSeries = animal.timeSeries[paramKey] || [];
          const updatedSeries = [...currentSeries];
          if (updatedSeries.length > 0) {
            const lastPoint = updatedSeries[updatedSeries.length - 1];
            updatedSeries[updatedSeries.length - 1] = {
              ...lastPoint,
              value: spikedVal,
              isAnomaly: true,
              deviationSD: 3.2,
              anomalyReason: `Sudden spike to ${spikedVal} ${thresh.unit} exceeded +2 SD upper threshold`,
            };
          }

          const newScore = Math.min(0.96, Number((animal.compositeScore + 0.35).toFixed(2)));
          const newStatus: AlertSeverity = 'critical';

          return {
            ...animal,
            currentStatus: newStatus,
            compositeScore: newScore,
            autoencoderError: 0.92,
            ruleSeverity: 0.95,
            currentVitals: newVitals,
            timeSeries: {
              ...animal.timeSeries,
              [paramKey]: updatedSeries,
            },
          };
        })
      );

      // Create new alert
      const target = animals.find((a) => a.id === animalId);
      if (target) {
        const thresh = target.thresholds[paramKey];
        const spikedVal = Number((thresh.baselineMean + 3.2 * thresh.sd).toFixed(1));
        const newAlert: TelemetryAlert = {
          id: `ALT-${Date.now()}`,
          animalId: target.id,
          animalName: target.name,
          species: target.species,
          enclosure: target.enclosure,
          timestamp: 'Just now',
          severity: 'critical',
          parameter: paramKey,
          parameterLabel: thresh.label,
          currentValue: spikedVal,
          baselineValue: thresh.baselineMean,
          thresholdViolated: 'upper',
          thresholdValue: thresh.upperThreshold,
          deviationSD: 3.2,
          leadTimeEstimate: `~${target.estimatedLeadTimeDays} days ahead of clinical symptoms`,
          message: `Sudden acute elevation in ${thresh.label} (${spikedVal} ${thresh.unit}) breached upper safety margin (+3.2 SD). Autoencoder anomaly reconstruction error spiked to 0.92.`,
          suggestedResponse: `Immediate clinical triage by veterinary staff; check telemetry gateway status and verify physical signs at ${target.enclosure}.`,
          category: target.suspectedCategory,
          acknowledged: false,
        };

        setAlerts((prev) => [newAlert, ...prev]);
        setBannerDismissed(false);
        alertAudio.playAlert('critical');
      }
    },
    [animals]
  );

  // Global random anomaly injector
  const handleInjectRandomAnomaly = useCallback(() => {
    // Pick an animal that is currently normal or observation
    const candidates = animals.filter((a) => a.currentStatus !== 'critical');
    const target = candidates[Math.floor(Math.random() * candidates.length)] || animals[0];
    const params: VitalParameterKey[] = ['heartRate', 'temperature', 'respRate'];
    const randomParam = params[Math.floor(Math.random() * params.length)];
    handleInjectAnimalSpike(target.id, randomParam);
  }, [animals, handleInjectAnimalSpike]);

  // Real-time telemetry simulation loop
  useEffect(() => {
    if (!isStreaming) return;

    const intervalMs = Math.max(1000, Math.floor(3500 / streamSpeed));

    const timer = setInterval(() => {
      setAnimals((prev) =>
        prev.map((animal) => {
          // Small continuous physiological fluctuation (±1-3%)
          const hrThresh = animal.thresholds.heartRate;
          const tempThresh = animal.thresholds.temperature;
          const respThresh = animal.thresholds.respRate;

          // Natural drift
          const hrJitter = (Math.random() - 0.5) * (hrThresh.sd * 0.25);
          const tempJitter = (Math.random() - 0.5) * (tempThresh.sd * 0.15);
          const respJitter = (Math.random() - 0.5) * (respThresh.sd * 0.2);

          let nextHr = Math.round(animal.currentVitals.heartRate + hrJitter);
          let nextTemp = Number((animal.currentVitals.temperature + tempJitter).toFixed(1));
          let nextResp = Math.round(animal.currentVitals.respRate + respJitter);

          // Prevent drifting too far unless already in anomaly state
          if (animal.currentStatus === 'normal') {
            nextHr = Math.max(hrThresh.lowerThreshold + 1, Math.min(hrThresh.upperThreshold - 1, nextHr));
            nextTemp = Math.max(tempThresh.lowerThreshold + 0.1, Math.min(tempThresh.upperThreshold - 0.1, nextTemp));
            nextResp = Math.max(respThresh.lowerThreshold + 1, Math.min(respThresh.upperThreshold - 1, nextResp));
          }

          return {
            ...animal,
            currentVitals: {
              ...animal.currentVitals,
              heartRate: nextHr,
              temperature: nextTemp,
              respRate: nextResp,
            },
          };
        })
      );
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isStreaming, streamSpeed]);

  const activeAlertsCount = alerts.filter((a) => !a.acknowledged).length;
  const criticalCount = alerts.filter((a) => !a.acknowledged && a.severity === 'critical').length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Application Header */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        isStreaming={isStreaming}
        setIsStreaming={setIsStreaming}
        streamSpeed={streamSpeed}
        setStreamSpeed={setStreamSpeed}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        activeAlertsCount={activeAlertsCount}
        criticalCount={criticalCount}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        onInjectAnomaly={handleInjectRandomAnomaly}
        onResetData={handleResetData}
      />

      {/* Real-Time Alert Banner (if unacknowledged alerts exist) */}
      {!bannerDismissed && (
        <AlertBanner
          alerts={alerts}
          onSelectAnimal={(id) => {
            setSelectedAnimalId(id);
            setCurrentView('patient');
          }}
          onAcknowledgeAlert={handleAcknowledgeAlert}
          onDismiss={() => setBannerDismissed(true)}
        />
      )}

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'matrix' && (
          <MultiAnimalMatrix
            animals={animals}
            onSelectAnimal={(id) => {
              setSelectedAnimalId(id);
              setCurrentView('patient');
            }}
            onInjectAnimalSpike={handleInjectAnimalSpike}
          />
        )}

        {currentView === 'patient' && (
          <AnimalDetailDashboard
            animal={selectedAnimal}
            allAnimals={animals}
            onSelectAnimal={(id) => setSelectedAnimalId(id)}
            onBackToMatrix={() => setCurrentView('matrix')}
            onTriggerAlert={(paramKey) => handleInjectAnimalSpike(selectedAnimal.id, paramKey)}
          />
        )}

        {currentView === 'analytics' && <FrameworkOverview />}
      </main>

      {/* Alerts Slide-Over Drawer */}
      <AlertsDrawer
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={alerts}
        onAcknowledgeAlert={handleAcknowledgeAlert}
        onResolveAlert={handleResolveAlert}
        onSelectAnimal={(id) => {
          setSelectedAnimalId(id);
          setCurrentView('patient');
        }}
        onClearResolved={handleClearResolved}
      />
    </div>
  );
}
