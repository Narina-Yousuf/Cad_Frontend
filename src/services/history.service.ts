import api from "./api";
import type {
  HistoryData,
  PatientHistoryData,
  HistoryFilters,
} from "../types/history.types";

export const getHistory = async (
  filters: HistoryFilters & { limit: number; offset: number },
): Promise<HistoryData> => {
  const params = new URLSearchParams({
    patientName: filters.patientName,
    result: filters.result,
    limit: filters.limit.toString(),
    offset: filters.offset.toString(),
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  });
  const { data } = await api.get(`/api/history?${params.toString()}`);
  return data.data;
};

export const getPatientHistory = async (
  patientId: string,
): Promise<PatientHistoryData> => {
  const { data } = await api.get(`/api/history/patient/${patientId}`);
  return data.data;
};
