/**
 * AI content generation utilities for projects.
 * Calls the operator platform's edge functions to generate
 * AI-powered descriptions, stories, and fallback images.
 */

const OPERATOR_FUNCTIONS_URL = import.meta.env.VITE_OPERATOR_FUNCTIONS_URL || 'https://ivainhvckowigupafbae.supabase.co/functions/v1';
const OPERATOR_ANON_KEY = import.meta.env.VITE_OPERATOR_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2YWluaHZja293aWd1cGFmYmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0MTIxOTAsImV4cCI6MjA3Mzk4ODE5MH0.9KSolbmipVhoANpqxSsSKOn214K-Ir8lLSWOUd6p5xs';

async function callEdgeFunction(functionName: string, body: Record<string, any>) {
  const res = await fetch(`${OPERATOR_FUNCTIONS_URL}/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPERATOR_ANON_KEY}`,
      'apikey': OPERATOR_ANON_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Edge function ${functionName} failed (${res.status}): ${text}`);
  }

  return res.json();
}

export interface StoryResult {
  shortDescription: string;
  story: string;
}

/**
 * Generate a short description and full story for a project using AI.
 */
export async function generateProjectStory(params: {
  description?: string;
  scopeOfWork?: string;
  projectType?: string;
  clientName?: string;
  propertyAddress?: string;
  industry?: string;
}): Promise<StoryResult> {
  const result = await callEdgeFunction('transform-scope-to-story', {
    scopeOfWork: params.scopeOfWork,
    description: params.description,
    projectType: params.projectType,
    clientName: params.clientName,
    propertyAddress: params.propertyAddress,
    industry: params.industry,
  });

  return {
    shortDescription: result.shortDescription || '',
    story: result.story || result.storyDescription || '',
  };
}

/**
 * Generate an AI fallback card image for a project without photos.
 */
export async function generateProjectImage(params: {
  businessName: string;
  industry: string;
  projectName: string;
  projectType?: string;
  projectDescription?: string;
  projectId: string;
}): Promise<string> {
  const result = await callEdgeFunction('generate-project-card-image', params);
  return result.imageUrl || '';
}
