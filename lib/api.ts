import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import axios from 'axios';

const supabase = createClientComponentClient();

export interface BirthDataInput {
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  city: string;
  state: string;
}

export interface PlanetPosition {
  longitude: number;
  gate: number;
  line: number;
  sign: string;
}

export interface ClinicalAnalysisResponse {
  synthesis: string;
  planets: Record<string, PlanetPosition>;
  numerology: {
    life_path_number: number;
    sun_sign: string;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchClinicalAnalysis(data: BirthDataInput): Promise<ClinicalAnalysisResponse> {
  const response = await fetch(`${API_BASE_URL}/v1/analyze/clinical`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to fetch clinical analysis';
    try {
      const error = await response.json();
      errorMessage = error.detail || errorMessage;
    } catch (e) {
      // ignore
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function getSignedUrl(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/get-signed-url`);
  if (!response.ok) {
    throw new Error('Failed to get signed URL');
  }
  return response.json();
}

export const api = axios.create({
  baseURL: 'http://localhost:8000/v1',
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors gracefully
    console.error('[API ERROR]', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export async function getUserCredits(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('profiles')
    .select('credits_balance')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching credits:', error);
    return 0;
  }
  return data?.credits_balance || 0;
}

export async function addCredits(userId: string, amount: number): Promise<void> {
  // Usually called via server-side webhook, but included here for completeness
  const current = await getUserCredits(userId);
  await supabase
    .from('profiles')
    .update({ credits_balance: current + amount })
    .eq('id', userId);
}

export async function decrementCredits(userId: string, amount: number): Promise<boolean> {
  const current = await getUserCredits(userId);
  if (current < amount) return false;

  const { error } = await supabase
    .from('profiles')
    .update({ credits_balance: current - amount })
    .eq('id', userId);

  return !error;
}

// Wrapper for Python Engine Calls
export async function calculateChart(birthData: any) {
  try {
    const response = await axios.post('/api/engine/calculate', birthData);
    return response.data;
  } catch (error) {
    throw new Error('Calculation Engine Offline');
  }
}
