// types/Utils.ts

// Card component props 
// TODO: Change the types according to actual use cases
export interface Judge {
    id: number;
    name: string;
    username: string;
    password_plain: string;
    id_role: number;
    id_period: string;
    created_at: string;
    updated_at: string;
    total_projects?: number;
    evaluated_projects?: number;
}

export interface JudgeForm {
    name: string | null;
    username: string | null;
    id_period: string | null;
}

// User form data
export interface UserForm {
    name: string;
    email: string;
    salary?: number;
    id_role: number;
}

// Role information
export interface Role {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}