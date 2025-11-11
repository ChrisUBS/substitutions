import { useEffect, useState } from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../states/AuthContext";
import {
    projectsService,
    categoriesService,
    teamMembersService,
    rolesService,
    evaluationsService,
    judgesService,
    campusService
} from "../../../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import type {
    Project,
    Category,
    TeamMember,
    Role,
    EvaluationForm,
    Judge,
    Campus
} from "../../../types/Utils";
import Card from "../../../components/shared/Card";
import { Icons } from "../../../components/shared/Icons";
import ConfirmActionModal from "../../../components/modals/ConfirmActionModal";

function ProjectDetailsPage() {
    const { stage, level, category, campus, id } = useParams();
    const { period } = useAuth();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project>();
    const [categories, setCategories] = useState<Category[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [campuses, setCampuses] = useState<Campus[]>([]);
    const [evaluations, setEvaluations] = useState<EvaluationForm[]>([]);
    const [judges, setJudges] = useState<Judge[]>([]);
    const [stateProject, setStateProject] = useState<number | null>(null);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [messageModal, setmessageModal] = useState("");
    const [submessageModal, setsubmessageModal] = useState("");
    const [loading, setLoading] = useState(false);
    const [confirmModal, setConfirmModal] = useState<() => void>(() => { });

    const closeModal = () => {
        setIsOpenModal(false);
    }

    const handleAscendClick = () => {
        setmessageModal("¿Enviar a fase estatal?");
        setsubmessageModal("El proyecto será duplicado en la fase estatal.");
        setConfirmModal(() => handleAscendProject);
        setIsOpenModal(true);
    };

    const handleDescendClick = () => {
        setmessageModal("¿Descender a fase local?");
        setsubmessageModal("El proyecto será eliminado de la fase estatal.");
        setConfirmModal(() => handleDescendProject);
        setIsOpenModal(true);
    };

    useEffect(() => {
        if (!stage || !level || !category || !campus || !id || !period) return;

        const fetchAll = async () => {
            try {
                const [proj, state, cats, members, rolesData, campuses, evals, judges] = await Promise.all([
                    projectsService.getProjectById(parseInt(id)),
                    projectsService.getExistStateByProjectId(parseInt(id)),
                    categoriesService.getAllCategories(),
                    teamMembersService.getTeamMembersByProjectId(parseInt(id)),
                    rolesService.getAllRoles(),
                    campusService.getAllCampuses(),
                    evaluationsService.getEvaluationsByProject(parseInt(id)),
                    judgesService.getJudgesByPeriod(period),
                ]);

                setProject(proj);
                setStateProject(state)
                setCategories(cats);
                setTeamMembers(members);
                setRoles(rolesData);
                setCampuses(campuses);
                setEvaluations(evals);
                setJudges(judges);
            } catch (error) {
                console.error("Error fetching project details:", error);
            }
        };

        fetchAll();
    }, [level, period, id]);

    const handleAscendProject = async () => {

        if (!project || loading) return;

        setLoading(true);
        closeModal();
        try {
            let projectId = project.id;

            //Eliminamos las varibles que no se necesitan para crear el proyecto
            const {
                id,
                created_at,
                updated_at,
                final_score,
                evaluations_count,
                judges_count,
                ...cleanProjectData
            } = project;

            const projectData = {
                ...cleanProjectData,
                stage: "estatal"
            };

            // Capturamos el nuevo proyecto en fase estatal
            const newProject = await projectsService.createProject(projectData);
            // Obtenemos el ID del nuevo proyecto
            projectId = newProject.id;

            // Duplicamos a los integrantes y asesores del proyecto local para el estatal
            const newTeamMembers = teamMembers.map(({ created_at, updated_at, id, ...member }) => ({
                ...member,
                id_project: projectId
            }))

            // Asignamos a cada integrante y asesor al nuevo proyecto estatal
            await Promise.all(newTeamMembers.map((member) => teamMembersService.addTeamMember(member)));
            navigate(-1);
        } catch (error) {
            console.error("Error ascending project:", error);
        } finally {
            setLoading(false);
        }
    }
    const handleDescendProject = async () => {

        if (!project || !stateProject || loading) return;

        try {
            closeModal();
            setLoading(true);
            //Borramos el proyecto en fase estatal
            await projectsService.deleteProjectById(stateProject)
            navigate(-1);
        } catch (error) {
            console.error("Error ascending project:", error);
        } finally {
            setLoading(false);
        }
    }

    const categoryName = categories.find((cat) => cat.id === project?.id_category)?.name || category || "—";

    const asesores = teamMembers.filter(
        (member) => roles.find((r) => Number(r.id) === member.id_role)?.name.toLowerCase() === "asesor"
    );
    const integrantes = teamMembers.filter(
        (member) => roles.find((r) => Number(r.id) === member.id_role)?.name.toLowerCase() === "alumno"
    );

    return (
        <div className="flex h-screen">
            <Sidebar activeSection="dashboard" />

            <div className="flex flex-col w-full mx-auto px-8 mt-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h1 className="text-2xl sm:text-1xl md:text-2xl lg:text-3xl xl:text-4xl font-bold">
                        Detalles del proyecto</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-[#DD971A] hover:bg-[#c48518] text-sm text-white px-5 py-2 rounded-full font-medium flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                            Regresar
                        </button>
                        {/* Botón para que un proyecto ascienda a la fase estatal */}
                        {(!stateProject) ? (
                            <button
                                onClick={() => handleAscendClick()}
                                className="bg-[#00723F] hover:bg-[#005E34] text-sm text-white px-5 py-2 rounded-full font-medium flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faArrowUp} />
                                Estatal
                            </button>
                        ) : (
                            // Botón para que un proyecto descienda a la fase local
                            <>
                                {project?.stage === 'local' && (
                                    <button
                                        onClick={() => handleDescendClick()}
                                        className="bg-[#DC1818] hover:bg-[#B31414] text-sm md:text-base text-white px-5 py-2 rounded-full font-medium flex items-center gap-2"
                                    >
                                        <FontAwesomeIcon icon={faArrowDown} />
                                        Quitar estatal
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Detalles del proyecto */}
                <div className="flex flex-col min-h-0 overflow-y-auto w-7/8 mx-auto mt-4 space-y-4 pb-4">
                    {/* Cabecera de datos principales */}
                    <div className="grid grid-cols-1 md:grid-cols-6 text-center md:text-left font-semibold text-gray-700 border-b pb-3 mb-4">
                        <div className="py-1 md:py-0">Nombre del proyecto</div>
                        <div className="py-1 md:py-0">Nivel</div>
                        <div className="py-1 md:py-0">Facultad</div>
                        <div className="py-1 md:py-0">Categoría</div>
                        <div className="py-1 md:py-0">Campus</div>
                        <div className="py-1 md:py-0">Puntaje</div>
                    </div>

                    {/* Valores del proyecto */}
                    <div className="grid grid-cols-1 md:grid-cols-6 text-center md:text-left mb-8 gap-y-2">
                        <div>{project?.title || "—"}</div>
                        <div className="capitalize">{level}</div>
                        <div>{project?.faculty || "—"}</div>
                        <div>{categoryName}</div>
                        <div>{campuses.find(campus => campus.id === project?.id_campus)?.name || "—"}</div>
                        <div>{project?.final_score ?? "—"}</div>
                    </div>

                    {/* Integrantes y asesores */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Integrantes */}
                        <div>
                            <h2 className="text-lg font-semibold mb-2 text-center md:text-left">Integrantes</h2>
                            <ul className="space-y-1">
                                {integrantes.length > 0 ? (
                                    integrantes.map((m) => (
                                        <li key={m.id} className="text-center md:text-left">
                                            {m.name} -{" "}
                                            <span className="text-gray-500 text-sm">{m.email}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500 text-center md:text-left">Sin integrantes</li>
                                )}
                            </ul>
                        </div>

                        {/* Asesores */}
                        <div>
                            <h2 className="text-lg font-semibold mb-2 text-center md:text-left">Asesores</h2>
                            <ul className="space-y-1">
                                {asesores.length > 0 ? (
                                    asesores.map((m) => (
                                        <li key={m.id} className="text-center md:text-left">
                                            {m.name} -{" "}
                                            <span className="text-gray-500 text-sm">{m.email}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500 text-center md:text-left">Sin asesores</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Evaluaciones */}
                    <h2 className="text-xl font-semibold mt-10 mb-4">Evaluaciones {(project?.evaluations_count !== undefined && project?.judges_count !== undefined) ? `(${project?.evaluations_count}/${project?.judges_count})` : ""}</h2>
                    <div className="space-y-3">
                        {evaluations.length > 0 ? (
                            evaluations.map((e, index) => (
                                <Card
                                    key={index}
                                    index={e.total_score}
                                    title={judges.find(j => j.id === e.id_judge)?.name || "Juez desconocido"}
                                    subtitle={judges.find(j => j.id === e.id_judge)?.username || ""}
                                    actions={[
                                        {
                                            label: "Ver evaluación",
                                            icon: Icons.eye,
                                            click: () => navigate(`/dashboard/${stage}/${level}/${category}/${campus}/${id}/evaluation/${e.id}`),
                                            bgColor: "bg-[#00723F]"
                                        }
                                    ]}
                                    wrongCategory={(Number(e.question_11) === 0) ? true : false}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500">Sin evaluaciones registradas.</p>
                        )}

                        <ConfirmActionModal
                            isOpen={isOpenModal}
                            onConfirm={confirmModal}
                            onCancel={closeModal}
                            message={messageModal}
                            submessage={submessageModal}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectDetailsPage;
