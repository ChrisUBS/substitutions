import React from "react";

interface ConfirmActionModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    message?: string;
    submessage?: string;
}

const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
    isOpen,
    onConfirm,
    onCancel,
    message = "¿Seguro que quieres regresar?",
    submessage = "Los cambios no guardados se perderán",
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-50 px-4 sm:px-0">
            <div className="bg-[#F5F5F5] rounded-2xl shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md text-center p-6 animate-fadeIn">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    {message}
                </h2>
                <p className="text-gray-700 mb-6">{submessage}</p>

                <div className="flex justify-center gap-6 flex-wrap">
                    <button
                        onClick={onConfirm}
                        className="bg-[#DC1818] text-white font-semibold px-8 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
                    >
                        Sí
                    </button>

                    <button
                        onClick={onCancel}
                        className="bg-black text-white font-semibold px-8 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base w-full sm:w-auto"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmActionModal;