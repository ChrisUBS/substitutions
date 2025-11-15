import React, { useEffect, useState } from "react";

interface AddMaterialModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string, link: string) => Promise<void> | void;
}

const AddMaterialModal: React.FC<AddMaterialModalProps> = ({
    isOpen,
    onClose,
    onSave,
}) => {
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setTitle("");
            setLink("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate data, not input empty labels and no spaces in links
        if (!title.trim() || !link.trim() || link.includes(" ")) return;

        onSave(title, link);
        setTitle("");
        setLink("");
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[white/10] backdrop-blur-sm z-50 px-4 sm:px-0">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="bg-[#7B1315] text-white text-start px-4 py-3">
                    <h2 className="text-lg sm:text-xl font-semibold">Add Material</h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-left font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                            Material name <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="title"
                            placeholder="Enter material name..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00723F] text-sm sm:text-base"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-left font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                            Access link <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="title"
                            placeholder="Enter resource link..."
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00723F] text-sm sm:text-base"
                            required
                        />
                    </div>

                    <div className="flex justify-center gap-4 flex-wrap pt-4">
                        <button
                            type="submit"
                            className="bg-[#00723F] text-white font-semibold px-8 py-2 rounded-full hover:bg-green-800 transition-colors text-sm sm:text-base w-full sm:w-auto"
                        >
                            Confirm
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-black text-white font-semibold px-8 py-2 rounded-full hover:bg-gray-800 transition-colors text-sm sm:text-base w-full sm:w-auto"
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMaterialModal;
