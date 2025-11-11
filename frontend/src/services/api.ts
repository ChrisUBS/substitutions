// services/api.ts

import axios from "axios";
import type { UserData, RegisterData } from "../types/Auth";
import type { Judge, ProjectJudge, Period, EvaluationForm, JudgeForm, Category, Project, TeamMember, Role, Campus, FilterProjectsForm } from "../types/Utils";

// Configuración de la instancia de Axios

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || "http://127.0.0.1:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Servicio para autenticación
export const authService = {
  loginWithCredentials: async (
    username: string,
    password: string
  ): Promise<any> => {
    try {
      const response = await api.post("/login", {
        username,
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

// Servicio para registro de usuario
export const registerService = {
  register: async (data: RegisterData): Promise<any> => {
    try {
      const response = await api.post("/register", data);
      return response.data;
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  },
};

// Servicio para roles
export const rolesService = {
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

// Servicio para campus
export const campusService = {
  getAllCampuses: async (): Promise<Campus[]> => {
    try {
      const response = await api.get<{ campuses: Campus[] }>("/campuses");
      return response.data.campuses;
    } catch (error) {
      console.error("Error fetching campuses:", error);
      throw error;
    }
  },
};

// Servicio para obtener datos del usuario
export const userService = {
  getUserProfile: async (): Promise<UserData | null> => {
    try {
      const response = await api.get<UserData>("/profile");
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        // No hay sesión iniciada, retornamos null
        return null;
      }
      console.error("Error fetching user profile:", error);
      throw error; // otros errores sí se lanzan
    }
  },
};

// Servicio jueces
export const judgesService = {
  getJudgesByPeriod: async (period: string) => {
    try {
      if (!period) {
        return [];
      }
      const response = await api.get<{ judges: Judge[] }>(`periods/${period}/judges`);
      return response.data.judges;
    } catch (error) {
      console.error("Error fetching judges:", error);
      throw error;
    }
  },

  getJudgeById: async (judgeId: number) => {
    try {
      const response = await api.get<{ user: Judge }>(`/judges/${judgeId}`);
      return response.data.user;
    } catch (error) {
      console.error("Error fetching judge by ID:", error);
      throw error;
    }
  },

  getProjectsByJudge: async (judgeId: number) => {
    try {
      const response = await api.get<{ projects: ProjectJudge[] }>(`/judges/${judgeId}/projects`);
      return response.data.projects;
    } catch (error) {
      console.error("Error fetching projects for judge:", error);
      throw error;
    }
  },

  deleteJudgeById: async (judgeId: number) => {
    try {
      const response = await api.delete(`/judges/${judgeId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting judge:", error);
      throw error;
    }
  },

  createJudge: async (data: JudgeForm) => {
    try {
      const response = await api.post("/judges", data);
      return response.data.user;
    } catch (error) {
      console.error("Error creating judge:", error);
      throw error;
    }
  },

  editJudgeById: async (judgeId: number, data: JudgeForm) => {
    try {
      const response = await api.put(`/judges/${judgeId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error editing judge:", error);
      throw error;
    }
  },

  assignProjectsToJudge: async (judgeId: number, projectIds: number[]): Promise<EvaluationForm> => {
    try {
      const response = await api.post(`/judges/${judgeId}/projects`, { projects: projectIds });
      return response.data;
    } catch (error) {
      console.error("Error assigning projects to judge:", error);
      throw error;
    }
  },

  removeProjectsFromJudge: async (judgeId: number, projectsIds: number[]): Promise<EvaluationForm> => {
    try {
      const response = await api.put(`/judges/${judgeId}/projects`, { projects: projectsIds});
      return response.data;
    } catch (error) {
      console.error("Error removing projects from judge:", error)
      throw error;
    }
  },

  exportJudgeByPeriod: async (periodId: string) =>{
    try {
      const response = await api.get(`/judges/${periodId}/exportJudges`,{
        responseType: 'blob', //La respuesta será un archivo binario
      });
      
      //Se genera una URL temporal que apunta a un objeto Blob creado apartir de los datos binarios
      const url = window.URL.createObjectURL(new Blob([response.data]))

      const now = new Date();
      const formatted = now.toISOString().replace('T', '_').replace('Z', '').replace(/[:.]/g, '-');

      //Creamos un elemento en el DOM para descargar el archivo
      const link = document.createElement('a');
      link.href=url;
      link.setAttribute('download',`judges_${formatted}.xlsx`);
      document.body.appendChild(link);

      //Se activa el click del componente para descargar el archivo, y luego se elimina enlace del DOM
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error assigning projects to judge:", error);
      throw error;
    }
  }
};

// Servicio para obtener los periodos
export const periodsService = {
  getActivePeriod: async (): Promise<string | null> => {
    try {
      const response = await api.get<{ periods: Period[] }>("/periods");
      const activePeriod = response.data.periods.find((period) => period.is_active);
      return activePeriod ? activePeriod.id : null;
    } catch (error) {
      // console.error("Error fetching periods:", error);
      throw error;
    }
  },

  getAllPeriods: async (): Promise<Period[]> => {
    try {
      const response = await api.get<{ periods: Period[] }>("/periods");
      return response.data.periods;
    } catch (error) {
      console.error("Error fetching all periods:", error);
      throw error;
    }
  },

  createPeriod: async (data: { id: string }): Promise<Period> => {
    try {
      const response = await api.post("/periods", data);
      return response.data.period;
    } catch (error) {
      console.error("Error creating period:", error);
      throw error;
    }
  },

  togglePeriodStatus: async (periodId: string): Promise<void> => {
    try {
      await api.post(`/periods/${periodId}/toggle`);
    } catch (error) {
      console.error("Error changing period status:", error);
      throw error;
    }
  },

  deletePeriodById: async (periodId: string): Promise<void> => {
    try {
      await api.delete(`/periods/${periodId}`);
    } catch (error) {
      console.error("Error deleting period:", error);
      throw error;
    }
  }
};

// Servicio Evaluaciones
export const evaluationsService = {
  saveEvaluationForm: async (data: EvaluationForm): Promise<any> => {
    try {
      const response = await api.post("/evaluations", data);
      return response.data;
    } catch (error) {
      console.error("Error saving evaluation form:", error);
      throw error;
    }
  },

  getEvaluationsByProject: async (projectId: number): Promise<EvaluationForm[]> => {
    try {
      const response = await api.get<{ evaluations: EvaluationForm[] }>(`/projects/${projectId}/evaluations`);
      return response.data.evaluations;
    } catch (error) {
      console.error("Error fetching evaluation form:", error);
      throw error;
    }
  },

  getEvaluationById: async (evaluationId: number): Promise<EvaluationForm> => {
    try {
      const response = await api.get<{ evaluation: EvaluationForm }>(`/evaluations/${evaluationId}`);
      return response.data.evaluation;
    } catch (error) {
      console.error("Error fetching evaluation by ID:", error);
      throw error;
    }
  },
}

// Servicio Categorías
export const categoriesService = {
  getAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await api.get<{ categories: Category[] }>("/categories");
      return response.data.categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }
}

// Servicio Proyectos
export const projectsService = {
  getProjectsByPeriod: async (periodId: string): Promise<Project[]> => {
    try {
      const response = await api.get<{ projects: Project[] }>(`/periods/${periodId}/projects`);
      return response.data.projects;
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  },

  getProjectById: async (projectId: number): Promise<Project> => {
    try {
      const response = await api.get<{ project: Project }>(`/projects/${projectId}`);
      return response.data.project;
    } catch (error) {
      console.error("Error fetching project:", error);
      throw error;
    }
  },

  getFilteredProjects: async (periodId: string, filters: FilterProjectsForm): Promise<Project[]> => {
    try {
      const response = await api.get<{ projects: Project[] }>(`/periods/${periodId}/projects/filter`, { params: filters });
      return response.data.projects;
    } catch (error) {
      console.error("Error fetching projects by filters:", error);
      throw error;
    }
  },

  getExistStateByProjectId: async (projectId: number): Promise<number | null> => {
    try {
      const response = await api.get(`/projects/${projectId}/getState`);
      return response.data.project.existState;
    } catch (error) {
      console.error("Error fetching projects by level and category:", error);
      throw error;
    }
  },

  deleteProjectById: async (projectId: number): Promise<void> => {
    try {
      await api.delete(`/projects/${projectId}`);
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  },

  createProject: async (data: Project): Promise<Project> => {
    try {
      const response = await api.post("/projects", data);
      return response.data.project;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  },

  updateProjectById: async (projectId: number, data: Project): Promise<Project> => {
    try {
      const response = await api.put(`/projects/${projectId}`, data);
      return response.data.project;
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  },

  exportProjects: async (periodId: string, filters:FilterProjectsForm) =>{
    const body = {
        periodId: periodId,
        stage: filters.stage,
        level: filters.level,
        categoryId: filters.categoryId,
        campusId: filters.campus,
    };
    console.log(body);
    try {
      const response = await api.post("/projects/exportProjects",
      body,
      {
        headers:{'Content-Type':'application/json'},
        responseType: 'blob', //La respuesta será un archivo binario
      });
      
      //Se genera una URL temporal que apunta a un objeto Blob creado apartir de los datos binarios
      const url = window.URL.createObjectURL(new Blob([response.data]))

      const now = new Date();
      const formatted = now.toISOString().replace('T', '_').replace('Z', '').replace(/[:.]/g, '-');

      //Creamos un elemento en el DOM para descargar el archivo
      const link = document.createElement('a');
      link.href=url;
      link.setAttribute('download',`projects_${formatted}.xlsx`);
      document.body.appendChild(link);

      //Se activa el click del componente para descargar el archivo, y luego se elimina enlace del DOM
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting projects:", error);
      throw error;
    }
  },
}

// Servicio miembros de equipo
export const teamMembersService = {
  getTeamMembersByProjectId: async (projectId: number): Promise<TeamMember[]> => {
    try {
      const response = await api.get<{ members: TeamMember[] }>(`/projects/${projectId}/members`);
      return response.data.members;
    } catch (error) {
      console.error("Error fetching team members:", error);
      throw error;
    }
  },

  addTeamMember: async (data: TeamMember): Promise<any> => {
    try {
      const response = await api.post("/members", data);
      return response.data;
    } catch (error) {
      console.error("Error adding team member:", error);
      throw error;
    }
  },

  removeTeamMemberById: async (memberId: number): Promise<void> => {
    try {
      await api.delete(`/members/${memberId}`);
    } catch (error) {
      console.error("Error removing team member:", error);
      throw error;
    }
  },
}