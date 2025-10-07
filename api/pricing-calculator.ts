// Type definitions for API
interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

interface PricingRequest {
  companySize: string;
  selectedServices: string[];
  additionalFeatures: string[];
  billingCycle: 'monthly' | 'annual';
}

interface PricingCalculator {
  basePrice: number;
  companySizeMultiplier: number;
  selectedServices: ServicePrice[];
  additionalFeatures: AdditionalFeature[];
  totalPrice: number;
  setupFee?: number;
  annualDiscount?: number;
}

interface ServicePrice {
  service: string;
  price: number;
  recurring: boolean;
}

interface AdditionalFeature {
  id: string;
  name: string;
  price: number;
  recurring: boolean;
  description: string;
  category: string;
}

// Pricing calculation implementation
function calculatePricing(request: PricingRequest): PricingCalculator {
  // Base pricing per company size
  const basePricing: Record<string, number> = {
    '1-5': 79,
    '6-20': 149,
    '21-100': 299,
    '100+': 599
  };
  
  // Multipliers per company size
  const sizeMultipliers: Record<string, number> = {
    '1-5': 0.8,
    '6-20': 1.0,
    '21-100': 1.4,
    '100+': 2.0
  };
  
  // Service pricing
  const servicePricing: Record<string, { price: number; recurring: boolean }> = {
    'wordpress-maintenance': { price: 0, recurring: false },
    'monitoring-24-7': { price: 29, recurring: true },
    'backup-automatic': { price: 19, recurring: true },
    'security-optimization': { price: 49, recurring: true },
    'performance-optimization': { price: 39, recurring: true },
    'seo-optimization': { price: 59, recurring: true },
    'content-updates': { price: 35, recurring: true },
    'technical-support': { price: 45, recurring: true }
  };
  
  // Additional features
  const additionalFeatures: Record<string, AdditionalFeature> = {
    'ssl-certificate': {
      id: 'ssl-certificate',
      name: 'Certificato SSL Premium',
      price: 15,
      recurring: true,
      description: 'Certificato SSL Wildcard con validità estesa',
      category: 'security'
    },
    'cdn-optimization': {
      id: 'cdn-optimization',
      name: 'CDN Globale',
      price: 25,
      recurring: true,
      description: 'Content Delivery Network con 50+ locations worldwide',
      category: 'performance'
    },
    'malware-removal': {
      id: 'malware-removal',
      name: 'Rimozione Malware',
      price: 150,
      recurring: false,
      description: 'Servizio una-tantum per rimozione completa malware',
      category: 'security'
    },
    'priority-support': {
      id: 'priority-support',
      name: 'Supporto Prioritario 24/7',
      price: 89,
      recurring: true,
      description: 'Supporto tecnico prioritario con risposta < 1 ora',
      category: 'support'
    }
  };
  
  // Annual discounts
  const annualDiscounts: Record<string, number> = {
    '1-5': 0.10,
    '6-20': 0.167,
    '21-100': 0.20,
    '100+': 0.25
  };
  
  // Calculate base price
  const basePrice = basePricing[request.companySize] || 79;
  const multiplier = sizeMultipliers[request.companySize] || 1.0;
  
  // Calculate services pricing
  const selectedServicesData: ServicePrice[] = request.selectedServices.map(service => {
    const serviceData = servicePricing[service] || { price: 0, recurring: false };
    return {
      service,
      price: serviceData.price,
      recurring: serviceData.recurring
    };
  });
  
  // Calculate additional features pricing
  const selectedFeaturesData: AdditionalFeature[] = request.additionalFeatures.map(featureId => {
    const feature = additionalFeatures[featureId];
    return feature || null;
  }).filter(Boolean) as AdditionalFeature[];
  
  // Calculate total price
  let servicesPrice = selectedServicesData.reduce((total, service) => total + service.price, 0);
  let featuresPrice = selectedFeaturesData.reduce((total, feature) => total + feature.price, 0);
  
  const monthlyTotal = (basePrice + servicesPrice + featuresPrice) * multiplier;
  
  // Apply annual discount if needed
  let annualDiscount = 0;
  let totalPrice = monthlyTotal;
  
  if (request.billingCycle === 'annual') {
    annualDiscount = annualDiscounts[request.companySize] || 0.167;
    totalPrice = monthlyTotal * 12 * (1 - annualDiscount);
  }
  
  // Calculate setup fee
  const setupFee = calculateSetupFee(request.selectedServices, request.companySize);
  
  return {
    basePrice,
    companySizeMultiplier: multiplier,
    selectedServices: selectedServicesData,
    additionalFeatures: selectedFeaturesData,
    totalPrice: Math.round(totalPrice),
    setupFee: setupFee > 0 ? setupFee : undefined,
    annualDiscount: request.billingCycle === 'annual' ? annualDiscount : undefined
  };
}

function calculateSetupFee(services: string[], companySize: string): number {
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
  }[companySize] || 1;
  
  const totalScore = complexityScore + sizeScore;
  
  if (totalScore <= 3) return 0;
  if (totalScore <= 6) return 149;
  return 299;
}

// Edge Function per il calcolo del pricing
export async function POST({ request }: { request: Request }) {
  try {
    // Parse request body
    const pricingRequest: PricingRequest = await request.json();
    
    // Validate required fields
    const requiredFields = ['companySize', 'selectedServices', 'billingCycle'];
    const missingFields = requiredFields.filter(field => !pricingRequest[field as keyof PricingRequest]);
    
    if (missingFields.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Campi obbligatori mancanti',
          details: { missingFields }
        }
      } as APIResponse), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }
    
    // Calculate pricing
    const pricingResult = calculatePricing(pricingRequest);
    
    // Calculate ROI
    const roi = calculateROI(pricingResult.totalPrice, pricingRequest.companySize, 'technology');
    
    // Generate upsell suggestions
    const upsellSuggestions = generateUpsellSuggestions(
      pricingRequest.companySize,
      pricingRequest.selectedServices,
      pricingResult.totalPrice
    );
    
    // Return response
    return new Response(JSON.stringify({
      success: true,
      data: {
        pricing: pricingResult,
        roi,
        upsellSuggestions,
        psychologicalPricing: formatPrice(pricingResult.totalPrice)
      }
    } as APIResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
    
  } catch (error) {
    console.error('Pricing calculator error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore durante il calcolo del prezzo',
        details: (error as Error).message
      }
    } as APIResponse), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

// Helper functions
function calculateROI(monthlyPrice: number, companySize: string, industry: string): {
  monthly: number;
  annual: number;
  paybackPeriod: number;
} {
  // ROI multipliers based on industry
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

function generateUpsellSuggestions(
  companySize: string,
  selectedServices: string[],
  currentPrice: number
): { feature: AdditionalFeature; reason: string; priority: 'high' | 'medium' | 'low' }[] {
  const suggestions: { feature: AdditionalFeature; reason: string; priority: 'high' | 'medium' | 'low' }[] = [];
  
  // Check for security optimization
  if (!selectedServices.includes('security-optimization')) {
    suggestions.push({
      feature: {
        id: 'ssl-certificate',
        name: 'Certificato SSL Premium',
        price: 15,
        recurring: true,
        description: 'Certificato SSL Wildcard con validità estesa',
        category: 'security'
      },
      reason: 'Proteggi il tuo sito e i dati dei clienti con SSL Premium',
      priority: 'high'
    });
  }
  
  // Check for performance optimization
  if (!selectedServices.includes('performance-optimization')) {
    suggestions.push({
      feature: {
        id: 'cdn-optimization',
        name: 'CDN Globale',
        price: 25,
        recurring: true,
        description: 'Content Delivery Network con 50+ locations worldwide',
        category: 'performance'
      },
      reason: 'Migliora la velocità globale con CDN distribuito',
      priority: 'high'
    });
  }
  
  // Check for larger companies
  if (companySize === '21-100' || companySize === '100+') {
    suggestions.push({
      feature: {
        id: 'priority-support',
        name: 'Supporto Prioritario 24/7',
        price: 89,
        recurring: true,
        description: 'Supporto tecnico prioritario con risposta < 1 ora',
        category: 'support'
      },
      reason: 'Per la tua dimensione aziendale, il supporto prioritario è essenziale',
      priority: 'medium'
    });
  }
  
  return suggestions;
}

function formatPrice(price: number): string {
  // Check if the price has psychology appeal
  const lastDigit = price % 10;
  const psychological = lastDigit === 9 || lastDigit === 7;
  
  // If not psychological, adjust it
  let displayPrice = price;
  if (!psychological && price > 50) {
    displayPrice = Math.floor(price / 10) * 10 - 1;
  }
  
  return `€${displayPrice.toLocaleString('it-IT')}`;
}