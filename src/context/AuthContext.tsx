import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { AuthContext } from "./AuthContextInstance"; // Import from new file
import type { User } from "../types/auth.types";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") || "null"),
  );
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Removed 'role' parameter as it was unused
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      handleAuthSuccess(data.data.token, data.data.user);
      toast.success("Welcome back!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const signup = async (formData: any) => {
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/signup", formData);
      handleAuthSuccess(data.data.token, data.data.user);
      toast.success("Account created successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
    navigate(
      user.role === "DOCTOR" ? "/doctor/dashboard" : "/patient/dashboard",
    );
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, signup, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
