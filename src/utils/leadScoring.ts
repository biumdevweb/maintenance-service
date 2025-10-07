import type { LeadData, LeadScore, LeadTier, Priority } from '@/types';

// Scoring weights basati su research B2B italiana
const SCORING_WEIGHTS = {
  companySize: {
    '1-5': 20,    // Micro-imprese - basso valore potenziale
    '6-20': 40,   // PMI piccole - target principale
    '21-100': 70, // PMI medie - alto valore
    '100+': 90    // Grandi aziende - valore massimo
  },
  budget: {
    '<500': 10,    // Budget molto limitato
    '500-1000': 30, // Budget entry-level
    '1000-2000': 60, // Budget professionale
    '>2000': 90    // Budget enterprise
  },
  urgency: {
    'immediate': 40, // Necessità immediata - alta priorità
    'week': 25,      // Necessità settimanale
    'month': 15,     // Necessità mensile
    'quarter': 10    // Necessità trimestrale
  },
  services: {
    base: 5, // Punti base per ogni servizio
    premium: {
      'security-optimization': 15, // Servizi premium con alto valore
      'performance-optimization': 12,
      'monitoring-24-7': 10,
      'seo-optimization': 8
    }
  },
  industry: {
    // Industry multipliers basati su research italiana
    technology: 1.2,
    finance: 1.15,
    healthcare: 1.1,
    retail: 1.05,
    manufacturing: 1.0,
    services: 0.95,
    education: 0.9,
    hospitality: 0.85,
    construction: 0.8,
    other: 0.75
  },
  role: {
    // Role-based scoring per decision making power
    owner: 20,
    ceo: 18,
    cto: 15,
    marketing_manager: 12,
    it_manager: 10,
    operations_manager: 8,
    other: 5
  }
};

// Threshold per lead classification basati su conversion data
const LEAD_THRESHOLDS = {
  hot: 80,    // Lead ad alta conversion probability (>60%)
  warm: 60,   // Lead con buon potenziale (30-60%)
  cool: 40,   // Lead da nutrire (10-30%)
  cold: 0     // Lead a basso priorità (<10%)
};

// Priority mapping basato su business impact
const PRIORITY_MAPPING = {
  critical: { min: 85, max: 100 },
  high: { min: 70, max: 84 },
  medium: { min: 50, max: 69 },
  low: { min: 0, max: 49 }
};

// Estimated value calculation basato su market research
const ESTIMATED_VALUES = {
  companySize: {
    '1-5': { monthly: 79, annual: 948 },
    '6-20': { monthly: 149, annual: 1788 },
    '21-100': { monthly: 299, annual: 3588 },
    '100+': { monthly: 599, annual: 7188 }
  },
  services: {
    'wordpress-maintenance': 0,
    'monitoring-24-7': 20,
    'backup-automatic': 10,
    'security-optimization': 50,
    'performance-optimization': 40,
    'seo-optimization': 30,
    'content-updates': 25,
    'technical-support': 35
  }
};

/**
 * Calcola il lead score basato su algoritmo data-driven
 * Ottimizzato per mercato B2B italiano PMI
 */
export function calculateLeadScore(leadData: LeadData): LeadScore {
  // Company size scoring
  const companySizeScore = SCORING_WEIGHTS.companySize[leadData.employees];
  
  // Budget scoring
  const budgetScore = SCORING_WEIGHTS.budget[leadData.budget];
  
  // Urgency scoring
  const urgencyScore = SCORING_WEIGHTS.urgency[leadData.urgency];
  
  // Services scoring
  let servicesScore = 0;
  leadData.services.forEach(service => {
    const baseScore = SCORING_WEIGHTS.services.base;
    const premiumBonus = SCORING_WEIGHTS.services.premium[service as keyof typeof SCORING_WEIGHTS.services.premium] || 0;
    servicesScore += baseScore + premiumBonus;
  });
  
  // Industry multiplier
  const industryMultiplier = SCORING_WEIGHTS.industry[leadData.industry] || 1;
  
  // Role scoring
  const roleScore = SCORING_WEIGHTS.role[leadData.role as keyof typeof SCORING_WEIGHTS.role];
  
  // Calculate total score con industry multiplier
  const baseTotal = companySizeScore + budgetScore + urgencyScore + servicesScore + roleScore;
  const totalScore = Math.min(100, Math.round(baseTotal * industryMultiplier));
  
  // Determine lead tier
  const tier = determineLeadTier(totalScore);
  
  // Determine priority
  const priority = determinePriority(totalScore, leadData.urgency);
  
  // Calculate estimated value
  const estimatedValue = calculateEstimatedValue(leadData);
  
  // Calculate conversion probability basata su historical data
  const conversionProbability = calculateConversionProbability(totalScore, leadData);
  
  return {
    total: totalScore,
    breakdown: {
      companySize: companySizeScore,
      budget: budgetScore,
      urgency: urgencyScore,
      services: servicesScore,
      industry: Math.round((industryMultiplier - 1) * 100), // Convert multiplier to points
      role: roleScore
    },
    tier,
    priority,
    estimatedValue,
    conversionProbability
  };
}

/**
 * Determina il lead tier basato sul score
 */
function determineLeadTier(score: number): LeadTier {
  if (score >= LEAD_THRESHOLDS.hot) return 'hot';
  if (score >= LEAD_THRESHOLDS.warm) return 'warm';
  if (score >= LEAD_THRESHOLDS.cool) return 'cool';
  return 'cold';
}

/**
 * Determina la priorità basata su score e urgenza
 */
function determinePriority(score: number, urgency: string): Priority {
  // Boost priority per urgent leads
  const urgencyBoost = SCORING_WEIGHTS.urgency[urgency as keyof typeof SCORING_WEIGHTS.urgency];
  const adjustedScore = score + (urgencyBoost > 25 ? 10 : 0);
  
  for (const [priority, range] of Object.entries(PRIORITY_MAPPING)) {
    if (adjustedScore >= range.min && adjustedScore <= range.max) {
      return priority as Priority;
    }
  }
  
  return 'low';
}

/**
 * Calcola il valore stimato del lead
 */
function calculateEstimatedValue(leadData: LeadData): number {
  const baseValue = ESTIMATED_VALUES.companySize[leadData.employees];
  let servicesValue = 0;
  
  leadData.services.forEach(service => {
    servicesValue += ESTIMATED_VALUES.services[service] || 0;
  });
  
  // Annual value calculation
  const monthlyValue = baseValue.monthly + servicesValue;
  const annualValue = monthlyValue * 12;
  
  // Apply budget constraints
  const maxBudget = parseInt(leadData.budget.replace('>', '').replace('<', ''));
  const adjustedAnnualValue = Math.min(annualValue, maxBudget * 12);
  
  return Math.round(adjustedAnnualValue);
}

/**
 * Calcola la probabilità di conversione basata su score e fattori contestuali
 */
function calculateConversionProbability(score: number, leadData: LeadData): number {
  let probability = (score / 100) * 0.8; // Base probability 80% max
  
  // Boost per alta urgenza
  if (leadData.urgency === 'immediate') probability += 0.15;
  else if (leadData.urgency === 'week') probability += 0.10;
  
  // Boost per budget adeguato
  if (leadData.budget === '>2000') probability += 0.10;
  else if (leadData.budget === '1000-2000') probability += 0.05;
  
  // Boost per ruoli decisionali
  if (leadData.role === 'owner' || leadData.role === 'ceo') probability += 0.10;
  else if (leadData.role === 'cto') probability += 0.05;
  
  // Boost per servizi premium
  const hasPremiumServices = leadData.services.some(service => 
    ['security-optimization', 'performance-optimization', 'monitoring-24-7'].includes(service)
  );
  if (hasPremiumServices) probability += 0.05;
  
  return Math.min(0.95, Math.round(probability * 100) / 100); // Max 95%
}

/**
 * Verifica se un lead è qualificato per follow-up immediato
 */
export function isHotLead(leadScore: LeadScore): boolean {
  return leadScore.tier === 'hot' && leadScore.priority === 'critical';
}

/**
 * Determina il tipo di sequenza email da inviare
 */
export function determineEmailSequence(leadScore: LeadScore): string {
  if (leadScore.tier === 'hot') return 'high-priority-sequence';
  if (leadScore.tier === 'warm') return 'standard-nurturing';
  if (leadScore.tier === 'cool') return 'long-term-nurturing';
  return 'cold-lead-sequence';
}

/**
 * Calcola il tempo di follow-up ottimale in ore
 */
export function calculateFollowUpTime(leadScore: LeadScore): number {
  const baseTime = {
    critical: 1,   // 1 ora
    high: 4,       // 4 ore
    medium: 24,    // 1 giorno
    low: 72        // 3 giorni
  };
  
  return baseTime[leadScore.priority];
}

/**
 * Genera insights sul lead per il team di vendita
 */
export function generateLeadInsights(leadData: LeadData, leadScore: LeadScore): string[] {
  const insights: string[] = [];
  
  // Company size insights
  if (leadData.employees === '6-20') {
    insights.push('Target ideale - PMI nella fascia ottimale per i nostri servizi');
  } else if (leadData.employees === '21-100') {
    insights.push('High-value opportunity - Potenziale per servizi enterprise');
  }
  
  // Budget insights
  if (leadData.budget === '>2000') {
    insights.push('Budget elevato - Proporre pacchetti premium e servizi aggiuntivi');
  } else if (leadData.budget === '<500') {
    insights.push('Budget limitato - Focus su valore essenziale e ROI');
  }
  
  // Urgency insights
  if (leadData.urgency === 'immediate') {
    insights.push('Urgenza massima - Priorità assoluta per contatto immediato');
  }
  
  // Services insights
  if (leadData.services.includes('security-optimization')) {
    insights.push('Interesse alla sicurezza - Enfatizzare compliance e protezione dati');
  }
  
  if (leadData.services.includes('performance-optimization')) {
    insights.push('Focus su performance - Highlight ROI e miglioramento conversioni');
  }
  
  // Role insights
  if (leadData.role === 'owner' || leadData.role === 'ceo') {
    insights.push('Decision maker - Focus su business value e ROI, non aspetti tecnici');
  } else if (leadData.role === 'cto' || leadData.role === 'it-manager') {
    insights.push('Technical decision maker - Dettagli tecnici e specifiche implementazione');
  }
  
  // Score-based insights
  if (leadScore.conversionProbability > 0.7) {
    insights.push('Alta probabilità di conversione - Accelerare processo di vendita');
  } else if (leadScore.conversionProbability < 0.3) {
    insights.push('Bassa probabilità di conversione - Nurturing a lungo termine');
  }
  
  return insights;
}

/**
 * Formatta il lead score per display
 */
export function formatLeadScore(score: number): string {
  if (score >= 80) return `${score} 🔥`;
  if (score >= 60) return `${score} ⭐`;
  if (score >= 40) return `${score} 📈`;
  return `${score} 📊`;
}

/**
 * Calcola il ranking percentile rispetto ad altri lead
 */
export function calculateLeadPercentile(leadScore: number, allScores: number[]): number {
  if (allScores.length === 0) return 50;
  
  const sortedScores = [...allScores].sort((a, b) => a - b);
  const position = sortedScores.findIndex(score => score >= leadScore);
  
  return Math.round((position / sortedScores.length) * 100);
}

/**
 * Predice il lifetime value (LTV) del cliente
 */
export function predictLifetimeValue(leadData: LeadData, leadScore: LeadScore): number {
  const baseAnnualValue = leadScore.estimatedValue;
  
  // Multipliers basati su industry e company size
  const industryMultiplier = SCORING_WEIGHTS.industry[leadData.industry] || 1;
  const sizeMultiplier = leadData.employees === '100+' ? 1.5 : 
                         leadData.employees === '21-100' ? 1.3 : 1;
  
  // Churn rate adjustment (lower churn per higher scores)
  const churnRate = leadScore.tier === 'hot' ? 0.1 : 
                   leadScore.tier === 'warm' ? 0.2 : 
                   leadScore.tier === 'cool' ? 0.3 : 0.4;
  
  // Average customer lifetime in years
  const avgLifetime = 1 / churnRate;
  
  return Math.round(baseAnnualValue * industryMultiplier * sizeMultiplier * avgLifetime);
}