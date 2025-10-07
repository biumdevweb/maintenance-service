// Tipi per il sistema di lead scoring basato su research B2B italiana
export interface LeadData {
  // Informazioni base
  name: string;
  email: string;
  phone: string;
  company: string;
  website?: string;
  
  // Qualificazione B2B
  employees: CompanySize;
  industry: Industry;
  role: CompanyRole;
  budget: BudgetRange;
  urgency: UrgencyLevel;
  
  // Servizi richiesti
  services: ServiceType[];
  
  // Metadata
  source: LeadSource;
  timestamp: string;
  gdprConsent: boolean;
  newsletterConsent: boolean;
}

// Company size basato su segmentazione PMI italiana
export type CompanySize = '1-5' | '6-20' | '21-100' | '100+';

// Industry sectors per mercato italiano
export type Industry = 
  | 'retail'
  | 'manufacturing' 
  | 'services'
  | 'technology'
  | 'healthcare'
  | 'education'
  | 'hospitality'
  | 'construction'
  | 'finance'
  | 'other';

// Ruoli decisionali B2B
export type CompanyRole = 
  | 'owner'
  | 'ceo'
  | 'cto'
  | 'marketing-manager'
  | 'it-manager'
  | 'operations-manager'
  | 'other';

// Budget ranges ottimizzati per PMI italiane
export type BudgetRange = '<500' | '500-1000' | '1000-2000' | '>2000';

// Livelli di urgenza per lead scoring
export type UrgencyLevel = 'immediate' | 'week' | 'month' | 'quarter';

// Servizi offerti
export type ServiceType = 
  | 'wordpress-maintenance'
  | 'monitoring-24-7'
  | 'backup-automatic'
  | 'security-optimization'
  | 'performance-optimization'
  | 'seo-optimization'
  | 'content-updates'
  | 'technical-support';

// Fonti di lead generation
export type LeadSource = 
  | 'landing-page'
  | 'google-ads'
  | 'social-media'
  | 'referral'
  | 'email-marketing'
  | 'organic'
  | 'direct';

// Lead score con metriche dettagliate
export interface LeadScore {
  total: number;
  breakdown: {
    companySize: number;
    budget: number;
    urgency: number;
    services: number;
    industry: number;
    role: number;
  };
  tier: LeadTier;
  priority: Priority;
  estimatedValue: number;
  conversionProbability: number;
}

// Segmentazione lead in tier
export type LeadTier = 'hot' | 'warm' | 'cool' | 'cold';

// Livelli di priorità
export type Priority = 'critical' | 'high' | 'medium' | 'low';

// Pricing tiers basati su psychology research
export interface PricingTier {
  id: string;
  name: string;
  price: number;
  annualPrice?: number;
  annualDiscount?: number;
  description: string;
  features: PricingFeature[];
  popular?: boolean;
  targetCompanySize: CompanySize[];
  ctaText: string;
  ctaUrgency?: string;
  guarantee?: string;
}

export interface PricingFeature {
  id: string;
  name: string;
  description?: string;
  included: boolean;
  highlight?: boolean;
  tooltip?: string;
}

// Calculator per pricing personalizzato
export interface PricingCalculator {
  basePrice: number;
  companySizeMultiplier: number;
  selectedServices: ServicePrice[];
  additionalFeatures: AdditionalFeature[];
  totalPrice: number;
  setupFee?: number;
  annualDiscount?: number;
}

export interface ServicePrice {
  service: ServiceType;
  price: number;
  recurring: boolean;
}

export interface AdditionalFeature {
  id: string;
  name: string;
  price: number;
  recurring: boolean;
  description: string;
  category: 'security' | 'performance' | 'support' | 'marketing';
}

// Testimonianze e social proof
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  companySize: CompanySize;
  industry: Industry;
  avatar: string;
  rating: number;
  quote: string;
  results: TestimonialResult[];
  date: string;
  verified: boolean;
  videoUrl?: string;
  caseStudyUrl?: string;
}

export interface TestimonialResult {
  metric: string;
  before: string | number;
  after: string | number;
  improvement: string;
  timeframe: string;
}

// Case studies dettagliati
export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  client: {
    name: string;
    industry: Industry;
    companySize: CompanySize;
    website: string;
    logo: string;
  };
  challenge: {
    problem: string;
    impact: string;
    urgency: string;
  };
  solution: {
    approach: string;
    services: ServiceType[];
    timeline: string;
    implementation: string[];
  };
  results: {
    metrics: CaseStudyMetric[];
    roi: string;
    testimonial?: string;
  };
  timeline: {
    start: string;
    end: string;
    duration: string;
  };
  tags: string[];
  featured: boolean;
}

export interface CaseStudyMetric {
  name: string;
  before: number;
  after: number;
  improvement: number;
  unit: string;
  category: 'performance' | 'security' | 'conversion' | 'revenue';
}

// Statistics per credibility building
export interface IndustryStats {
  metric: string;
  value: string | number;
  source: string;
  date: string;
  relevance: 'high' | 'medium' | 'low';
  industry?: Industry;
}

// FAQ e supporto
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
  priority: number;
  relatedServices?: ServiceType[];
  relatedFAQs?: string[];
}

export type FAQCategory = 
  | 'general'
  | 'pricing'
  | 'technical'
  | 'security'
  | 'support'
  | 'billing';

// Analytics e tracking
export interface AnalyticsEvent {
  name: string;
  properties: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId: string;
  page: string;
  referrer?: string;
}

export interface ConversionEvent extends AnalyticsEvent {
  type: 'lead' | 'demo' | 'trial' | 'purchase';
  value?: number;
  currency?: string;
  leadData?: Partial<LeadData>;
}

// GDPR e compliance
export interface GDPRConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  timestamp: string;
  version: string;
  ipAddress: string;
  userAgent: string;
}

// Email marketing automation
export interface EmailSequence {
  id: string;
  name: string;
  trigger: EmailTrigger;
  emails: EmailTemplate[];
  delay: EmailDelay[];
  conditions: EmailCondition[];
}

export interface EmailTrigger {
  type: 'lead-score' | 'behavior' | 'time' | 'manual';
  value: string | number;
}

export interface EmailTemplate {
  id: string;
  subject: string;
  previewText: string;
  content: string;
  template: string;
  variables: EmailVariable[];
}

export interface EmailVariable {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean';
  required: boolean;
  default?: string | number | boolean;
}

export interface EmailDelay {
  type: 'immediate' | 'hours' | 'days' | 'weeks';
  value: number;
  condition?: string;
}

export interface EmailCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater-than' | 'less-than';
  value: string | number;
}

// A/B testing framework
export interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate?: string;
  endDate?: string;
  variants: ABVariant[];
  trafficSplit: number[];
  targetAudience?: ABTargetAudience;
  goals: ABGoal[];
  results?: ABTestResults;
}

export interface ABVariant {
  id: string;
  name: string;
  type: 'headline' | 'cta' | 'layout' | 'pricing' | 'color';
  changes: ABChange[];
  control: boolean;
}

export interface ABChange {
  element: string;
  property: string;
  value: string;
}

export interface ABTargetAudience {
  criteria: ABCriteria[];
}

export interface ABCriteria {
  field: string;
  operator: string;
  value: string | number;
}

export interface ABGoal {
  type: 'conversion' | 'click' | 'scroll' | 'form-submit';
  element?: string;
  value?: string;
}

export interface ABTestResults {
  visitors: number;
  conversions: number;
  conversionRate: number;
  confidence: number;
  winner?: string;
  significance: number;
  revenue?: number;
}

// Utility types per il sistema
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Error handling
export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  requestId?: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: APIError;
  meta?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

// Configuration types
export interface SiteConfig {
  site: {
    name: string;
    description: string;
    url: string;
    logo: string;
    contact: {
      email: string;
      phone: string;
      address: string;
    };
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
  features: {
    analytics: boolean;
    gdpr: boolean;
    chat: boolean;
    newsletter: boolean;
  };
  pricing: {
    currency: string;
    taxRate: number;
    billingCycle: 'monthly' | 'annual';
  };
}