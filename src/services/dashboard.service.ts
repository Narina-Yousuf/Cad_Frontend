import api from "./api";
import type {
  DoctorDashboardData,
  PatientDashboardData,
} from "../types/dashboard.types";

export const getDoctorDashboard = async (): Promise<DoctorDashboardData> => {
  const { data } = await api.get("/api/dashboard/doctor");
  return data.data;
};

export const getPatientDashboard = async (): Promise<PatientDashboardData> => {
  const { data } = await api.get("/api/dashboard/patient");
  return data.data;
};
