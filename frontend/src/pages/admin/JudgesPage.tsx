// src/pages/admin/JudgeAdminPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../states/AuthContext';
import type { Judge, JudgeForm } from "../../types/Utils";
import { judgesService } from "../../services/api";
import Sidebar from "../../components/sidebar/Sidebar";
import Card from "../../components/shared/Card";
import { Icons } from "../../components/shared/Icons";
// Modals
import JudgePasswordModal from "../../components/modals/JudgePasswordModal";
import ConfirmDeleteModal from "../../components/modals/ConfirmDeleteModal";
import EditJudgeModal from "../../components/modals/EditJudgeModal";
import AddJudgeModal from "../../components/modals/AddJudgeModal";

function JudgesPage() {
    const { loading, period } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [judges, setJudges] = useState<Judge[]>([]);
    const [selectedJudge, setSelectedJudge] = useState<Judge | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [judgeToDelete, setJudgeToDelete] = useState<Judge | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [judgeToEdit, setJudgeToEdit] = useState<Judge | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [loadingExport, setLoadingExport] = useState(false);

    useEffect(() => {
        // No llamar al backend si todavía se está cargando el contexto
        if (loading || !period) return;

        const fetchJudges = async () => {
            try {
                setIsLoading(true);
                const data = await judgesService.getJudgesByPeriod(period);
                setJudges(data);
            } catch (error) {
                console.error("Error fetching judges:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJudges();
    }, [loading, period]);

    // Filtrar jueces según el término de búsqueda y ordenar alfabéticamente
    const filteredJudges = judges.filter((judge) =>
        judge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        judge.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    filteredJudges.sort((a, b) => a.name.localeCompare(b.name));

    // Funciones para manejar el modal de agregar juez
    const handleAddJudge = async (data: JudgeForm) => {
        try {
            const newJudge = await judgesService.createJudge(data);
            setJudges((prev) => [...prev, newJudge]);
        } catch (error) {
            console.error("Error creating judge:", error);
        } finally {
            setIsAddModalOpen(false);
        }
    };

    // Funciones para manejar el modal de contraseña
    const handleShowPassword = (judge: Judge) => {
        setSelectedJudge(judge);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedJudge(null);
    };

    // Funciones para manejar el modal de confirmación de eliminación
    const handleDeleteClick = (judge: Judge) => {
        setJudgeToDelete(judge);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!judgeToDelete) return;

        try {
            // Llamar al servicio para eliminar al juez
            await judgesService.deleteJudgeById(judgeToDelete.id);

            // Actualizar la lista en el estado local
            setJudges((prevJudges) => prevJudges.filter((j) => j.id !== judgeToDelete.id));
        } catch (error) {
            console.error("Error deleting judge:", error);
        } finally {
            setIsDeleteModalOpen(false);
            setJudgeToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setJudgeToDelete(null);
    };

    // Funciones para manejar el modal de edición
    const handleEditClick = (judge: Judge) => {
        setJudgeToEdit(judge);
        setIsEditModalOpen(true);
    };

    const handleExportClick = async (periodId: string) => {
        try {
            setLoadingExport(true);
            await judgesService.exportJudgeByPeriod(periodId);
        } catch (error) {
            console.error("Error exporting judges:", error);
        }
        finally {
            setLoadingExport(false);
        }
    }

    const handleSaveJudge = async (updatedJudge: Partial<Judge>) => {
        if (!updatedJudge.id) return;
        try {
            // Llamar al servicio para actualizar al juez
            await judgesService.editJudgeById(updatedJudge.id, {
                name: updatedJudge.name ?? null,
                username: updatedJudge.username ?? null,
                id_period: period ?? null,
            });

            // Actualiza la lista local
            setJudges((prev) =>
                prev.map((j) => (j.id === updatedJudge.id ? { ...j, ...updatedJudge } : j))
            );
        } catch (error) {
            console.error("Error updating judge:", error);
        } finally {
            setIsEditModalOpen(false);
            setJudgeToEdit(null);
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar activeSection="judges" />
            <div className="flex flex-col mx-auto px-3 mt-8 w-7/8">
                <h1 className="text-4xl mb-8">Jueces</h1>
                {period ? (
                    <>
                        <div className="flex flex-col md:flex-row space-y-2 justify-between items-center">
                            {/* Barra de búsqueda */}
                            <div className="w-full max-w-2xs lg:max-w-sm">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Buscar un juez..."
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
                            {/* Botones */}
                            <div className="flex flex-wrap items-center justify-center md:justify-end text-xs sm:text-sm gap-2">
                                {/* Botón Desasignar */}
                                <button className="text-white font-medium bg-[#00723F] p-3 rounded-full" onClick={() => navigate('/judges/deassign-projects')}>
                                    <svg className="mr-2 inline-block" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m770-302-60-62q40-11 65-42.5t25-73.5q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 57-29.5 105T770-302ZM634-440l-80-80h86v80h-6ZM792-56 56-792l56-56 736 736-56 56ZM440-280H280q-83 0-141.5-58.5T80-480q0-69 42-123t108-71l74 74h-24q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h65l79 80H320Z"/></svg>
                                    Desasignar proyectos
                                </button>
                                {/* Botón Asignar */}
                                <button className="text-white font-medium bg-[#00723F] p-3 rounded-full" onClick={() => navigate('/judges/assign-projects')}>
                                    <svg className="mr-2 inline-block" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z" /></svg>
                                    Asignar proyectos
                                </button>
                                {/* Línea divisoria (solo visible en desktop) */}
                                <div className="border-l border-black/50 h-8 self-center block"></div>
                                {/* Botón Exportar */}
                                <button
                                    title="Exportar jueces"
                                    className="text-white font-medium bg-[#00723F] p-3 rounded-full"
                                    onClick={() => handleExportClick(period)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m720-120 160-160-56-56-64 64v-167h-80v167l-64-64-56 56 160 160ZM560 0v-80h320V0H560ZM240-160q-33 0-56.5-23.5T160-240v-560q0-33 23.5-56.5T240-880h280l240 240v121h-80v-81H480v-200H240v560h240v80H240Zm0-80v-560 560Z"/></svg>
                                </button>
                                {/* Botón Añadir */}
                                <button
                                    className="text-white font-medium bg-[#00723F] p-3 rounded-full"
                                    onClick={() => setIsAddModalOpen(true)}
                                >
                                    <svg className="mr-2 inline-block" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                                    Añadir juez
                                </button>
                            </div>
                        </div>

                        {isLoading ? (
                            <p className="mt-10 text-gray-500 text-center">Cargando jueces...</p>
                        ) : judges.length === 0 ? (
                            <p className="mt-10 text-gray-500 text-center">No hay jueces registrados en este periodo.</p>
                        ) : null}
                        <div className="overflow-y-auto space-y-4 mt-4">
                            {filteredJudges.map((judge, index) => (
                                <Card
                                    key={index}
                                    title={judge.name}
                                    subtitle={judge.username}
                                    actions={[
                                        {
                                            label: "Contraseña",
                                            icon: Icons.Password,
                                            click: () => handleShowPassword(judge),
                                            bgColor: "bg-[#00723F]"
                                        },
                                        {
                                            label: "Editar",
                                            icon: Icons.Edit,
                                            click: () => handleEditClick(judge),
                                            bgColor: "bg-[#DD971A]"
                                        },
                                        {
                                            label: "Borrar",
                                            icon: Icons.Delete,
                                            click: () => handleDeleteClick(judge),
                                            bgColor: "bg-[#DC1818]"
                                        }
                                    ]}
                                    statusEvaluation={judge.total_projects !== undefined ? `${judge.evaluated_projects}/${judge.total_projects}` : ""}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <p className="mt-10 text-gray-500 text-center">Activa un periodo para gestionar los jueces.</p>
                )}

                {/* Modal */}
                {selectedJudge && (
                    <JudgePasswordModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        judgeName={selectedJudge.name}
                        password={selectedJudge.password_plain || "No disponible"}
                    />
                )}
                {/* Confirm Delete Modal */}
                <ConfirmDeleteModal
                    isOpen={isDeleteModalOpen}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    message={`¿Quieres eliminar a ${judgeToDelete?.name || "este juez"}?`}
                />
                {/* Edit Judge Modal */}
                <EditJudgeModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setJudgeToEdit(null);
                    }}
                    onSave={handleSaveJudge}
                    judge={judgeToEdit}
                />
                {/* Add Judge Modal */}
                <AddJudgeModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSave={handleAddJudge}
                />
                {/* Modal de espera para exportar a los jueces */}
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

export default JudgesPage;