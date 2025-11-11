// src/pages/admin/ProjectsPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../states/AuthContext";
import Sidebar from "../../components/sidebar/Sidebar";
import type { Project, Category, Campus } from "../../types/Utils";
import { projectsService, categoriesService, campusService } from "../../services/api";
import Card from "../../components/shared/Card";
import { Icons } from "../../components/shared/Icons";
import ConfirmDeleteModal from "../../components/modals/ConfirmDeleteModal";

function ProjectsPage() {
    const { loading, period } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [projects, setProjects] = useState<Project[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [campuses, setCampuses] = useState<Campus[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

    useEffect(() => {
        if (loading || !period) return;
        
        const fetchProjects = async () => {
            try {
                setIsLoading(true);
                const data = await projectsService.getProjectsByPeriod(period);
                setIsLoading(false);
                setProjects(data);
                const categories = await categoriesService.getAllCategories();
                setCategories(categories);
                const campuses = await campusService.getAllCampuses();
                setCampuses(campuses);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects();
    }, [loading, period]);

    // Filtrar proyectos según el término de búsqueda
    const filteredProjects = projects.filter((project) => {
        const categoryName = categories.find(cat => cat.id === project.id_category)?.name || "";
        projects.sort((a, b) => a.title.localeCompare(b.title));
        return (
            project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.stage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
            categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campuses.find(campus => campus.id === project.id_campus)?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // Funciones para manejar el modal de confirmación de eliminación
    const handleDeleteClick = (project: Project) => {
        setProjectToDelete(project);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!projectToDelete || !projectToDelete.id) return;

        try {
            // Llamar al servicio para eliminar al juez
            await projectsService.deleteProjectById(projectToDelete.id);

            // Actualizar la lista en el estado local
            setProjects((prevProjects) => prevProjects.filter((j) => j.id !== projectToDelete.id));
        } catch (error) {
            console.error("Error deleting project:", error);
        } finally {
            setIsDeleteModalOpen(false);
            setProjectToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setProjectToDelete(null);
    };

    return (
        <div className="flex h-screen">
            <Sidebar activeSection="projects" />
            <div className="flex flex-col mx-auto px-3 mt-8 w-7/8">
                <h1 className="text-4xl mb-8">Proyectos</h1>
                {period ? (
                    <>
                        <div className="flex flex-col md:flex-row space-y-2 justify-between items-center">
                            <div className="w-full max-w-2xs lg:max-w-sm">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Buscar un proyecto..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-6 py-3 pr-12 text-gray-700 bg-gray-200 rounded-full outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                                        aria-label="Buscar"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#565A5C"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" /></svg>
                                    </button>
                                </div>
                            </div>
                            <div className="flex text-sm">
                                <button
                                    className="text-white font-medium bg-[#00723F] p-3 mx-2 rounded-full"
                                    onClick={() => navigate("/projects/add")}
                                >
                                    <svg className="mr-2 inline-block" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                                    Añadir proyecto
                                </button>
                            </div>
                        </div>

                        {isLoading ? (
                            <p className="mt-10 text-gray-500 text-center">Cargando proyectos...</p>
                        ) : projects.length === 0 ? (
                            <p className="mt-10 text-gray-500 text-center">No hay proyectos registrados en este periodo.</p>
                        ) : null}
                        <div className="overflow-y-auto space-y-4 mt-4">
                            {filteredProjects.map((project, index) => (
                                <Card
                                    key={index}
                                    title={project.title}
                                    subtitle={`${project.stage?.toUpperCase()} | ${project.level.toUpperCase()} | ${categories.find(cat => cat.id === project.id_category)?.name.toUpperCase() || "Sin categoría"} | ${campuses.find(campus => campus.id === project.id_campus)?.name.toUpperCase() || "Sin campus"} | ${project.faculty?.toUpperCase() || "Sin facultad"}`}
                                    actions={[
                                        {
                                            label: "Editar",
                                            icon: Icons.Edit,
                                            click: () => navigate(`/projects/${project.id}/edit`),
                                            bgColor: "bg-[#DD971A]"
                                        },
                                        {
                                            label: "Borrar",
                                            icon: Icons.Delete,
                                            click: () => handleDeleteClick(project),
                                            bgColor: "bg-[#DC1818]"
                                        }
                                    ]}
                                    statusEvaluation={project.judges_count !== undefined ? `${project.evaluations_count}/${project.judges_count}` : ""}
                                />
                            ))}
                        </div>
                    </>) : (
                    <p className="mt-10 text-gray-500 text-center">Activa un periodo para gestionar los proyectos.</p>
                )}
                {/* Confirm Delete Modal */}
                <ConfirmDeleteModal
                    isOpen={isDeleteModalOpen}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    message={`¿Quieres eliminar ${projectToDelete?.title || "este proyecto"}?`}
                />
            </div>
        </div>
    );
}

export default ProjectsPage;