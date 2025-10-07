import type { PricingCalculator, ServiceType, AdditionalFeature, CompanySize, PricingTier } from '@/types';

// Pricing base basato su research per PMI italiane
const BASE_PRICING = {
  '1-5': 79,    // Micro-imprese
  '6-20': 149,  // Target principale - ottimizzato per conversion
  '21-100': 299, // PMI medie
  '100+': 599   // Enterprise
};

// Multipliers per company size
const SIZE_MULTIPLIERS = {
  '1-5': 0.8,    // Sconto per micro-imprese
  '6-20': 1.0,   // Prezzo standard
  '21-100': 1.4, // Premium per aziende medie
  '100+': 2.0    // Enterprise pricing
};

// Service pricing ottimizzato per valore percepito
const SERVICE_PRICING: Record<ServiceType, { price: number; recurring: boolean; category: string }> = {
  'wordpress-maintenance': { price: 0, recurring: false, category: 'core' },
  'monitoring-24-7': { price: 29, recurring: true, category: 'security' },
  'backup-automatic': { price: 19, recurring: true, category: 'security' },
  'security-optimization': { price: 49, recurring: true, category: 'security' },
  'performance-optimization': { price: 39, recurring: true, category: 'performance' },
  'seo-optimization': { price: 59, recurring: true, category: 'marketing' },
  'content-updates': { price: 35, recurring: true, category: 'content' },
  'technical-support': { price: 45, recurring: true, category: 'support' }
};

// Additional features per upselling
const ADDITIONAL_FEATURES: AdditionalFeature[] = [
  {
    id: 'ssl-certificate',
    name: 'Certificato SSL Premium',
    price: 15,
    recurring: true,
    description: 'Certificato SSL Wildcard con validità estesa',
    category: 'security'
  },
  {
    id: 'cdn-optimization',
    name: 'CDN Globale',
    price: 25,
    recurring: true,
    description: 'Content Delivery Network con 50+ locations worldwide',
    category: 'performance'
  },
  {
    id: 'malware-removal',
    name: 'Rimozione Malware',
    price: 150,
    recurring: false,
    description: 'Servizio una-tantum per rimozione completa malware',
    category: 'security'
  },
  {
    id: 'database-optimization',
    name: 'Ottimizzazione Database',
    price: 75,
    recurring: false,
    description: 'Ottimizzazione completa database e query',
    category: 'performance'
  },
  {
    id: 'google-analytics-setup',
    name: 'Setup Analytics Avanzato',
    price: 95,
    recurring: false,
    description: 'Configurazione Google Analytics 4 con conversion tracking',
    category: 'marketing'
  },
  {
    id: 'priority-support',
    name: 'Supporto Prioritario 24/7',
    price: 89,
    recurring: true,
    description: 'Supporto tecnico prioritario con risposta < 1 ora',
    category: 'support'
  },
  {
    id: 'monthly-reports',
    name: 'Report Dettagliati Mensili',
    price: 35,
    recurring: true,
    description: 'Report analitici dettagliati su performance e sicurezza',
    category: 'support'
  },
  {
    id: 'api-integration',
    name: 'Integrazione API Custom',
    price: 120,
    recurring: false,
    description: 'Integrazione con API di terze parti',
    category: 'support'
  }
];

// Annual discounts basati su psychology research
const ANNUAL_DISCOUNTS = {
  '1-5': 0.10,    // 10% sconto micro-imprese
  '6-20': 0.167,  // 16.7% = 2 mesi gratuiti (psychological sweet spot)
  '21-100': 0.20, // 20% sconto PMI medie
  '100+': 0.25    // 25% sconto enterprise
};

// Setup fees per complessità
const SETUP_FEES = {
  simple: 0,      // Nessun setup fee
  medium: 149,    // Setup standard
  complex: 299    // Setup complesso
};

/**
 * Calcola il prezzo personalizzato basato su company size e servizi
 */
export function calculatePricing(
  companySize: CompanySize,
  selectedServices: ServiceType[],
  additionalFeatures: string[] = [],
  billingCycle: 'monthly' | 'annual' = 'monthly'
): PricingCalculator {
  // Base price per company size
  const basePrice = BASE_PRICING[companySize];
  const multiplier = SIZE_MULTIPLIERS[companySize];
  
  // Calculate services pricing
  let servicesPrice = 0;
  const selectedServicesData = selectedServices.map(service => {
    const serviceData = SERVICE_PRICING[service];
    servicesPrice += serviceData.price;
    return {
      service,
      price: serviceData.price,
      recurring: serviceData.recurring
    };
  });
  
  // Calculate additional features pricing
  let featuresPrice = 0;
  const selectedFeaturesData = additionalFeatures.map(featureId => {
    const feature = ADDITIONAL_FEATURES.find(f => f.id === featureId);
    if (feature) {
      featuresPrice += feature.price;
      return feature;
    }
    return null;
  }).filter(Boolean) as AdditionalFeature[];
  
  // Calculate total price
  const monthlyTotal = (basePrice + servicesPrice + featuresPrice) * multiplier;
  
  // Apply annual discount if needed
  let annualDiscount = 0;
  let totalPrice = monthlyTotal;
  
  if (billingCycle === 'annual') {
    annualDiscount = ANNUAL_DISCOUNTS[companySize];
    totalPrice = monthlyTotal * 12 * (1 - annualDiscount);
  }
  
  // Calculate setup fee based on complexity
  const setupFee = calculateSetupFee(selectedServices, companySize);
  
  return {
    basePrice,
    companySizeMultiplier: multiplier,
    selectedServices: selectedServicesData,
    additionalFeatures: selectedFeaturesData,
    totalPrice: Math.round(totalPrice),
    setupFee: setupFee > 0 ? setupFee : undefined,
    annualDiscount: billingCycle === 'annual' ? annualDiscount : undefined
  };
}

/**
 * Calcola la setup fee based on project complexity
 */
function calculateSetupFee(services: ServiceType[], companySize: CompanySize): number {
  let complexityScore = 0;
  
  // Score based on services
  services.forEach(service => {
    switch (service) {
      case 'security-optimization':
        complexityScore += 3;
        break;
      case 'performance-optimization':
        complexityScore += 2;
        break;
      case 'monitoring-24-7':
        complexityScore += 2;
        break;
      case 'seo-optimization':
        complexityScore += 1;
        break;
      default:
        complexityScore += 0.5;
    }
  });
  
  // Score based on company size
  const sizeScore = {
    '1-5': 1,
    '6-20': 2,
    '21-100': 3,
    '100+': 4
  }[companySize];
  
  const totalScore = complexityScore + sizeScore;
  
  if (totalScore <= 3) return SETUP_FEES.simple;
  if (totalScore <= 6) return SETUP_FEES.medium;
  return SETUP_FEES.complex;
}

/**
 * Genera pricing tiers per display
 */
export function generatePricingTiers(): PricingTier[] {
  const tiers: PricingTier[] = [
    {
      id: 'essenziale',
      name: 'Essenziale',
      price: BASE_PRICING['1-5'],
      annualPrice: Math.round(BASE_PRICING['1-5'] * 12 * (1 - ANNUAL_DISCOUNTS['1-5'])),
      annualDiscount: ANNUAL_DISCOUNTS['1-5'],
      description: 'Perfetto per micro-imprese e freelance',
      features: generateTierFeatures('essenziale'),
      targetCompanySize: ['1-5'],
      ctaText: 'Inizia Ora',
      guarantee: 'Soddisfatti o Rimborsati 30 giorni'
    },
    {
      id: 'professionale',
      name: 'Professionale',
      price: BASE_PRICING['6-20'],
      annualPrice: Math.round(BASE_PRICING['6-20'] * 12 * (1 - ANNUAL_DISCOUNTS['6-20'])),
      annualDiscount: ANNUAL_DISCOUNTS['6-20'],
      description: 'La scelta ideale per PMI in crescita',
      features: generateTierFeatures('professionale'),
      popular: true,
      targetCompanySize: ['6-20'],
      ctaText: 'Scelto da +500 Aziende',
      ctaUrgency: 'Offerta Limitata: 2 Mesi Gratuiti',
      guarantee: 'Soddisfatti o Rimborsati 30 giorni'
    },
    {
      id: 'business',
      name: 'Business',
      price: BASE_PRICING['21-100'],
      annualPrice: Math.round(BASE_PRICING['21-100'] * 12 * (1 - ANNUAL_DISCOUNTS['21-100'])),
      annualDiscount: ANNUAL_DISCOUNTS['21-100'],
      description: 'Soluzione completa per aziende strutturate',
      features: generateTierFeatures('business'),
      targetCompanySize: ['21-100'],
      ctaText: 'Contatta Vendite',
      guarantee: 'SLA Garantito 99.9%'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: BASE_PRICING['100+'],
      annualPrice: Math.round(BASE_PRICING['100+'] * 12 * (1 - ANNUAL_DISCOUNTS['100+'])),
      annualDiscount: ANNUAL_DISCOUNTS['100+'],
      description: 'Soluzioni su misura per grandi aziende',
      features: generateTierFeatures('enterprise'),
      targetCompanySize: ['100+'],
      ctaText: 'Richiedi Consulenza',
      guarantee: 'Contratto SLA Personalizzato'
    }
  ];
  
  return tiers;
}

/**
 * Genera le features per ogni tier
 */
function generateTierFeatures(tierId: string) {
  const allFeatures = [
    {
      id: 'wordpress-maintenance',
      name: 'Manutenzione WordPress Core',
      description: 'Aggiornamenti automatici e sicurezza di base',
      included: true,
      tooltip: 'Manteniamo sempre aggiornato il tuo WordPress'
    },
    {
      id: 'monitoring-24-7',
      name: 'Monitoraggio 24/7',
      description: 'Controllo continuo dello stato del sito',
      included: tierId !== 'essenziale',
      tooltip: 'Monitoraggio proattivo con alert immediati'
    },
    {
      id: 'backup-automatic',
      name: 'Backup Automatici Daily',
      description: 'Backup giornalieri su cloud sicuro',
      included: true,
      tooltip: 'Backup automatici con conservazione 30 giorni'
    },
    {
      id: 'security-optimization',
      name: 'Ottimizzazione Sicurezza',
      description: 'Scansione malware e hardened security',
      included: tierId !== 'essenziale',
      highlight: true,
      tooltip: 'Protezione avanzata con firewall e scansione vulnerabilità'
    },
    {
      id: 'performance-optimization',
      name: 'Ottimizzazione Performance',
      description: 'Ottimizzazione database e caching',
      included: tierId !== 'essenziale',
      highlight: true,
      tooltip: 'Velocità di caricamento ottimizzata per SEO'
    },
    {
      id: 'seo-optimization',
      name: 'SEO Base',
      description: 'Ottimizzazione SEO on-page',
      included: tierId === 'business' || tierId === 'enterprise',
      tooltip: 'Ottimizzazione base per motori di ricerca'
    },
    {
      id: 'content-updates',
      name: 'Aggiornamenti Contenuti',
      description: 'Fino a 2 ore/mese di aggiornamenti',
      included: tierId === 'business' || tierId === 'enterprise',
      tooltip: 'Aggiornamenti testi e immagini'
    },
    {
      id: 'technical-support',
      name: 'Supporto Tecnico',
      description: tierId === 'essenziale' ? 'Email 48h' : 
                   tierId === 'professionale' ? 'Email 24h' :
                   tierId === 'business' ? 'Email + Telefonico' : 'Dedicato 24/7',
      included: true,
      highlight: tierId !== 'essenziale',
      tooltip: 'Supporto tecnico specializzato'
    },
    {
      id: 'ssl-certificate',
      name: 'Certificato SSL',
      description: 'Certificato SSL incluso',
      included: tierId !== 'essenziale',
      tooltip: 'HTTPS gratuito e rinnovazione automatica'
    },
    {
      id: 'cdn-optimization',
      name: 'CDN Globale',
      description: 'Content Delivery Network',
      included: tierId === 'business' || tierId === 'enterprise',
      tooltip: 'Distribuzione globale contenuti veloce'
    },
    {
      id: 'monthly-reports',
      name: 'Report Mensili',
      description: 'Report performance e sicurezza',
      included: tierId === 'business' || tierId === 'enterprise',
      tooltip: 'Analisi dettagliate mensili'
    },
    {
      id: 'priority-support',
      name: 'Supporto Prioritario',
      description: 'Risposta garantita < 1 ora',
      included: tierId === 'enterprise',
      highlight: true,
      tooltip: 'Supporto dedicato con priorità massima'
    }
  ];
  
  return allFeatures;
}

/**
 * Calcola il ROI stimato per il cliente
 */
export function calculateROI(
  monthlyPrice: number,
  companySize: CompanySize,
  industry: string
): { monthly: number; annual: number; paybackPeriod: number } {
  // ROI multipliers basati su industry research
  const industryMultipliers: Record<string, number> = {
    technology: 3.5,
    finance: 4.2,
    healthcare: 2.8,
    retail: 5.1,
    manufacturing: 2.3,
    services: 3.1,
    education: 2.1,
    hospitality: 4.8,
    construction: 2.6,
    other: 2.5
  };
  
  const multiplier = industryMultipliers[industry] || 2.5;
  const monthlyROI = Math.round(monthlyPrice * multiplier);
  const annualROI = monthlyROI * 12;
  const paybackPeriod = Math.round(monthlyPrice / (monthlyROI / 30)); // giorni
  
  return {
    monthly: monthlyROI,
    annual: annualROI,
    paybackPeriod
  };
}

/**
 * Genera suggerimenti per upselling basati sul profilo
 */
export function generateUpsellSuggestions(
  companySize: CompanySize,
  selectedServices: ServiceType[],
  currentPrice: number
): { feature: AdditionalFeature; reason: string; priority: 'high' | 'medium' | 'low' }[] {
  const suggestions: { feature: AdditionalFeature; reason: string; priority: 'high' | 'medium' | 'low' }[] = [];
  
  // Analizza i servizi selezionati per dare suggerimenti pertinenti
  const hasSecurity = selectedServices.includes('security-optimization');
  const hasPerformance = selectedServices.includes('performance-optimization');
  const hasMonitoring = selectedServices.includes('monitoring-24-7');
  
  // Suggerimenti basati sui servizi esistenti
  if (hasSecurity && !selectedServices.includes('wordpress-maintenance')) {
    const sslFeature = ADDITIONAL_FEATURES.find(f => f.id === 'ssl-certificate');
    if (sslFeature) {
      suggestions.push({
        feature: sslFeature,
        reason: 'Completa la sicurezza del tuo sito con SSL Premium',
        priority: 'high'
      });
    }
  }
  
  if (hasPerformance && !selectedServices.includes('backup-automatic')) {
    const cdnFeature = ADDITIONAL_FEATURES.find(f => f.id === 'cdn-optimization');
    if (cdnFeature) {
      suggestions.push({
        feature: cdnFeature,
        reason: 'Massimizza la velocità globale con CDN distribuito',
        priority: 'high'
      });
    }
  }
  
  if (hasMonitoring && companySize === '21-100') {
    const priorityFeature = ADDITIONAL_FEATURES.find(f => f.id === 'priority-support');
    if (priorityFeature) {
      suggestions.push({
        feature: priorityFeature,
        reason: 'Per la tua dimensione aziendale, il supporto prioritario è essenziale',
        priority: 'medium'
      });
    }
  }
  
  // Suggerimenti basati sulla company size
  if (companySize === '100+' && !selectedServices.includes('technical-support')) {
    const reportsFeature = ADDITIONAL_FEATURES.find(f => f.id === 'monthly-reports');
    if (reportsFeature) {
      suggestions.push({
        feature: reportsFeature,
        reason: 'Report dettagliati essenziali per il management',
        priority: 'medium'
      });
    }
  }
  
  // Suggerimenti basati sul prezzo corrente (psychological barriers)
  if (currentPrice < 100) {
    const analyticsFeature = ADDITIONAL_FEATURES.find(f => f.id === 'google-analytics-setup');
    if (analyticsFeature && !selectedServices.includes('seo-optimization')) {
      suggestions.push({
        feature: analyticsFeature,
        reason: 'Inizia a misurare le performance con Analytics avanzato',
        priority: 'low'
      });
    }
  }
  
  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

/**
 * Formatta il prezzo per display con psychology pricing
 */
export function formatPrice(price: number, currency: string = '€'): string {
  return `${currency}${price.toLocaleString('it-IT')}`;
}

/**
 * Calcola lo sconto psicologico ottimale
 */
export function calculatePsychologicalDiscount(basePrice: number, targetPrice: number): {
  discount: number;
  displayPrice: number;
  psychological: boolean;
} {
  const discount = ((basePrice - targetPrice) / basePrice) * 100;
  
  // Check se il prezzo ha psychology appeal
  const lastDigit = targetPrice % 10;
  const psychological = lastDigit === 9 || lastDigit === 7;
  
  // Se non è psicologico, aggiustalo
  let displayPrice = targetPrice;
  if (!psychological && targetPrice > 50) {
    displayPrice = Math.floor(targetPrice / 10) * 10 - 1;
  }
  
  return {
    discount: Math.round(discount),
    displayPrice,
    psychological
  };
}