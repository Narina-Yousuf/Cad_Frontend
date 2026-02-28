import { createContext } from "react";
import type { AuthContextType } from "../types/auth.types";

/**
 * We separate the Context instance into its own file.
 * This prevents Vite's "Fast Refresh" from triggering full page reloads
 * because this file contains no React components, only the data structure.
 */
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
