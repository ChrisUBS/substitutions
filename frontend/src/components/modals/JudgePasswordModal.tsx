import React from "react";

interface JudgePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    judgeName: string;
    password: string;
}

const JudgePasswordModal: React.FC<JudgePasswordModalProps> = ({
    isOpen,
    onClose,
    judgeName,
    password,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-50 px-4 sm:px-0">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg overflow-hidden animate-fadeIn">

                {/* Header */}
                <div className="bg-[#00723F] text-white text-center py-3">
                    <h2 className="text-lg sm:text-xl font-semibold">Contraseña del juez</h2>
                </div>

                {/* Content */}
                <div className="p-6 text-center max-h-[90vh] overflow-y-auto">
                    <p className="font-semibold text-base sm:text-lg">Juez</p>
                    <p className="mb-3 text-gray-700 text-sm sm:text-base break-words">{judgeName}</p>

                    <p className="font-semibold text-base sm:text-lg">Contraseña</p>
                    <input
                        type="text"
                        readOnly
                        value={password}
                        className="border rounded-md w-full text-center py-2 bg-gray-100 mt-1 mb-4 text-gray-800 text-sm sm:text-base"
                    />

                    <p className="mx-5 text-xs sm:text-sm italic text-gray-600 mb-6 leading-snug">
                        No compartas esta contraseña con ninguna otra persona que no sea el juez.
                    </p>

                    <div className="flex justify-center">
                        <button
                            onClick={onClose}
                            className="bg-black text-white font-medium px-6 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm sm:text-base"
                        >
                            Cerrar
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default JudgePasswordModal;
