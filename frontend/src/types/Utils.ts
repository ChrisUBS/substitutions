// types/Utils.ts

// Propiedades del componente Card
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

// Formulario para obtener proyectos filtrados
export interface FilterProjectsForm {
    stage: "local" | "estatal" | string;
    level: "licenciatura" | "posgrado" | string;
    campus?: number;
    categoryId?: number;
}

// Evaluation Status for Judge
export interface EvaluationStatus {
    total_projects: number;
    evaluated_projects: number;
}

// Información de los roles
export interface Role {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

// Información de los campus
export interface Campus {
    id: number;
    name: string;
    event_date: string;
    created_at: string;
    updated_at: string;
}

// Información de los periodos
export interface Period {
    id: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Información de las categorías
export interface Category {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

// Información de los projectos
export interface Project {
    id?: number;
    title: string;
    stage?: string;
    level: string;
    faculty?: string;
    id_campus: number;
    id_category: number;
    id_period?: string;
    final_score?: number | null;
    created_at?: string;
    updated_at?: string;
    evaluations_count?: number;
    judges_count?: number;
    wrong_category?: boolean;
    existState?: number | null;
}

// Información projecto-juez
export interface ProjectJudge {
    id: number;
    id_project: number;
    id_judge: number;
    is_active: boolean;
    id_evaluation: number | null;
    created_at: string;
    updated_at: string;
    project: Project;
}

// Información del formulario de evaluación
export interface EvaluationForm {
    id?: number;
    id_project: number;
    id_judge: number;
    judge_name?: string;
    judge_email?: string;
    question_1?: number;
    question_2?: number;
    question_3?: number;
    question_4?: number;
    question_5?: number;
    question_6?: number;
    question_7?: number;
    question_8?: number;
    question_9?: number;
    question_10?: number;
    question_11?: boolean;
    id_category?: number | null;
    feedback?: string;
    total_score?: number;
    created_at?: string;
    updated_at?: string;
}

// Información miembro del proyecto
export interface TeamMember {
    id?: number;
    name: string;
    email: string;
    id_role?: number;
    id_project?: number;
    created_at?: string;
    updated_at?: string;
}