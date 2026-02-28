export interface AnalysisResult {
  id: string;
  isCADDetected: boolean;
  confidenceScore: number;
  stDepression: string;
  tWaveInversion: string;
  qrsDuration: string;
  heartRate: number;
  modelVersion: string;
  analysisTime: number;
  analysisDate: string;
}

export interface ECGResultData {
  ecg: {
    id: string;
    fileName: string;
    uploadDate: string;
    status: string;
  };
  result: AnalysisResult;
  patient: {
    name: string;
    email: string;
  };
}
