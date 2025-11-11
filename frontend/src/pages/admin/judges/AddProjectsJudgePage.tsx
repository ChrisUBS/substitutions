import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../states/AuthContext";
import Sidebar from "../../../components/sidebar/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faArrowLeft, faFilter, faTrash } from "@fortawesome/free-solid-svg-icons";
import { judgesService, projectsService } from "../../../services/api";
import type { Project, Judge } from "../../../types/Utils";
import FilterModal from "../../../components/modals/FilterModal";

function AddProjectsJudge() {
    const navigate = useNavigate();
    const { period } = useAuth();
    const { mode } = useParams()
    const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
    const [selectedFilters, setSelectedFilters] = useState<{ category: number | null; level: string | null; campus: string | null; stage: string | null }>({ category: null, level: null, campus: null, stage: null });
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [isAssigning, setIsAssigning] = useState<boolean>(false);
    // Datos de la DB
    const [judges, setJudges] = useState<Judge[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    // Estados de búsqueda
    const [searchTermJudge, setSearchTermJudge] = useState<string>("");
    const [searchTermProject, setSearchTermProject] = useState<string>("");
    // Estados de selección
    const [selectedJudges, setSelectedJudges] = useState<number[]>([]);
    const [selectedProjects, setSelectedProjects] = useState<(number)[]>([]);

    useEffect(() => {
        if (!period) return;

        // Validar modo
        if (mode !== "assign-projects" && mode !== "deassign-projects") {
            navigate('/judges');
            return;
        }

        const fetchAll = async () => {
            try {
                const projects = await projectsService.getProjectsByPeriod(period);
                const judges = await judgesService.getJudgesByPeriod(period);
                setProjects(projects)
                setJudges(judges)
            } catch (error) {
                console.error("Error fetching projects:", error)
                navigate('/judges')
            }
        }

        fetchAll();

        // Filtrado de proyectos
        if (selectedFilters.category!==null || selectedFilters.level!==null || selectedFilters.campus!==null || selectedFilters.stage!==null || searchTermProject!=="") {
            const filtered = projects.filter((project) => {
                const categoryMatch = selectedFilters.category ? project.id_category === selectedFilters.category : true;
                const levelMatch = selectedFilters.level ? project.level.toLowerCase() === selectedFilters.level.toLowerCase() : true;
                const campusMatch = selectedFilters.campus ? project.id_campus === Number(selectedFilters.campus) : true;
                const stageMatch = selectedFilters.stage ? project.stage?.toLowerCase() === selectedFilters.stage.toLowerCase() : true;
                const searchMatch = searchTermProject ? project.title?.toLowerCase().includes(searchTermProject.toLowerCase()): true;
                return categoryMatch && levelMatch && campusMatch && stageMatch && searchMatch;
            });
            
            setFilteredProjects(filtered)
        }else{
            setFilteredProjects(projects)
        }
    }, [period, selectedFilters, projects, searchTermProject, navigate]);

    // Asignar proyectos a jueces
    const assignProjectsToJudges = async () => {
        setIsAssigning(true);

        // Si no hay jueces seleccionados, mostrar alerta
        if (selectedJudges.length === 0 || selectedProjects.length === 0) {
            alert("Por favor, seleccione al menos un juez y un proyecto.");
            setIsAssigning(false);
            return;
        }

        try {
            for (const judgeId of selectedJudges) {
                await judgesService.assignProjectsToJudge(judgeId, selectedProjects);
                // console.log(`Assigning projects ${selectedProjects} to judge ${judgeId}`);
            }
            navigate('/judges');
        } catch (error) {
            console.error("Error assigning projects to judges:", error);
        } finally {
            setIsAssigning(false);
        }
    };

    const removeProjectsFromJudges = async () => {
        setIsAssigning(true);

        // Si no hay jueces seleccionados, mostrar alerta
        if (selectedJudges.length === 0 || selectedProjects.length === 0) {
            alert("Por favor, seleccione al menos un juez y un proyecto.");
            setIsAssigning(false);
            return;
        }

        try {
            for (const judgeId of selectedJudges) {
                await judgesService.removeProjectsFromJudge(judgeId, selectedProjects);
            }
            navigate('/judges');             
        } catch (error){
            console.error("Error removing project from judges:", error);
        } finally {
            setIsAssigning(false);
        }
    }

    // Filtrado de jueces según búsqueda
    const filteredJudges = judges.filter((judge) =>
        judge.name.toLowerCase().includes(searchTermJudge.toLowerCase()) ||
        judge.username.toLowerCase().includes(searchTermJudge.toLowerCase())
    );

    // Manejo de selección
    const toggleJudge = (judgeId: number) => {
        setSelectedJudges((prev) => prev.includes(judgeId) ? prev.filter((id) => id !== judgeId) : [...prev, judgeId]);
    }
    const toggleProject = (projectId: (number)) => {
        setSelectedProjects((prev) => prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]);
        
    }

    // Seleccionar/Deseleccionar todos los filtrados
    const allFilteredJudgesSelected = filteredJudges.length > 0 && filteredJudges.every(j => selectedJudges.includes(j.id));
    const allFilteredProjectsSelected = filteredProjects?.length > 0 && filteredProjects.every(p => p.id != null && selectedProjects.includes(p.id));

    const toggleSelectAllJudges = () => {
        if (allFilteredJudgesSelected) {
            // deseleccionar los filtrados
            setSelectedJudges(prev => prev.filter(id => !filteredJudges.some(j => j.id === id)));
        } else {
            // agregar todos los filtrados (sin duplicados)
            setSelectedJudges(prev => Array.from(new Set([...prev, ...filteredJudges.map(j => j.id)])));
        }
    };

    const toggleSelectAllProjects = () => {
        if (allFilteredProjectsSelected) {
            setSelectedProjects(prev => prev.filter(id => !filteredProjects.some(p => p.id === id)));
        } else {
            const projectsId = filteredProjects
            .map(p => p.id)
            .filter((id): id is number => id !== undefined && id !==null);

            setSelectedProjects(prev => Array.from(new Set([...prev, ...projectsId])));
        }
    };

    // Manejo del modal de filtro
    const openFilterModal = () => setIsFilterModalOpen(true);
    const closeFilterModal = () => setIsFilterModalOpen(false);

    return (
        <div className="flex h-screen">
            <Sidebar activeSection="judges" />
            <div className="flex flex-col w-full mx-auto px-8 mt-4 sm:mt-10">

                {/* Título y acciones */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h1 className="text-1xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-bold">
                        {mode === "assign-projects" ? "Asignar proyectos" : mode === "deassign-projects" && "Remover proyectos" }
                    </h1>

                    <div className="flex gap-3 mt-4 sm:mt-0">
                        <button disabled={isAssigning}
                            onClick={() => navigate(-1)}
                            className="bg-[#DC1818] text-white px-2 py-1 sm:px-5 sm:py-2 rounded-full font-medium hover:bg-red-700 transition-colors"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                            Regresar
                        </button>
                        <button disabled={isAssigning}
                            onClick={mode === "assign-projects" ? assignProjectsToJudges : (mode === "deassign-projects" ? removeProjectsFromJudges : undefined)}
                            className="bg-[#00723F] text-white px-5 py-2 rounded-full font-medium hover:bg-green-800 transition-colors"
                        >
                            {mode === "assign-projects" ? (<FontAwesomeIcon icon={faCheck} />) : (mode === "deassign-projects" && <FontAwesomeIcon icon={faTrash} />)}
                            {mode === "assign-projects" ? "Asignar" : mode === "deassign-projects" && "Remover" }
                        </button>
                    </div>
                </div>

                {/* Contenedor principal */}
                <div className="flex flex-col min-h-0 overflow-y-auto mx-auto pb-2 sm:flex-row justify-center gap-5 md:gap-16 px-6 md:px-10">
                    {/* --- Jueces --- */}
                    <div className="flex flex-col gap-3 overflow-y-auto max-h-[60vh] pr-2">
                        <h2 className="font-semibold mb-1">Jueces</h2>

                        {/* Input de búsqueda */}
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Buscar un juez..."
                                value={searchTermJudge}
                                onChange={(e) => setSearchTermJudge(e.target.value)}
                                className="w-full text-base px-2 py-1 sm:px-5 sm:py-2 pr-10 text-gray-700 bg-gray-200 rounded-full outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="22" fill="#565A5C">
                                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                                </svg>
                            </button>
                        </div>

                        {/* Checkbox seleccionar todos */}
                        <label className="flex items-center text-base gap-2 mb-4 cursor-pointer">
                            <input type="checkbox" className="w-5 h-5 accent-yellow-400 cursor-pointer"
                                checked={allFilteredJudgesSelected}
                                onChange={toggleSelectAllJudges}
                            />
                            <span>Seleccionar todos</span>
                        </label>

                        {/* Lista de jueces */}
                        <div className="flex flex-col gap-2 overflow-y-auto max-h-[70vh] pr-2">
                            {filteredJudges.length > 0 ? (
                                filteredJudges.map((judge) => (
                                    <div
                                        key={judge.id}
                                        className="flex items-center gap-4 bg-gray-200 rounded-xl px-5 py-3 hover:bg-gray-300 transition"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedJudges.includes(judge.id)}
                                            onChange={() => toggleJudge(judge.id)}
                                            className="w-6 h-6 accent-yellow-400 cursor-pointer"
                                        />
                                        <div className="flex flex-col text-left text-base">
                                            <span className="font-semibold text-gray-800">{judge.name}</span>
                                            <span className="text-gray-600 text-sm">{judge.username}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-base">No se encontraron jueces.</p>
                            )}
                        </div>
                    </div>

                    {/* --- Proyectos --- */}
                    <div className="flex flex-col gap-2 overflow-y-auto max-h-[70vh] pr-2">
                        <h2 className="font-semibold mb-1">Proyectos</h2>

                        <div className="flex flex-row items-center gap-2 mb-4">
                            {/* Input de búsqueda */}
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Buscar un proyecto..."
                                    value={searchTermProject}
                                    onChange={(e) => setSearchTermProject(e.target.value)}
                                    className="w-full text-base px-2 py-1 sm:px-5 sm:py-2 pr-10 text-gray-700 bg-gray-200 rounded-full outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="22" fill="#565A5C">
                                        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Botón de filtro */}
                            <button className="p-2 rounded-full hover:bg-gray-200 transition" onClick={openFilterModal}>
                                <FontAwesomeIcon icon={faFilter} className="text-gray-700 text-lg" />
                            </button>
                        </div>


                        {/* Checkbox seleccionar todos */}
                        <label className="flex items-center text-base gap-2 mb-4 cursor-pointer">
                            <input type="checkbox" className="w-5 h-5 accent-yellow-400 cursor-pointer" checked={allFilteredProjectsSelected} onChange={toggleSelectAllProjects} />
                            <span>Seleccionar todos</span>
                        </label>

                        {/* Lista de proyectos */}
                        <div className="flex flex-col gap-3 overflow-y-auto max-h-[60vh] pr-2">
                            {filteredProjects?.length > 0 ? (
                                filteredProjects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="flex items-center gap-4 bg-gray-200 rounded-xl px-5 py-3 hover:bg-gray-300 transition"
                                    >
                                        <input
                                            type="checkbox"
                                            onChange={() => project.id != null && toggleProject(project.id)}
                                            checked={project.id != null ? selectedProjects.includes(project.id):false}
                                            className="w-6 h-6 accent-yellow-400 cursor-pointer"
                                        />
                                        <div className="flex flex-col text-left text-base">
                                            <span className="font-semibold text-gray-800">{project.title}</span>
                                            <span className="text-gray-600 text-sm">
                                                {project.level.toUpperCase()} | {project.id_category === 1 ? "Tradicional" : project.id_category === 2 ? "Social" : "Tecnológico"}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-base">No se encontraron proyectos.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={closeFilterModal}
                onApply={(filters) => {setSelectedFilters(filters);}}
            />
        </div>
    );
}

export default AddProjectsJudge;
