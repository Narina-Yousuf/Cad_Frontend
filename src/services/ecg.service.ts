import api from "./api";
import type { ECGUpload, ECGSignal, PatientListItem } from "../types/ecg.types";

export const uploadECG = async (
  formData: FormData,
  onProgress: (progress: number) => void,
): Promise<ECGUpload> => {
  const { data } = await api.post("/api/ecg/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / (progressEvent.total || 100),
      );
      onProgress(percentCompleted);
    },
  });
  return data.data.upload;
};

export const getECGSignal = async (id: string): Promise<ECGSignal> => {
  const { data } = await api.get(`/api/ecg/${id}/signal`);
  return data.data;
};

export const getPatients = async (): Promise<PatientListItem[]> => {
  const { data } = await api.get("/api/dashboard/doctor/patients");
  return Array.isArray(data.data) ? data.data : [];
};