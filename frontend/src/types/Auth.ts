// types/Auth.ts

// Información del usuario
export interface UserData {
    id: number;
    name: string;
    username: string;
    password_plain: string | null;
    id_role: number;
    id_period: string | null;
    created_at: string;
    updated_at: string;
}

// Información del usuario para el registro
export interface RegisterData {
	name: string;
    username: string;
	password: string;
	password_confirmation: string;
}

// Información del contexto de autenticación
export interface AuthContextType {
    user: UserData | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
	register: (data: RegisterData) => Promise<void>;
    period?: string | null;
};