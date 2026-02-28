import api from "./api";
import type { ECGResultData } from "../types/analysis.types";

export const runAnalysis = async (id: string): Promise<void> => {
  await api.post(`/api/ecg/${id}/analyze`);
};

export const getAnalysisResult = async (id: string): Promise<ECGResultData> => {
  const { data } = await api.get(`/api/ecg/${id}/result`);
  return data.data;
};
