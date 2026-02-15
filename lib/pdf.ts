import axios from 'axios';

// Utility to trigger Modal PDF job
export async function triggerModalPDFJob({ userId, result }: { userId: string, result: any }): Promise<string> {
  // Replace with your actual Modal.com endpoint
  const MODAL_API_URL = process.env.NEXT_PUBLIC_MODAL_API_URL || 'https://modal-api.defrag.app/generate-pdf';
  const response = await axios.post(MODAL_API_URL, { userId, result });
  // Expecting { job_id: string }
  return response.data.job_id;
}

// Poll for PDF job status
export async function pollPDFJobStatus(jobId: string): Promise<{ status: string, url?: string }> {
  // Replace with your actual Modal.com status endpoint
  const MODAL_STATUS_URL = process.env.NEXT_PUBLIC_MODAL_STATUS_URL || 'https://modal-api.defrag.app/pdf-status';
  const response = await axios.get(`${MODAL_STATUS_URL}?job_id=${jobId}`);
  // Expecting { status: 'PENDING' | 'COMPLETED' | 'FAILED', url?: string }
  return response.data;
}
