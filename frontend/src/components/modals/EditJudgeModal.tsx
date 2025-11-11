import React, { useState, useEffect } from "react";
import type { Judge } from "../../types/Utils";

interface EditJudgeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedJudge: Partial<Judge>) => Promise<void> | void;
    judge: Judge | null;
}

const EditJudgeModal: React.FC<EditJudgeModalProps> = ({
    isOpen,
    onClose,
    onSave,
    judge,
}) => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");

    useEffect(() => {
        if (judge) {
            setName(judge.name || "");
            setUsername(judge.username || "");
        }
    }, [judge]);

    
    if (!isOpen || !judge) return null;
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validar que los campos no estén vacíos y que no haya espacios entre palabras
        if (!name.trim() || !username.trim() || username.includes(" ")) return;

        onSave({ id: judge.id, name, username });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-50 px-4 sm:px-0">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="bg-[#00723F] text-white text-center py-3">
                    <h2 className="text-lg sm:text-xl font-semibold">Editar juez</h2>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-left font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                            Nombre del juez
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
                            Usuario o Correo Electrónico
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

export default EditJudgeModal;
