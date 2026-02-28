export interface HistoryRecord {
  ecgId: string;
  analysisId: string;
  date: string;
  patientName: string;
  patientId: string;
  patientEmail: string;
  result: "CAD Detected" | "Normal";
  confidence: string;
  fileName: string;
}

export interface HistoryData {
  total: number;
  limit: number;
  offset: number;
  count: number;
  history: HistoryRecord[];
}

export interface PatientHistoryData {
  patient: {
    id: string;
    name: string;
    email: string;
  };
  summary: {
    totalTests: number;
    cadDetected: number;
    normal: number;
    avgConfidence: string;
  };
  history: Array<{
    id: string;
    ecgId: string;
    fileName: string;
    uploadDate: string;
    analysisDate: string;
    result: "CAD Detected" | "Normal";
    confidence: string;
    heartRate: number | null;
    uploadedBy: string;
  }>;
}

export interface HistoryFilters {
  patientName: string;
  result: "all" | "cad" | "normal";
  sortBy: "date" | "confidence";
  sortOrder: "asc" | "desc";
}
