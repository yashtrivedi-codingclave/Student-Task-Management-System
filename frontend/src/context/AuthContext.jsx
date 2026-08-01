import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

// Create the context object.
const AuthContext = createContext();

/**
 * A small custom hook so components can simply call useAuth()
 * instead of importing useContext + AuthContext everywhere.
 */
export const useAuth = () => useContext(AuthContext);

/**
 * AuthProvider wraps the whole app and manages:
 * - the current user
 * - the JWT token
 * - loading state
 * - register / login / logout / fetchProfile functions
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // When the app first loads, read any saved user from localStorage.
  // This keeps the student logged in after a page refresh.
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Helper: save login data to state and localStorage.
  const saveAuth = (data) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  // Register a new student, then log them in automatically.
  const register = async (formData) => {
    const data = await authService.register(formData);
    saveAuth(data);
    return data;
  };

  // Log in an existing student.
  const login = async (formData) => {
    const data = await authService.login(formData);
    saveAuth(data);
    return data;
  };

  // Log out: clear everything and remove saved data.
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Fetch the latest profile from the server (used on the Profile page).
  const fetchProfile = async () => {
    const data = await authService.getProfile();
    return data.data;
  };

  // Simple helper to check if someone is logged in.
  const isAuthenticated = Boolean(token);

  // Everything provided here becomes available through useAuth().
  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    fetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
