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

interface LeadData {
  name: string;
  email: string;
  phone: string;
  company: string;
  website?: string;
  employees: string;
  industry: string;
  role: string;
  budget: string;
  urgency: string;
  services: string[];
  source: string;
  timestamp: string;
  gdprConsent: boolean;
  newsletterConsent: boolean;
}

interface LeadScore {
  total: number;
  breakdown: {
    companySize: number;
    budget: number;
    urgency: number;
    services: number;
    industry: number;
    role: number;
  };
  tier: string;
  priority: string;
  estimatedValue: number;
  conversionProbability: number;
}

// Lead scoring implementation
function calculateLeadScore(leadData: LeadData): LeadScore {
  // Simplified implementation for API
  const companySizeScore = {
    '1-5': 20,
    '6-20': 40,
    '21-100': 70,
    '100+': 90
  }[leadData.employees] || 20;
  
  const budgetScore = {
    '<500': 10,
    '500-1000': 30,
    '1000-2000': 60,
    '>2000': 90
  }[leadData.budget] || 10;
  
  const urgencyScore = {
    'immediate': 40,
    'week': 25,
    'month': 15,
    'quarter': 10
  }[leadData.urgency] || 10;
  
  const servicesScore = leadData.services.length * 10;
  
  const roleScore = {
    'owner': 20,
    'ceo': 18,
    'cto': 15,
    'marketing-manager': 12,
    'it-manager': 10,
    'operations-manager': 8,
    'other': 5
  }[leadData.role] || 5;
  
  const totalScore = Math.min(100, companySizeScore + budgetScore + urgencyScore + servicesScore + roleScore);
  
  const tier = totalScore >= 80 ? 'hot' : totalScore >= 60 ? 'warm' : totalScore >= 40 ? 'cool' : 'cold';
  const priority = totalScore >= 85 ? 'critical' : totalScore >= 70 ? 'high' : totalScore >= 50 ? 'medium' : 'low';
  
  return {
    total: totalScore,
    breakdown: {
      companySize: companySizeScore,
      budget: budgetScore,
      urgency: urgencyScore,
      services: servicesScore,
      industry: 0,
      role: roleScore
    },
    tier,
    priority,
    estimatedValue: Math.round(budgetScore * 12),
    conversionProbability: Math.min(0.95, totalScore / 100)
  };
}

function generateLeadInsights(leadData: LeadData, leadScore: LeadScore): string[] {
  const insights: string[] = [];
  
  if (leadData.employees === '6-20') {
    insights.push('Target ideale - PMI nella fascia ottimale per i nostri servizi');
  }
  
  if (leadData.budget === '>2000') {
    insights.push('Budget elevato - Proporre pacchetti premium e servizi aggiuntivi');
  }
  
  if (leadData.urgency === 'immediate') {
    insights.push('Urgenza massima - Priorità assoluta per contatto immediato');
  }
  
  if (leadScore.tier === 'hot') {
    insights.push('Alta probabilità di conversione - Accelerare processo di vendita');
  }
  
  return insights;
}

// Edge Function per il calcolo del lead score
export async function POST({ request }: { request: Request }) {
  try {
    // Parse request body
    const leadData: LeadData = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'company', 'employees', 'industry', 'role', 'budget', 'urgency'];
    const missingFields = requiredFields.filter(field => !leadData[field as keyof LeadData]);
    
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
    
    // Calculate lead score
    const leadScore = calculateLeadScore(leadData);
    
    // Generate insights
    const insights = generateLeadInsights(leadData, leadScore);
    
    // Return response
    return new Response(JSON.stringify({
      success: true,
      data: {
        leadScore,
        insights,
        recommendations: {
          followUpTime: calculateFollowUpTime(leadScore),
          emailSequence: determineEmailSequence(leadScore),
          priority: leadScore.priority,
          tier: leadScore.tier
        }
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
    console.error('Lead scoring error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore durante il calcolo del lead score',
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
function calculateFollowUpTime(leadScore: LeadScore): number {
  const baseTime: Record<string, number> = {
    critical: 1,   // 1 ora
    high: 4,       // 4 ore
    medium: 24,    // 1 giorno
    low: 72        // 3 giorni
  };
  
  return baseTime[leadScore.priority] || 24;
}

function determineEmailSequence(leadScore: LeadScore): string {
  if (leadScore.tier === 'hot') return 'high-priority-sequence';
  if (leadScore.tier === 'warm') return 'standard-nurturing';
  if (leadScore.tier === 'cool') return 'long-term-nurturing';
  return 'cold-lead-sequence';
}