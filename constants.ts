
import { RiskLevel, Product } from './types';

export const RISK_COLORS = {
  [RiskLevel.LOW]: '#10b981', // Emerald 500
  [RiskLevel.MEDIUM]: '#f59e0b', // Amber 500
  [RiskLevel.HIGH]: '#ef4444', // Red 500
};

export const PRODUCT_DATABASE: Record<string, Product> = {
  'router': {
    id: 'p1',
    name: 'Terralux Router Guard',
    price: 89.00,
    sku: 'TX-RG-01',
    image: 'https://picsum.photos/seed/router/200/200',
    description: 'Mu-metal shielding to reduce RF radiation without killing Wi-Fi range.'
  },
  'laptop': {
    id: 'p2',
    name: 'Bio-Static Laptop Shield',
    price: 65.00,
    sku: 'TX-LS-05',
    image: 'https://picsum.photos/seed/laptop/200/200',
    description: 'Grounding pad for heat and EMF absorption.'
  },
  'microwave': {
    id: 'p3',
    name: 'Industrial Harmonizer',
    price: 149.00,
    sku: 'TX-IH-99',
    image: 'https://picsum.photos/seed/microwave/200/200',
    description: 'Broad-spectrum attenuation for high-wattage appliances.'
  },
  'bed': {
    id: 'p4',
    name: 'Silver-Infused Canopy',
    price: 499.00,
    sku: 'TX-BC-12',
    image: 'https://picsum.photos/seed/bed/200/200',
    description: 'Complete Faraday protection for your sleep sanctuary.'
  }
};

export const LABEL_TO_RISK: Record<string, RiskLevel> = {
  'cell phone': RiskLevel.HIGH,
  'laptop': RiskLevel.MEDIUM,
  'tv': RiskLevel.MEDIUM,
  'microwave': RiskLevel.HIGH,
  'refrigerator': RiskLevel.MEDIUM,
  'oven': RiskLevel.MEDIUM,
  'bed': RiskLevel.LOW, // Bio-zone
  'couch': RiskLevel.LOW,
};
