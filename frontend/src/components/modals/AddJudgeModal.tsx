import React, { useEffect, useState } from "react";
import type { JudgeForm } from "../../types/Utils";
import { useAuth } from '../../states/AuthContext';

interface AddJudgeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: JudgeForm) => Promise<void> | void;
}

const AddJudgeModal: React.FC<AddJudgeModalProps> = ({
    isOpen,
    onClose,
    onSave,
}) => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const { period } = useAuth();

    useEffect(() => {
        if (!isOpen) {
            setName("");
            setUsername("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validar que los campos no estén vacíos y que no haya espacios entre palabras
        if (!name.trim() || !username.trim() || username.includes(" ")) return;

        onSave({ name, username, id_period: period || null });
        setName("");
        setUsername("");
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-50 px-4 sm:px-0">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="bg-[#00723F] text-white text-center py-3">
                    <h2 className="text-lg sm:text-xl font-semibold">Agregar juez</h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-left font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                            Nombre del juez <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00723F] text-sm sm:text-base"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-left font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                            Usuario o Correo Electrónico <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00723F] text-sm sm:text-base"
                            required
                        />
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

export default AddJudgeModal;
