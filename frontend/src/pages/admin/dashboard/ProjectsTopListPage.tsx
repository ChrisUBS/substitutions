import { useEffect, useState } from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../states/AuthContext";
import type { Project, Category, Campus, FilterProjectsForm } from "../../../types/Utils";
import { projectsService, categoriesService, campusService } from "../../../services/api";
import Card from "../../../components/shared/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Icons } from "../../../components/shared/Icons";

function ProjectsTopListPage() {
    const { stage, level, category, campus } = useParams();
    const { period } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const name = (category && category !== "all") ? (category.charAt(0).toUpperCase() + category.slice(1)) : (level!.charAt(0).toUpperCase() + level!.slice(1));
    const [projects, setProjects] = useState<Project[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [campuses, setCampuses] = useState<Campus[]>([]);
    const [loadingExport, setLoadingExport] = useState(false);

    useEffect(() => {
        // Validar parámetros obligatorios
        if (!stage || !level || !period) return;

        const run = async () => {
            try {
                setIsLoading(true);
                // Obtener categorías y campus
                const [fetchedCategories, fetchedCampuses] = await Promise.all([
                    categoriesService.getAllCategories(),
                    campusService.getAllCampuses()
                ]);
                setCategories(fetchedCategories);
                setCampuses(fetchedCampuses);

                // Configurar filtros
                const categoryId = category ? ({
                    "tradicionales": 1,
                    "sociales": 2,
                    "tecnologicos": 3
                } as { [key: string]: number })[category] : undefined;

                const campusId = campus ? fetchedCampuses.find(c => c.name.toLowerCase() === campus.toLowerCase())?.id : undefined;

                const localFilters: FilterProjectsForm = {
                    stage: stage,
                    level: level,
                    categoryId: categoryId || undefined,
                    campus: campusId || undefined
                };

                // Fetch projects based on the filters
                let fetchedProjects: Project[] = [];
                fetchedProjects = await projectsService.getFilteredProjects(period, localFilters);

                // Sort projects by final_score in descending order
                fetchedProjects = fetchedProjects.sort((a, b) => {
                    if (a.final_score === undefined || a.final_score === null) return 1;
                    if (b.final_score === undefined || b.final_score === null) return -1;
                    return b.final_score - a.final_score;
                });

                setProjects(fetchedProjects);
                setIsLoading(false);
            } catch (error) {
                // console.error("Error fetching data:", error);
                navigate("/dashboard");
            }
        };

        run();

    }, [stage, level, period, navigate]);

    // Filtrar proyectos según el término de búsqueda
    const filteredProjects = projects.filter((project) => {
        const categoryName = categories.find(cat => cat.id === project.id_category)?.name || "";
        return (
            project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.stage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
            categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campuses.find(campus => campus.id === project.id_campus)?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const handleExportClick = async () => {
        if (!stage || !level || !period || loadingExport) return;
                // Configurar filtros
                const categoryId = category ? ({
                    "tradicionales": 1,
                    "sociales": 2,
                    "tecnologicos": 3
                } as { [key: string]: number })[category] : undefined;

                const campusId = campus ? campuses.find(c => c.name.toLowerCase() === campus.toLowerCase())?.id : undefined;

                const localFilters: FilterProjectsForm = {
                    stage: stage,
                    level: level,
                    categoryId: categoryId || undefined,
                    campus: campusId || undefined
                };


        try {
            setSearchTerm("");
            setLoadingExport(true);
            await projectsService.exportProjects(period, localFilters);
        } catch (error) {
            console.error("Error exporting judges:", error);
        }
        finally {
            setLoadingExport(false);
        }
    }

    return (
        <div className="flex h-screen">
            <Sidebar activeSection="dashboard" />
            <div className="flex flex-col mx-auto px-3 mt-8 w-7/8">
                <h1 className="text-4xl mb-8">Proyectos {name}</h1>
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
                                    className="text-white font-medium bg-[#DD971A] p-3 mx-2 rounded-full"
                                    onClick={() => navigate("/dashboard")}
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} />
                                    Regresar
                                </button>
                                {!isLoading && (
                                    <button
                                        title="Exportar jueces"
                                        className="text-white font-medium bg-[#00723F] p-3 rounded-full"
                                        onClick={() => handleExportClick()}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m720-120 160-160-56-56-64 64v-167h-80v167l-64-64-56 56 160 160ZM560 0v-80h320V0H560ZM240-160q-33 0-56.5-23.5T160-240v-560q0-33 23.5-56.5T240-880h280l240 240v121h-80v-81H480v-200H240v560h240v80H240Zm0-80v-560 560Z" /></svg>
                                    </button>
                                )}
                            </div>
                        </div>
                        {isLoading ? (
                            <p className="mt-10 text-gray-500 text-center">Cargando proyectos...</p>
                        ) : projects.length === 0 ? (
                            <p className="mt-10 text-gray-500 text-center">No hay proyectos para mostrar.</p>
                        ) : null}
                        <div className="overflow-y-auto space-y-4 mt-4">
                            {filteredProjects.map((project, index) => (
                                <Card
                                    key={index}
                                    index={index + 1}
                                    title={project.title}
                                    subtitle={`${project.stage?.toUpperCase()} | ${project.level.toUpperCase()} | ${categories.find(cat => cat.id === project.id_category)?.name.toUpperCase() || "Sin categoría"} | ${campuses.find(campus => campus.id === project.id_campus)?.name.toUpperCase() || "Sin campus"} | PUNTAJE FINAL: ${project.final_score !== null && project.final_score !== undefined ? project.final_score : "N/A"}`}
                                    actions={[
                                        {
                                            label: "Ver detalles",
                                            click: () => navigate(`/dashboard/${project.stage}/${project.level}/${categories.find(cat => cat.id === project.id_category)?.name.toLowerCase()}/${campuses.find(campus => campus.id === project.id_campus)?.name.toLowerCase()}/${project.id}`),
                                            bgColor: "bg-[#00723F]",
                                            icon: Icons.eye
                                        }
                                    ]}
                                    statusEvaluation={project.judges_count !== undefined ? `${project.evaluations_count}/${project.judges_count}` : ""}
                                    wrongCategory={project.wrong_category}
                                />
                            ))}
                        </div>
                    </>) : (
                    <p className="mt-10 text-gray-500 text-center">Activa un periodo para visualizar los proyectos.</p>
                )}
                {/* Modal de espera para exportar a los proyectos */}
                {loadingExport && (
                    <div className="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-50 px-4 sm:px-0">
                        <div className="bg-white rounded-xl p-6 shadow-lg flex flex-col items-center space-y-4">
                            <svg className="animate-spin h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            <p className="text-gray-700 font-medium">
                                Generando archivo, por favor espera...
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProjectsTopListPage;