export type Role = "DOCTOR" | "PATIENT";
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  doctor?: {
    licenseNumber: string;
    specialization: string;
    hospitalName?: string;
  };
}

// Added this missing interface
export interface SignupData {
  name: string;
  email: string;
  password: string;
  role: Role;
  licenseNumber?: string;
  specialization?: string;
  hospitalName?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>; // Use SignupData here
  logout: () => void;
  loading: boolean;
}
