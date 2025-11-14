// types/Auth.ts

// User information
export interface UserData {
    id: number;
    name: string;
    email: string;
    salary: number | null;
    email_verified_at: string | null;
    must_change_password: boolean;
    id_role: number;
    created_at: string;
    updated_at: string;
}

// Authentication context type
export interface AuthContextType {
    user: UserData | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};