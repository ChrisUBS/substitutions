import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faRotate } from "@fortawesome/free-solid-svg-icons";
import { categoriesService, campusService } from "../../services/api";
import type { Category, Campus  } from "../../types/Utils";

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply?: (filters: { category: number | null; level: string | null, campus: string | null, stage: string | null }) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
    isOpen,
    onClose,
    onApply,
}) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [campuses, setCampuses] = useState<Campus[]>([]);
    const [nivel, setNivel] = useState<string | null>(null);
    const [category, setCategory] = useState<string | null>(null);
    const [campus, setCampus] = useState<string | null>(null);
    const [stage, setStage] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoriesService.getAllCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        const fetchCampuses = async () => {
            try {
                const data = await campusService.getAllCampuses();
                setCampuses(data);
            } catch (error) {
                console.error("Error fetching campuses:", error);
            }
        };

        fetchCategories();
        fetchCampuses();
    }, []);

    if (!isOpen) return null;

    const handleApplyFilters = () => {
        const categoryId = (category ? Number.parseInt(category): null) 
        onApply?.({ category: categoryId, level: nivel, campus, stage });
        onClose();
    }

    const handleResetFilters = () => {
        setStage(null);
        setNivel(null);
        setCategory(null);
        setCampus(null);
        onApply?.({ category: null, level: null, campus: null, stage: null });
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-50 px-4 sm:px-0">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="bg-[#00723F] text-white text-center py-3">
                    <h2 className="text-lg sm:text-xl font-semibold">Filtrar Proyectos</h2>
                </div>

                {/* Filtros */}
                <div className="flex flex-col p-6 space-y-4">
                    {/* Filtro: Etapa */}
                    <div className="flex flex-col">
                        <label htmlFor="etapa" className="text-sm font-semibold text-gray-700 mb-1">
                            Etapa
                        </label>
                        <select
                            id="etapa"
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00723F]"
                            value={stage || ""}
                            onChange={(e) => setStage(e.target.value)}
                        >
                            <option value="">Seleccionar...</option>
                            <option value="local">Local</option>
                            <option value="estatal">Estatal</option>
                        </select>
                    </div>

                    {/* Filtro: Nivel */}
                    <div className="flex flex-col">
                        <label htmlFor="nivel" className="text-sm font-semibold text-gray-700 mb-1">
                            Nivel
                        </label>
                        <select
                            id="nivel"
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00723F]"
                            value={nivel || ""}
                            onChange={(e) => setNivel(e.target.value)}
                        >
                            <option value="">Seleccionar...</option>
                            <option value="licenciatura">Licenciatura</option>
                            <option value="posgrado">Posgrado</option>
                        </select>
                    </div>

                    {/* Filtro: Categoría */}
                    <div className="flex flex-col">
                        <label htmlFor="categoria" className="text-sm font-semibold text-gray-700 mb-1">
                            Categoría
                        </label>
                        <select
                            id="categoria"
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00723F]"
                            value={category || ""}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Seleccionar...</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Filtro: Campus */}
                    <div className="flex flex-col">
                        <label htmlFor="campus" className="text-sm font-semibold text-gray-700 mb-1">
                            Campus
                        </label>
                        <select
                            id="campus"
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00723F]"
                            value={campus || ""}
                            onChange={(e) => setCampus(e.target.value)}
                        >
                            <option value="">Seleccionar...</option>
                            {campuses.map((campus) => (
                                <option key={campus.id} value={campus.id}>
                                    {campus.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-row justify-center gap-4 p-4">
                    <button
                        type="button"
                        onClick={handleResetFilters}
                        className="bg-[#DC1818] text-white font-semibold px-8 py-2 rounded-lg hover:bg-[#B71C1C] transition-colors text-sm sm:text-base w-full sm:w-auto"
                    >
                        <FontAwesomeIcon icon={faRotate} />
                    </button>
                    <button
                        type="button"
                        onClick={handleApplyFilters}
                        className="bg-[#00723F] text-white font-semibold px-8 py-2 rounded-lg hover:bg-[#005f30] transition-colors text-sm sm:text-base w-full sm:w-auto"
                    >
                        <FontAwesomeIcon icon={faCircleCheck} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;
