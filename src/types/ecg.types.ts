export interface ECGUpload {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  uploadDate: string;
  patient?: {
    name: string;
    email: string;
  };
}

export interface ECGSignal {
  id: string;
  fileName: string;
  samplingRate: number;
  duration: number;
  status: string;
  uploadDate: string;
  patient: {
    name: string;
    email: string;
  };
}

export interface UploadFormData {
  ecgFile: File;
  patientId?: string;
  notes?: string;
}

export interface PatientListItem {
  id: string;
  name: string;
  email: string;
}
