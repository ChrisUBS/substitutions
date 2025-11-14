// services/api.ts

import axios from "axios";
import type { UserData } from "../types/Auth";
import type { Role } from "../types/Utils";

// Axios instance configuration

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Authentication service
export const authService = {
  loginWithCredentials: async (
    email: string,
    password: string
  ): Promise<any> => {
    try {
      const response = await api.post("/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      // console.error("Error during login:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  },
};

// Role service
export const roleService = {
  getAllRoles: async (): Promise<Role[]> => {
    try {
      const response = await api.get<{ roles: Role[] }>("/roles");
      return response.data.roles;
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  },
};

// User service
export const userService = {
  getUserProfile: async (): Promise<UserData | null> => {
    try {
      const response = await api.get<UserData>("/profile");
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        // no session started, return null
        return null;
      }
      console.error("Error fetching user profile:", error);
      throw error; // other errors are thrown
    }
  },
  getAllUsers: async (): Promise<UserData[]> => {
    try {
      const response = await api.get<{ users: UserData[] }>("/users");
      return response.data.users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },
  deleteUser: async (userId: number): Promise<void> => {
    try {
      await api.delete(`/users/${userId}`);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },
  createUser: async (userData: Partial<UserData>): Promise<UserData> => {
    try {
      const response = await api.post<UserData>("/users", userData);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },
  updateUser: async (
    userId: number,
    userData: Partial<UserData>
  ): Promise<UserData> => {
    try {
      const response = await api.put<UserData>(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },
};