export type Role = "DOCTOR" | "PATIENT";

export interface DoctorStats {
  totalPatients: number;
  analysesToday: number;
  cadDetectionRate: string;
  avgConfidence: string;
}

export interface RecentPatient {
  ecgId: string;
  patientName: string;
  patientEmail: string;
  date: string;
  status: "CAD Detected" | "Normal";
  risk: "High" | "Medium" | "Low";
  confidence: string;
}

export interface DoctorDashboardData {
  doctor: {
    name: string;
    email: string;
    specialization: string;
    hospitalName?: string;
  };
  stats: DoctorStats;
  recentPatients: RecentPatient[];
}

export interface PatientStats {
  lastTestDate: string | null;
  lastResult: string;
  heartRate: number | null;
  totalTests: number;
}

export interface Alert {
  type: "warning" | "success";
  message: string;
  confidence?: string;
}

export interface RecentActivity {
  id: string;
  ecgId: string;
  fileName: string;
  date: string;
  result: "CAD Detected" | "Normal";
  confidence: string;
  uploadedBy: string;
}

export interface PatientDashboardData {
  patient: {
    name: string;
    email: string;
    dateOfBirth?: string;
    gender?: string;
    bloodGroup?: string;
  };
  stats: PatientStats;
  alert: Alert | null;
  recentActivity: RecentActivity[];
}
