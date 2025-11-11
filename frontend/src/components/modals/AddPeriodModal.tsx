import React, { useState, useEffect } from "react";
import type { Period } from "../../types/Utils";
import { periodsService } from "../../services/api";

interface AddPeriodModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (periodName: string) => Promise<void> | void;
}

const AddPeriodModal: React.FC<AddPeriodModalProps> = ({
    isOpen,
    onClose,
    onSave,
}) => {
    const [periodName, setPeriodName] = useState("");
    const [error, setError] = useState("");
    const [periods, setPeriods] = useState<Period[]>([]);

    useEffect(() => {
        // Resetear estado al cerrar el modal
        if (!isOpen) {
            setPeriodName("");
            setError("");
        }

        // Obtener todos los períodos
        const fetchPeriods = async () => {
            try {
                const data = await periodsService.getAllPeriods();
                setPeriods(data);
            } catch (error) {
                console.error("Error fetching periods:", error);
            }
        };

        fetchPeriods();
    }, [isOpen]);

    if (!isOpen) return null;

    // Validar formato del periodo (ejemplo: 2025-2)
    const validatePeriod = (value: string) => {
        const regex = /^\d{4}-[1-2]$/;
        return regex.test(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!periodName.trim()) {
            setError("El campo no puede estar vacío.");
            return;
        }
        if (!validatePeriod(periodName.trim())) {
            setError("Formato inválido. Ejemplo correcto: 2025-2");
            return;
        }

        // Verificar si el período ya existe o si es menor al último período
        const existingPeriods = periods.map((p) => p.id);
        if (existingPeriods.includes(periodName.trim())) {
            setError("El período ya existe.");
            return;
        }

        const sortedPeriods = [...periods].sort((a, b) => {
            const [yearA, termA] = a.id.split("-").map(Number);
            const [yearB, termB] = b.id.split("-").map(Number);
            if (yearA !== yearB) return yearB - yearA;
            return termB - termA;
        });

        if (sortedPeriods.length > 0) {
            const [lastYear, lastTerm] = sortedPeriods[0].id
                .split("-")
                .map(Number);
            const [newYear, newTerm] = periodName
                .trim()
                .split("-")
                .map(Number);

            if (
                newYear < lastYear ||
                (newYear === lastYear && newTerm <= lastTerm)
            ) {
                setError(
                    `El nuevo período debe ser mayor que el último período existente (${sortedPeriods[0].id}).`
                );
                return;
            }
        }

        // Llamar a la función onSave pasada como prop
        onSave(periodName.trim());
        setPeriodName("");
        setError("");
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-50 px-4 sm:px-0">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="bg-[#00723F] text-white text-center py-3">
                    <h2 className="text-lg sm:text-xl font-semibold">Agregar periodo</h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-left font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                            Periodo <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            value={periodName}
                            onChange={(e) => {
                                setPeriodName(e.target.value);
                                if (error) setError("");
                            }}
                            placeholder="Ejemplo: 2025-2"
                            className={`w-full border rounded-md px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 text-sm sm:text-base ${error ? "border-red-500 focus:ring-red-400" : "focus:ring-[#00723F]"
                                }`}
                            required
                        />
                        {error && (
                            <p className="text-red-600 text-sm mt-1 text-left">{error}</p>
                        )}
                    </div>

                    <div className="flex justify-center gap-4 flex-wrap pt-4">
                        <button
                            type="submit"
                            className="bg-[#00723F] text-white font-semibold px-8 py-2 rounded-lg hover:bg-green-800 transition-colors text-sm sm:text-base w-full sm:w-auto"
                        >
                            Guardar
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-black text-white font-semibold px-8 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base w-full sm:w-auto"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPeriodModal;