export type TaxonomicGroup = 'mammal' | 'bird' | 'reptile';

export type SensorModality =
  | 'wearable_collar'
  | 'ear_tag'
  | 'non_contact_radar'
  | 'subcutaneous_transponder'
  | 'perch_camera'
  | 'habitat_sensor';

export type AlertSeverity = 'normal' | 'observation' | 'urgent' | 'critical';

export type ClinicalCategory =
  | 'cardiovascular'
  | 'metabolic'
  | 'infectious'
  | 'gastrointestinal'
  | 'orthopedic'
  | 'dermatological'
  | 'behavioral'
  | 'acute_traumatic';

export type VitalParameterKey =
  | 'heartRate'
  | 'respRate'
  | 'temperature'
  | 'spO2'
  | 'activity'
  | 'systolicBP'
  | 'diastolicBP'
  | 'weight';

export interface VitalThreshold {
  key: VitalParameterKey;
  label: string;
  unit: string;
  baselineMean: number;
  sd: number;
  lowerThreshold: number; // Mean - 2 SD
  upperThreshold: number; // Mean + 2 SD
  status: 'Normal' | 'Caution' | 'High' | 'Low';
}

export interface TimeSeriesPoint {
  timestamp: string;
  dateLabel: string;
  value: number;
  isAnomaly: boolean;
  deviationSD: number;
  anomalyReason?: string;
}

export interface TelemetryAlert {
  id: string;
  animalId: string;
  animalName: string;
  species: string;
  enclosure: string;
  timestamp: string;
  severity: AlertSeverity;
  parameter: VitalParameterKey;
  parameterLabel: string;
  currentValue: number;
  baselineValue: number;
  thresholdViolated: 'upper' | 'lower';
  thresholdValue: number;
  deviationSD: number;
  leadTimeEstimate: string;
  message: string;
  suggestedResponse: string;
  category: ClinicalCategory;
  acknowledged: boolean;
}

export interface AnimalProfile {
  id: string;
  name: string;
  species: string;
  scientificName: string;
  group: TaxonomicGroup;
  sex: 'Male' | 'Female';
  age: string;
  weightKg: number;
  enclosure: string;
  sensorModalities: SensorModality[];
  currentStatus: AlertSeverity;
  compositeScore: number; // S_i,t in paper
  autoencoderError: number; // r_i,t
  isolationForestScore: number; // phi_i,t
  ruleSeverity: number; // rho_i,t
  currentVitals: Record<VitalParameterKey, number>;
  thresholds: Record<VitalParameterKey, VitalThreshold>;
  timeSeries: Record<VitalParameterKey, TimeSeriesPoint[]>;
  estimatedLeadTimeDays: number;
  suspectedCategory: ClinicalCategory;
  avatarIcon: string;
  habitatTemp: number; // °C
  habitatHumidity: number; // %
  ecgState: 'normal' | 'tachycardia' | 'bradycardia' | 'arrhythmia';
}
