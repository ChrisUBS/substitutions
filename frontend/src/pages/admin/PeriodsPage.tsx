import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { periodsService } from "../../services/api"; // Ajusta si tu servicio tiene otro nombre
import type { Period } from "../../types/Utils";
import AddPeriodModal from "../../components/modals/AddPeriodModal";

function PeriodsPage() {
    const [periods, setPeriods] = useState<Period[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Obtener períodos del backend
    useEffect(() => {
        const fetchPeriods = async () => {
            try {
                const data = await periodsService.getAllPeriods();
                
                // Ordenar los períodos para que el activo aparezca primero y luego por fecha descendente
                data.sort((a, b) => {
                    if (a.is_active && !b.is_active) return -1;
                    if (!a.is_active && b.is_active) return 1;
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                });
                setPeriods(data);
            } catch (error) {
                console.error("Error fetching periods:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPeriods();
    }, []);

    // Cambiar el estado activo de un periodo
    const togglePeriodStatus = async (periodId: string) => {
        try {
            await periodsService.togglePeriodStatus(periodId);
            window.location.reload();
        } catch (error) {
            console.error("Error toggling period status:", error);
        }
    };

    // Borrar un periodo
    const deletePeriod = async (periodId: string) => {
        if (!window.confirm("¿Estás seguro de que deseas borrar este período? Esta acción no se puede deshacer.")) {
            return;
        }

        try {
            await periodsService.deletePeriodById(periodId);
            setPeriods((prev) => prev.filter((period) => period.id !== periodId));
        } catch (error) {
            console.error("Error deleting period:", error);
        }
    };

    // Manejar el formulario del modal
    const handleAddPeriod = async (periodName: string) => {
        try {
            const newPeriod = await periodsService.createPeriod({ id: periodName });
            
            // Ordenar nuevamente los períodos después de agregar uno nuevo
            const updatedPeriods = [...periods, newPeriod];
            updatedPeriods.sort((a, b) => {
                if (a.is_active && !b.is_active) return -1;
                if (!a.is_active && b.is_active) return 1;
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });
            setPeriods(updatedPeriods);
        } catch (error) {
            console.error("Error creating period:", error);
        } finally {
            setIsAddModalOpen(false);
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar activeSection="periods" />
            <div className="flex flex-col mx-auto px-3 mt-8 w-7/8">
                <h1 className="text-4xl mb-8">Períodos</h1>

                <div className="flex justify-end mb-6">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-[#00723F] text-white font-semibold px-5 py-2 rounded-full hover:bg-green-800 transition-colors"
                    >
                        <svg className="mr-2 inline-block" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                        Añadir nuevo período
                    </button>
                </div>

                {loading ? (
                    <p className="text-gray-500 text-center">Cargando períodos...</p>
                ) : periods.length === 0 ? (
                    <p className="text-gray-500 text-center">No hay períodos registrados.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse shadow-md rounded-xl overflow-hidden">
                            <thead>
                                <tr className="bg-[#00723F] text-white">
                                    <th className="py-3 px-6 text-left font-semibold">Períodos</th>
                                    <th className="py-3 px-6 text-left font-semibold">Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {periods.map((period, index) => (
                                    <tr
                                        key={period.id}
                                        className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                                    >
                                        {/* Nombre del periodo */}
                                        <td className="py-3 px-6 text-lg font-medium text-gray-800">
                                            {period.id}
                                            {period.is_active == true && (
                                                <span className="ml-2 text-sm text-gray-500 italic">
                                                    (Periodo actual)
                                                </span>
                                            )}
                                        </td>

                                        {/* Botones de acción */}
                                        <td className="py-3 px-6 flex items-center gap-3">
                                            {/* Descargar */}
                                            <button
                                                className="bg-[#00723F] text-white px-3 py-2 rounded-full hover:bg-green-800 transition-colors"
                                                title="Descargar información del período"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    height="22"
                                                    viewBox="0 -960 960 960"
                                                    width="22"
                                                    fill="#fff"
                                                >
                                                    <path d="M480-200 280-400h120v-280h160v280h120L480-200ZM240-120q-33 0-56.5-23.5T160-200v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-120H240Z" />
                                                </svg>
                                            </button>

                                            {/* Activar / Desactivar */}
                                            {period.is_active ? (
                                                <button
                                                    onClick={() => togglePeriodStatus(period.id)}
                                                    className="bg-[#DD971A] text-white font-semibold px-4 py-2 rounded-full hover:bg-yellow-600 transition-colors"
                                                >
                                                    Desactivar
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => togglePeriodStatus(period.id)}
                                                    className="bg-[#00723F] text-white font-semibold px-4 py-2 rounded-full hover:bg-green-800 transition-colors"
                                                >
                                                    Activar
                                                </button>
                                            )}
                                            
                                            {/* Borrar */}
                                            {!period.is_active && (
                                                <button
                                                    onClick={() => deletePeriod(period.id)}
                                                    className="bg-[#DC1818] text-white font-semibold px-4 py-2 rounded-full hover:bg-red-800 transition-colors"
                                                >
                                                    Borrar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal para agregar nuevo período */}
                <AddPeriodModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSave={handleAddPeriod}
                />
            </div>
        </div>
    );
}

export default PeriodsPage;
