/**
 * Analysis API Service
 */
import { apiGet, apiPost, apiPut, apiPatch, apiDelete, type ApiResponse } from './api';
import type { AnalysisRecord, DiagnosisFeedback, FinalReport, ChatMessage } from '../types';
import { normalizeConsensusDiagnosis } from '../types';

export interface ApiAnalysisRecord {
  id: number;
  patient: number;
  patient_id: string;
  patient_data: Record<string, unknown>;
  debate_history: ChatMessage[];
  final_report: FinalReport;
  follow_up_history: Array<{ question: string; answer: string }>;
  selected_specialists: string[];
  detected_medications: Array<{ name: string; dosage: string }>;
  diagnosis_feedbacks?: DiagnosisFeedback[];
  created_by?: unknown;
  created_at: string;
  updated_at: string;
}

export interface AnalysisListParams {
  page?: number;
  page_size?: number;
  search?: string;
  patient?: number;
  ordering?: string;
}

/**
 * Convert API AnalysisRecord to frontend AnalysisRecord
 */
const apiToAnalysisRecord = (api: ApiAnalysisRecord): AnalysisRecord => {
  const fr = api.final_report || {};
  return {
    id: api.id.toString(),
    patientId: api.patient_id,
    date: api.created_at,
    patientData: api.patient_data as unknown as AnalysisRecord['patientData'],
    debateHistory: api.debate_history || [],
    finalReport: {
      ...fr,
      consensusDiagnosis: normalizeConsensusDiagnosis(fr.consensusDiagnosis),
      rejectedHypotheses: Array.isArray(fr.rejectedHypotheses) ? fr.rejectedHypotheses : [],
      treatmentPlan: Array.isArray(fr.treatmentPlan) ? fr.treatmentPlan : [],
      medicationRecommendations: Array.isArray(fr.medicationRecommendations) ? fr.medicationRecommendations : [],
      recommendedTests: Array.isArray(fr.recommendedTests) ? fr.recommendedTests : [],
    } as FinalReport,
    followUpHistory: api.follow_up_history,
    detectedMedications: api.detected_medications,
    selectedSpecialists: api.selected_specialists as AnalysisRecord['selectedSpecialists'],
  };
};

/**
 * Convert frontend AnalysisRecord to API format
 */
const safeArr = <T>(v: unknown): T[] => (Array.isArray(v) ? v as T[] : []);

const analysisRecordToApi = (record: Partial<AnalysisRecord>): Partial<ApiAnalysisRecord> & { external_patient_id?: string } => {
  const fr = record.finalReport || {} as FinalReport;
  const pd = record.patientData || {};
  // Strip large binary fields (attachments) from patient_data before sending to backend
  const { attachments: _att, ...patientDataClean } = pd as Record<string, unknown> & { attachments?: unknown };
  // Limit debate_history to last 50 messages to avoid request size limits
  const dh = safeArr(record.debateHistory).slice(-50);
  return {
    patient_id: record.patientId || '',
    external_patient_id: record.patientId || '',
    patient_data: patientDataClean as Record<string, unknown>,
    debate_history: dh,
    final_report: {
      ...fr,
      treatmentPlan: safeArr(fr.treatmentPlan).map(s => typeof s === 'string' ? s : JSON.stringify(s)),
      medicationRecommendations: safeArr(fr.medicationRecommendations),
      recommendedTests: safeArr(fr.recommendedTests),
      rejectedHypotheses: safeArr(fr.rejectedHypotheses),
      consensusDiagnosis: safeArr(fr.consensusDiagnosis),
    } as FinalReport,
    follow_up_history: safeArr(record.followUpHistory),
    selected_specialists: safeArr(record.selectedSpecialists).map(s => String(s)),
    detected_medications: safeArr(record.detectedMedications),
  };
};

/**
 * Get analyses list
 */
export const getAnalyses = async (params?: AnalysisListParams): Promise<ApiResponse<AnalysisRecord[]>> => {
  const queryParams: Record<string, string> = {};
  
  if (params?.page) queryParams.page = params.page.toString();
  if (params?.page_size) queryParams.page_size = params.page_size.toString();
  if (params?.search) queryParams.search = params.search;
  if (params?.patient) queryParams.patient = params.patient.toString();
  if (params?.ordering) queryParams.ordering = params.ordering;
  
  const response = await apiGet<ApiAnalysisRecord[]>('/analyses/', queryParams);
  
  if (response.success && response.data) {
    return {
      ...response,
      data: response.data.map(apiToAnalysisRecord),
    };
  }
  
  return response as unknown as ApiResponse<AnalysisRecord[]>;
};

/**
 * Get analysis by ID
 */
export const getAnalysis = async (id: number): Promise<ApiResponse<AnalysisRecord>> => {
  const response = await apiGet<ApiAnalysisRecord>(`/analyses/${id}/`);
  
  if (response.success && response.data) {
    return {
      ...response,
      data: apiToAnalysisRecord(response.data),
    };
  }
  
  return response as unknown as ApiResponse<AnalysisRecord>;
};

/**
 * Create analysis record
 */
export const createAnalysis = async (
  patientId: number,
  record: Partial<AnalysisRecord>
): Promise<ApiResponse<AnalysisRecord>> => {
  const apiData = {
    ...analysisRecordToApi(record),
    patient: patientId,
  };
  
  const response = await apiPost<ApiAnalysisRecord>('/analyses/', apiData);
  
  if (response.success && response.data) {
    return {
      ...response,
      data: apiToAnalysisRecord(response.data),
    };
  }
  
  return response as unknown as ApiResponse<AnalysisRecord>;
};

/**
 * Update analysis record
 */
export const updateAnalysis = async (
  id: number,
  record: Partial<AnalysisRecord>
): Promise<ApiResponse<AnalysisRecord>> => {
  const apiData = analysisRecordToApi(record);
  
  const response = await apiPatch<ApiAnalysisRecord>(`/analyses/${id}/`, apiData);
  
  if (response.success && response.data) {
    return {
      ...response,
      data: apiToAnalysisRecord(response.data),
    };
  }
  
  return response as unknown as ApiResponse<AnalysisRecord>;
};

/**
 * Delete analysis record
 */
export const deleteAnalysis = async (id: number): Promise<ApiResponse<void>> => {
  return apiDelete<void>(`/analyses/${id}/`);
};

/**
 * Add diagnosis feedback
 */
export const addDiagnosisFeedback = async (
  analysisId: number,
  diagnosisName: string,
  feedback: DiagnosisFeedback
): Promise<ApiResponse<unknown>> => {
  return apiPost(`/analyses/${analysisId}/add-feedback/`, {
    diagnosis_name: diagnosisName,
    feedback: feedback,
  });
};

/**
 * Get analysis statistics
 */
export const getAnalysisStats = async (): Promise<ApiResponse<{
  total_analyses: number;
  common_diagnoses: Array<{ name: string; count: number }>;
  feedback_accuracy: number;
}>> => {
  return apiGet('/analyses/stats/');
};