import { useState, useEffect } from "react";
import { useAuth } from '../../states/AuthContext';
import { useNavigate } from "react-router-dom";
import { judgesService, categoriesService, evaluationsService, campusService } from "../../services/api";
import type { ProjectJudge, Category, EvaluationForm, Campus } from "../../types/Utils";
import HeaderEvaluation from "../../components/header/HeaderEvaluation";
import Card from "../../components/shared/Card";
import { Icons } from "../../components/shared/Icons";

function EvaluationsPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [isGraded, setisGraded] = useState(false);
    const [projects, setProjects] = useState<ProjectJudge[]>([]);
    const [evaluations, setEvaluations] = useState<EvaluationForm[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [campuses, setCampuses] = useState<Campus[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            if (!user) return;
            
            try {
                const data = await judgesService.getProjectsByJudge(user.id);
                setProjects(data);
                const categories = await categoriesService.getAllCategories();
                setCategories(categories);
                const campuses = await campusService.getAllCampuses();
                setCampuses(campuses);

                if (data.length > 0) {
                    const evalsArrays = await Promise.all(
                        data.map(proj => evaluationsService.getEvaluationsByProject(proj.id_project))
                    );
                    const evals = evalsArrays.flat();
                    const filteredEvals = evals.filter(evaluation => evaluation.id_judge === user.id);
                    setEvaluations(filteredEvals);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects();
    }, [user]);

    // Filtrar proyectos según el término de búsqueda y si están evaluados o no
    const filteredProjects = projects.filter((project) => {
        const categoryName = categories.find(cat => cat.id === project.project.id_category)?.name || "";
        const matchesSearchTerm =
            project.project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.project.stage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.project.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
            categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campuses.find(campus => campus.id === project.project.id_campus)?.name.toLowerCase().includes(searchTerm.toLowerCase());

        const isProjectGraded = evaluations.some(evaluation => evaluation.id_project === project.id_project);
        projects.sort((a, b) => a.project.title.localeCompare(b.project.title));

        return matchesSearchTerm && (isGraded ? isProjectGraded : !isProjectGraded);
    });

    return (
        <div className="flex flex-col h-screen">
            <HeaderEvaluation />
            <div className="flex flex-col mx-auto px-3 mt-8 w-7/8">
                <h1 className="text-4xl mb-8">Evaluaciones</h1>
                {projects.length === 0 ? (
                    <p className="mt-6 text-gray-600 text-center">No se encontraron proyectos.</p>
                ) :
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
                        <div className="flex text-sm" onClick={() => setisGraded(!isGraded)}>
                            <button className="text-white font-medium bg-[#DD971A] p-3 mx-2 rounded-full">
                                {isGraded ? "Ver proyectos a evaluar" : "Ver proyectos evaluados"}
                            </button>
                        </div>
                    </div>
                }
                <div className="overflow-y-auto space-y-4 mt-4">
                    {filteredProjects.map((project, index) => (
                        <Card
                            key={index}
                            title={project.project.title}
                            subtitle={`${project.project.stage?.toUpperCase()} | ${project.project.level.toUpperCase()} | ${categories.find(cat => cat.id === project.project.id_category)?.name.toUpperCase() || "Sin categoría"} | ${campuses.find(campus => campus.id === project.project.id_campus)?.name.toUpperCase() || "Sin campus"} | ${project.project.faculty?.toUpperCase() || "Sin facultad"}`}
                            disable={isGraded && true}
                            actions={[
                                {
                                    label: "Evaluar",
                                    icon: Icons.Evaluar,
                                    click: isGraded ? undefined : () => { navigate(`/evaluations/${project.id_project}/grade`) },
                                    bgColor: isGraded ? "bg-[#403A39]" : "bg-[#00723F]"
                                }
                            ]}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default EvaluationsPage;