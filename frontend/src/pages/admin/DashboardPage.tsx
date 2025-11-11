import Sidebar from "../../components/sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CardDashboard from "../../components/shared/CardDashboard";
import type { Project, Campus, FilterProjectsForm } from "../../types/Utils";
import { projectsService, campusService } from "../../services/api";
import { useAuth } from "../../states/AuthContext";
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts'

function DashboardPage() {
    const { period } = useAuth();
    const navigate = useNavigate();
    const [filters, setFilters] = useState<FilterProjectsForm>();
    // DB Data States
    const [campuses, setCampuses] = useState<Campus[]>([]);
    const [groupedProjects, setGroupedProjects] = useState<{
        social: Project[];
        tradicional: Project[];
        tecnologico: Project[];
    }>({ social: [], tradicional: [], tecnologico: [] });
    const [topProjects, setTopProjects] = useState<Project[]>([]);
    const [numberProjects, setNumberProjects] = useState<{ name: string, value: number }[]>([])
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    // Cargar el valor del toggle desde localStorage al montar el componente
    useEffect(() => {
        const storedStage = localStorage.getItem("toggleStage") as
            | "local"
            | "estatal"
            | null;

        const storedLevel = localStorage.getItem("toggleLevel") as
            | "licenciatura"
            | "posgrado"
            | null;

        setFilters({
            stage: storedStage || "local",
            level: storedLevel || "licenciatura",
        });
    }, []);

    // Fetch de proyectos cuando cambia el período o los filtros
    useEffect(() => {
        if (!period || !filters) return;

        const fetchProjects = async () => {
            try {
                const fetchedProjects = await projectsService.getFilteredProjects(period, filters);

                const topProjects = fetchedProjects
                    .sort((a, b) => (b.final_score ?? 0) - (a.final_score ?? 0))
                    .slice(0, 5);

                setTopProjects(topProjects);

                setNumberProjects([
                    { name: "Proyectos tradicionales", value: fetchedProjects.filter(p => p.id_category === 1).length },
                    { name: "Proyectos sociales", value: fetchedProjects.filter(p => p.id_category === 2).length },
                    { name: "Proyectos tecnológicos", value: fetchedProjects.filter(p => p.id_category === 3).length },
                ]);

                setGroupedProjects({
                    tradicional: fetchedProjects.filter(p => p.id_category === 1),
                    social: fetchedProjects.filter(p => p.id_category === 2),
                    tecnologico: fetchedProjects.filter(p => p.id_category === 3),
                });
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        const fetchCampuses = async () => {
            try {
                const fetchedCampuses = await campusService.getAllCampuses();
                setCampuses(fetchedCampuses);
            } catch (error) {
                console.error("Error fetching campuses:", error);
            }
        };

        fetchProjects();
        fetchCampuses();
    }, [period, filters]);

    // Manejar el cambio de filtros
    const handleChangeLevel = () => {
        setFilters((prev) => ({
            ...prev as FilterProjectsForm,
            level: prev?.level === "licenciatura" ? "posgrado" : "licenciatura"
        }));
        localStorage.setItem(
            "toggleLevel",
            filters?.level === "licenciatura" ? "posgrado" : "licenciatura"
        );
    };

    const handleChangeStage = () => {
        setFilters((prev) => ({
            ...prev as FilterProjectsForm,
            stage: prev?.stage === "local" ? "estatal" : "local",
            campus: prev?.stage === "local" ? undefined : prev?.campus
        }));
        localStorage.setItem(
            "toggleStage",
            filters?.stage === "local" ? "estatal" : "local"
        );
    };

    return (
        <div className="flex h-screen">
            <Sidebar activeSection="dashboard" />
            <div className="flex flex-col overflow-y-auto mx-auto px-3 mt-8 w-7/8">
                <div className="flex flex-col mx-auto px-4 py-6 w-full max-w-7xl">
                    {!period ? (
                        <>
                            <h1 className="text-3xl font-bold text-center sm:text-left">Dashboard</h1>
                            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
                                <p className="font-bold">Aviso</p>
                                <p>No hay un período activo actualmente. Por favor, active uno.</p>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="flex flex-col lg:flex-row flex-wrap justify-between items-center gap-4 mb-8">

                                {/* Título */}
                                <h1 className="text-2xl md:text-3xl font-bold text-center lg:text-left w-full lg:w-auto">
                                    Dashboard
                                </h1>

                                {/* Filtros */}
                                <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-end items-center gap-3 w-full lg:w-auto">

                                    {/* Toggle Stage */}
                                    <div
                                        className="inline-flex items-center rounded-xl border-2 overflow-hidden cursor-pointer"
                                        onClick={handleChangeStage}
                                    >
                                        <span
                                            className={`px-4 py-2 font-bold transition-colors ${filters?.stage === "local"
                                                ? "bg-black text-white"
                                                : "bg-white text-black"
                                                }`}
                                        >
                                            Local
                                        </span>
                                        <span
                                            className={`px-4 py-2 font-bold transition-colors ${filters?.stage === "estatal"
                                                ? "bg-black text-white"
                                                : "bg-white text-black"
                                                }`}
                                        >
                                            Estatal
                                        </span>
                                    </div>

                                    {/* Toggle Level */}
                                    <div
                                        className="inline-flex items-center rounded-xl border-2 overflow-hidden cursor-pointer"
                                        onClick={handleChangeLevel}
                                    >
                                        <span
                                            className={`px-4 py-2 font-bold transition-colors ${filters?.level === "licenciatura"
                                                ? "bg-black text-white"
                                                : "bg-white text-black"
                                                }`}
                                        >
                                            Licenciatura
                                        </span>
                                        <span
                                            className={`px-4 py-2 font-bold transition-colors ${filters?.level === "posgrado"
                                                ? "bg-black text-white"
                                                : "bg-white text-black"
                                                }`}
                                        >
                                            Posgrado
                                        </span>
                                    </div>

                                    {/* Selector de campus */}
                                    {filters?.stage === "local" && (
                                        <select
                                            className="border rounded-xl border-2 px-3 py-2 focus:outline-none min-w-[180px] font-bold"
                                            value={filters?.campus || ""}
                                            onChange={(e) =>
                                                setFilters((prev) => ({
                                                    ...prev as FilterProjectsForm,
                                                    campus: e.target.value ? Number(e.target.value) : undefined,
                                                }))
                                            }
                                        >
                                            <option value="">Todos los campus</option>
                                            {campuses.map((campus) => (
                                                <option key={campus.id} value={campus.id}>
                                                    {campus.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>

                            {/* Contenido dinámico */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                                {Object.entries(groupedProjects).map(([category, projects]) => (
                                    <CardDashboard
                                        key={category}
                                        text={
                                            category === "tradicional"
                                                ? "Proyectos tradicionales"
                                                : category === "social"
                                                    ? "Proyectos sociales"
                                                    : "Proyectos tecnológicos"
                                        }
                                        value={projects.length}
                                        link={`/dashboard/${filters?.stage}/${filters?.level}/${category === "tradicional"
                                                ? "tradicionales"
                                                : category === "social"
                                                    ? "sociales"
                                                    : "tecnologicos"
                                            }${filters?.campus ? `/${campuses.find(c => c.id === filters?.campus)?.name.toLowerCase()}` : ""}`}
                                    />
                                ))}
                            </div>

                            {/* Tabla + Gráfica */}
                            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10">
                                {/* Tabla */}
                                <div className="overflow-x-auto w-full lg:w-1/2 flex flex-col items-center">
                                    <table className="table-auto w-full border-collapse text-center rounded-xl overflow-hidden bg-white">
                                        <thead>
                                            <tr className="border-b-2">
                                                <th className="py-3 text-md font-semibold" colSpan={3}>
                                                    Proyectos {filters?.level} ({numberProjects.reduce((acc, curr) => acc + curr.value, 0)})
                                                </th>
                                            </tr>
                                            <tr>
                                                <th className="text-sm py-2 px-2">Proyecto</th>
                                                <th className="text-sm py-2 px-2">Categoría</th>
                                                <th className="text-sm py-2 px-2">Puntaje</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topProjects.map((project) => (
                                                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="text-sm py-2 px-1">{project.title}</td>
                                                    <td className="text-sm py-2 px-1">
                                                        {project.id_category === 1
                                                            ? "Tradicional"
                                                            : project.id_category === 2
                                                                ? "Social"
                                                                : "Tecnológico"}
                                                    </td>
                                                    <td className="text-sm py-2 px-1">{project.final_score || 0}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {/* Botón para ver todos los proyectos */}
                                    {topProjects.length > 0 && (
                                        <button
                                            className="mt-4 px-4 py-2 bg-[#00723F] text-white rounded-lg hover:bg-[#005f30] transition-colors"
                                            onClick={() => navigate(`/dashboard/${filters?.stage}/${filters?.level}/all${filters?.campus ? `/${campuses.find(c => c.id === filters?.campus)?.name.toLowerCase()}` : ""}`)}
                                        >
                                            Ver todos los proyectos
                                        </button>
                                    )}
                                </div>

                                {/* Gráfica */}
                                {topProjects.length > 0 && !filters?.campus && (
                                    <div className="w-full sm:w-4/5 md:w-2/3 lg:w-1/2 h-72 sm:h-80 md:h-96">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    dataKey="value"
                                                    isAnimationActive={false}
                                                    data={numberProjects}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius="70%"
                                                    label={(props: any) => {
                                                        // const name = props.name ?? '';
                                                        const percent = typeof props.percent === 'number' ? props.percent : 0;
                                                        // return `${name}: ${(percent * 100).toFixed(1)}%`;
                                                        return `${(percent * 100).toFixed(1)}%`;
                                                    }}
                                                >
                                                    {numberProjects.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${entry.name}`}
                                                            fill={COLORS[index % COLORS.length]}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: "#fff",
                                                        borderRadius: "10px",
                                                        border: "1px solid #ccc",
                                                        fontSize: "0.9rem",
                                                    }}
                                                />
                                                <Legend layout="horizontal" align="center" verticalAlign="bottom" />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
