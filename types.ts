
export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum AppPhase {
  ONBOARDING = 'ONBOARDING',
  CALIBRATION = 'CALIBRATION',
  SCANNING = 'SCANNING',
  HARMONIZING = 'HARMONIZING',
  SUMMARY = 'SUMMARY'
}

export interface DetectedObject {
  id: string;
  label: string;
  risk: RiskLevel;
  position: [number, number, number]; // [x, y, z] in 3D space
  timestamp: number;
  productMatch?: Product;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  sku: string;
  image: string;
  description: string;
}

export interface SpatialRecord {
  id: string;
  objects: DetectedObject[];
  createdAt: number;
  analysis: string;
}
