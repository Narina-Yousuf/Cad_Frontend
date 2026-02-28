import api from "./api";
import type { ReportData } from "../types/report.types";

export const generateReport = async (
  analysisId: string,
): Promise<{ id: string }> => {
  const { data } = await api.post(`/api/reports/generate/${analysisId}`);
  return data.data.report;
};

export const getReport = async (reportId: string): Promise<ReportData> => {
  const { data } = await api.get(`/api/reports/${reportId}`);
  return data.data.report;
};
