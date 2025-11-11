import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../states/AuthContext";
import { projectsService, categoriesService, teamMembersService, rolesService, campusService } from "../../../services/api";
import type { Project, Category, TeamMember, Role, Campus } from "../../../types/Utils";
import Sidebar from "../../../components/sidebar/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
// Modals
import ConfirmActionModal from "../../../components/modals/ConfirmActionModal";
import ConfirmDeleteModal from "../../../components/modals/ConfirmDeleteModal";

function AddEditProjectsPage() {
    const { id } = useParams();
    const { period } = useAuth();
    const navigate = useNavigate();
    const isEditMode = Boolean(id) && id !== "add";
    // Información de la DB
    const [projectData, setProjectData] = useState<Project | null>(null);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [campuses, setCampuses] = useState<Campus[]>([]);
    // Estados para manejar el formulario de integrantes
    const [newMember, setNewMember] = useState<TeamMember | null>(null);
    const [newTeamMembers, setNewTeamMembers] = useState<TeamMember[]>([]);
    // Estados para manejar los modales
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

    // Cargar datos iniciales
    useEffect(() => {
        const fetchProjectData = async () => {
            // Verifica si id está definido
            if (!id) return;

            // Llama al servicio para obtener datos del proyecto
            try {
                const project = await projectsService.getProjectById(parseInt(id));
                setProjectData(project);
                const members = await teamMembersService.getTeamMembersByProjectId(parseInt(id));
                setTeamMembers(members);
            } catch (error) {
                console.error("Error fetching project data:", error);
                navigate("/projects"); // Redirige si hay un error
            }
        };

        const fetchCategories = async () => {
            try {
                const cats = await categoriesService.getAllCategories();
                setCategories(cats);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        const fetchRoles = async () => {
            try {
                const roles = await rolesService.getAllRoles();
                // Borrar las primeras 3 posiciones (Admin, Juez, Coordinador)
                const filteredRoles = roles.slice(3);
                setRoles(filteredRoles);
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };

        const fetchCampuses = async () => {
            try {
                const campuses = await campusService.getAllCampuses();
                setCampuses(campuses);
            } catch (error) {
                console.error("Error fetching campuses:", error);
            }
        };

        fetchProjectData();
        fetchCategories();
        fetchRoles();
        fetchCampuses();

        // Si no es modo edición, inicializa el estado del proyecto
        if (!isEditMode && !projectData && period) {
            setProjectData({
                title: "",
                id_campus: 0,
                id_category: 0,
                level: "",
                id_period: period,
            });
        }
    }, [id, period]);

    // Guardar información en la DB
    const handleSave = async () => {
        if (!projectData) return;

        // Validar campos obligatorios
        if (!projectData.title || !projectData.id_category || !projectData.level || !projectData.id_campus || !projectData.faculty || teamMembers.length === 0) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }

        try {
            let projectId = projectData.id;

            if (isEditMode && projectId) {
                // Editar proyecto existente
                await projectsService.updateProjectById(projectId, projectData);
            } else {
                // Crear proyecto nuevo
                const createdProject = await projectsService.createProject(projectData);

                // Guarda el nuevo id en variable y en el estado
                projectId = createdProject.id;
                setProjectData((prev) => {
                    if (prev) {
                        return {
                            ...prev,
                            id: createdProject.id,
                        };
                    }
                    // Fallback: use the createdProject as a full Project when prev is null
                    return createdProject as Project;
                });
            }

            // Asignar id_project a los nuevos miembros
            const updatedMembers = newTeamMembers.map((member) => ({
                ...member,
                id_project: projectId,
            }));
            setNewTeamMembers(updatedMembers);

            // Crear cada miembro en la DB (esperando secuencialmente o en paralelo)
            await Promise.all(updatedMembers.map((member) => teamMembersService.addTeamMember(member)));

            // Redirigir
            navigate("/projects");
        } catch (error) {
            console.error("Error saving project data:", error);
        }
    };

    // Funciones para manejar el modal de confirmación de regresar
    const handleGoBackClick = () => {
        // Verificar que no haya nuevos integrantes sin guardar
        if (newTeamMembers.length >= 1) {
            alert("Por favor, guarda o elimina los nuevos integrantes antes de salir.");
            setIsDeleteModalOpen(false);
            return;
        }

        // Verificar si no hay integrantes
        if (isEditMode && teamMembers.length === 0) {
            alert("Por favor, completa todos los campos obligatorios.");
            setIsModalOpen(false);
            return;
        }

        setIsModalOpen(true);
    };

    const handleGoBack = async () => {
        setIsModalOpen(false);
        navigate("/projects");
    };

    const handleCancelGoBack = () => {
        setIsModalOpen(false);
    };

    // Funciones para manejar el modal de confirmación de borrar integrante
    const handleConfirmDeleteClick = (member: TeamMember) => {
        // Verificar que no quede solo un integrante
        if (teamMembers.length <= 1 && isEditMode) {
            alert("El proyecto debe tener al menos un integrante.");
            setIsDeleteModalOpen(false);
            setMemberToDelete(null);
            return;
        }

        setMemberToDelete(member);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteMember = async () => {
        if (!memberToDelete) return;

        if (!memberToDelete.id) {
            setTeamMembers((prev) => prev.filter((m) => m.email !== memberToDelete.email));
            setNewTeamMembers((prev) => prev.filter((m) => m.email !== memberToDelete.email));
            setIsDeleteModalOpen(false);
            setMemberToDelete(null);
            return;
        }

        try {
            await teamMembersService.removeTeamMemberById(memberToDelete.id);
            setTeamMembers((prev) => prev.filter((m) => m.id !== memberToDelete.id));
            setIsDeleteModalOpen(false);
            setMemberToDelete(null);
        } catch (error) {
            console.error("Error deleting team member:", error);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setMemberToDelete(null);
    };


    // Funciones para manejar el modal de agregar integrante
    const handleAddMember = () => {
        if (!newMember) return;

        // Validar que los campos no estén vacíos
        if (!newMember.name || !newMember.email || !newMember.id_role) {
            alert("Por favor, completa todos los campos del integrante.");
            return;
        }

        // Validar formato de correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newMember.email)) {
            alert("Por favor, ingresa un correo electrónico válido.");
            return;
        }

        // Validar que no se repita el correo electrónico
        const emailExists = teamMembers.some((member) => member.email === newMember.email);
        if (emailExists) {
            alert("El correo electrónico ya está registrado como integrante del proyecto.");
            return;
        }

        // Guardar el nuevo integrante
        setTeamMembers((prev) => [...prev, newMember]);
        setNewTeamMembers((prev) => [...prev, newMember]);

        // Limpiar los campos manteniendo el id_role
        setNewMember((prev) => ({
            name: "",
            email: "",
            id_role: prev?.id_role
        }));
    };

    return (
        <div className="flex h-screen">
            <Sidebar activeSection="projects" />
            <div className="flex flex-col mx-auto px-3 mt-8 w-7/8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold">
                        {isEditMode ? "Editar proyecto" : "Agregar proyecto"}
                    </h1>

                    <div className="flex gap-3">
                        <button
                            onClick={handleGoBackClick}
                            className="bg-[#DC1818] text-white px-5 py-2 rounded-full font-medium hover:bg-red-700 transition-colors"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                            Cancelar
                        </button>

                        <button
                            onClick={handleSave}
                            className="bg-[#00723F] text-white px-5 py-2 rounded-full font-medium hover:bg-green-800 transition-colors"
                        >
                            <FontAwesomeIcon icon={faFloppyDisk} />
                            Guardar
                        </button>
                    </div>
                </div>

                {/* --- FORMULARIO PRINCIPAL --- */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Nombre del proyecto */}
                        <div>
                            <label className="block font-semibold mb-1">
                                Nombre del proyecto <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={projectData?.title || ""}
                                onChange={(e) =>
                                    setProjectData((prev) => ({
                                        ...(prev as Project),
                                        title: e.target.value,
                                    }))
                                }
                                className="w-full border rounded-md bg-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00723F]"
                                placeholder="Ejemplo de nombre de proyecto"
                            />
                        </div>

                        {/* Nivel */}
                        <div>
                            <label className="block font-semibold mb-1">
                                Nivel <span className="text-red-600">*</span>
                            </label>
                            <select
                                name="level"
                                value={projectData?.level || ""}
                                onChange={(e) =>
                                    setProjectData((prev) => ({
                                        ...(prev as Project),
                                        level: e.target.value,
                                    }))
                                }
                                className="w-full border rounded-md bg-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00723F]"
                            >
                                <option value="">Selecciona un nivel</option>
                                <option value="licenciatura">Licenciatura</option>
                                <option value="posgrado">Posgrado</option>
                            </select>
                        </div>

                        {/* Categoría */}
                        <div>
                            <label className="block font-semibold mb-1">
                                Categoría <span className="text-red-600">*</span>
                            </label>
                            <select
                                name="id_category"
                                value={projectData?.id_category || ""}
                                onChange={(e) =>
                                    setProjectData((prev) => ({
                                        ...(prev as Project),
                                        id_category: parseInt(e.target.value),
                                    }))
                                }
                                className="w-full border rounded-md bg-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00723F]"
                            >
                                <option value="">Selecciona una categoría</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Campus */}
                        <div>
                            <label className="block font-semibold mb-1">
                                Campus <span className="text-red-600">*</span>
                            </label>
                            <select
                                name="id_campus"
                                value={projectData?.id_campus || ""}
                                onChange={(e) =>
                                    setProjectData((prev) => ({
                                        ...(prev as Project),
                                        id_campus: parseInt(e.target.value),
                                    }))
                                }
                                className="w-full border rounded-md bg-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00723F]"
                            >
                                <option value="">Selecciona un campus</option>
                                {campuses.map((campus) => (
                                    <option key={campus.id} value={campus.id}>
                                        {campus.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Facultad */}
                        <div>
                            <label className="block font-semibold mb-1">
                                Facultad <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                name="faculty"
                                value={projectData?.faculty || ""}
                                onChange={(e) =>
                                    setProjectData((prev) => ({
                                        ...(prev as Project),
                                        faculty: e.target.value,
                                    }))
                                }
                                className="w-full border rounded-md bg-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00723F]"
                                placeholder="Facultad de origen"
                            />
                        </div>
                    </div>

                    <hr className="border-gray-300 my-4" />

                    {/* --- INTEGRANTES --- */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-3">Integrantes <span className="text-red-600">*</span></h2>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-4">
                            <div>
                                <label className="block font-semibold mb-1">Nombre completo</label>
                                <input
                                    type="text"
                                    value={newMember?.name}
                                    onChange={(e) =>
                                        setNewMember((prev) => ({
                                            ...(prev as TeamMember),
                                            name: e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded-md bg-gray-100 px-3 py-2 focus:ring-2 focus:ring-[#00723F]"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">Correo electrónico</label>
                                <input
                                    type="email"
                                    value={newMember?.email}
                                    onChange={(e) =>
                                        setNewMember((prev) => ({
                                            ...(prev as TeamMember),
                                            email: e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded-md bg-gray-100 px-3 py-2 focus:ring-2 focus:ring-[#00723F]"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">Rol</label>
                                <select
                                    value={newMember?.id_role}
                                    onChange={(e) =>
                                        setNewMember((prev) => ({
                                            ...(prev as TeamMember),
                                            id_role: parseInt(e.target.value, 10),
                                        }))
                                    }
                                    className="w-full border rounded-md bg-gray-100 px-3 py-2 focus:ring-2 focus:ring-[#00723F]"
                                >
                                    <option value="">Selecciona un rol</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddMember}
                                className="bg-[#00723F] text-white font-semibold px-5 py-2 rounded-full hover:bg-green-800 transition-colors h-[42px]"
                            >
                                + Agregar
                            </button>
                        </div>

                        {/* Lista de integrantes */}
                        <div className="space-y-2">
                            {teamMembers.map((member, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-100 flex justify-between items-center px-4 py-3 rounded-lg"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {member.name} - {roles.find(role => Number(role.id) === member.id_role)?.name}
                                        </p>
                                        <p className="text-sm text-gray-600">{member.email}</p>
                                    </div>
                                    <button
                                        onClick={() => handleConfirmDeleteClick(member)}
                                        className="bg-[#DC1818] text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Borrar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Confirm Delete Modal */}
                <ConfirmActionModal
                    isOpen={isModalOpen}
                    onConfirm={handleGoBack}
                    onCancel={handleCancelGoBack}
                />
                {/* Confirm Delete Modal */}
                <ConfirmDeleteModal
                    isOpen={isDeleteModalOpen}
                    onConfirm={handleDeleteMember}
                    onCancel={handleCancelDelete}
                    message={`¿Quieres eliminar a ${memberToDelete?.name || "este integrante"}?`}
                />
            </div>
        </div>
    );
}

export default AddEditProjectsPage;