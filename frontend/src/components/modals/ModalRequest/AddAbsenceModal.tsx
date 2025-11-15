import React, { useEffect, useState } from "react";

interface AddAbsenceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data:string, type:number) => Promise<void> | void;
}

const AddAbsenceModal: React.FC<AddAbsenceModalProps> = ({
    isOpen,
    onClose,
    onSave,
}) => {
    const [date, setDate] = useState("");
    const [type, setType] = useState<number>(0);

    useEffect(() => {
        if (!isOpen) {
            setDate("");
            setType(0);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate empty data
        if (!date.trim() || !type || type===0) return;

        onSave( date, type );
        setDate("");
        setType(0);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[white/10] backdrop-blur-sm z-50 px-4 sm:px-0">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="bg-[#7B1315] text-white text-start px-4 py-3">
                    <h2 className="text-lg sm:text-xl font-semibold">Add date</h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-left font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                            Abstance date <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="date"
                            placeholder="Select date..."
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00723F] text-sm sm:text-base"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-left font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                            Absence Type <span className="text-red-600">*</span>
                        </label>
                        <select 
                            title="type-select"
                            value={type}
                            onChange={(e) => setType(Number(e.target.value))}
                            className="px-4 w-full py-3 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            required={true}
                        >
                            <option value={0} disabled>
                                Select a type..
                            </option>
                            <option value={0.5}>
                                30 minutes
                            </option>
                            <option value={1}>
                                1 hour
                            </option>
                            <option value={2}>
                                2 hours
                            </option>
                            <option value={3}>
                                3 hours
                            </option>
                        </select>
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

export default AddAbsenceModal;
