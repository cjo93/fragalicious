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
