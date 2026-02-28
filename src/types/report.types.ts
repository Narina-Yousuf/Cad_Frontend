export interface PatientInfo {
  name: string;
  email: string;
  age: number | null;
  gender: string | null;
  bloodGroup: string | null;
  patientId: string;
  date: string;
}

export interface ECGParameter {
  finding: string;
  status: "Normal" | "Abnormal";
}

export interface ECGParameters {
  pWave: ECGParameter;
  prInterval: ECGParameter;
  qrsComplex: ECGParameter;
  stSegment: ECGParameter;
  tWave: ECGParameter;
  qtInterval: ECGParameter;
  heartRate: ECGParameter;
}

export interface ReportData {
  id: string;
  generatedDate: string;
  patientInfo: PatientInfo;
  analysisResult: {
    id: string;
    isCADDetected: boolean;
    confidenceScore: number;
    analysisDate: string;
    modelVersion: string;
  };
  ecgFile: {
    fileName: string;
    uploadDate: string;
  };
  ecgParameters: ECGParameters;
  recommendations: string[];
  doctor: {
    name: string;
    specialization: string;
    hospitalName?: string;
  } | null;
}
