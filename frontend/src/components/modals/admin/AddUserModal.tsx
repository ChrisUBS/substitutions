import React, { useEffect, useState } from "react";
import type { Role } from "../../../types/Utils";
import type { UserData } from "../../../types/Auth";
import { roleService } from "../../../services/api";

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<UserData>) => Promise<void> | void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
    isOpen,
    onClose,
    onSave,
}) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [salary, setSalary] = useState<number | null>(null);
    const [id_role, setIdRole] = useState<number | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
        if (!isOpen) {
            setName("");
            setEmail("");
            setSalary(null);
            setIdRole(null);
        }

        const fetchRoles = async () => {
            try {
                const rolesData = await roleService.getAllRoles();
                setRoles(rolesData);
                if (rolesData.length > 0) {
                    setIdRole(rolesData[0].id as unknown as number);
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };

        fetchRoles();
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check required fields
        if (!name.trim() || !email.trim() || email.includes(" ") || id_role === null || (id_role === 4 && (salary === null || salary <= 0))) {
            alert("Please fill in all fields correctly.");
            return;
        }

        onSave({ name, email, salary: salary !== null && salary > 0 ? salary : null, id_role: id_role });
        setName("");
        setEmail("");
        setSalary(null);
        setIdRole(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-50 px-4 sm:px-0">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="bg-red-600 text-white text-center py-3">
                    <h2 className="text-lg sm:text-xl font-semibold">Add User</h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-left font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                            Full Name <span className="text-red-600">*</span>
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
                            Email <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00723F] text-sm sm:text-base"
                            required
                        />
                    </div>

                    {id_role === 4 && (
                        <div>
                            <label className="block text-left font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                                Salary <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="number"
                                value={salary !== null ? salary : ""}
                                onChange={(e) => setSalary(e.target.value ? Number(e.target.value) : null)}
                                className="w-full border rounded-md px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00723F] text-sm sm:text-base"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-left font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                            Role <span className="text-red-600">*</span>
                        </label>
                        <select
                            value={id_role !== null ? id_role : ""}
                            onChange={(e) => setIdRole(Number(e.target.value))}
                            className="w-full border rounded-md px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00723F] text-sm sm:text-base"
                            required
                        >
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-center gap-4 flex-wrap pt-4">
                        <button
                            type="submit"
                            className="bg-[#00723F] text-white font-semibold px-8 py-2 rounded-lg hover:bg-green-800 transition-colors text-sm sm:text-base w-full sm:w-auto"
                        >
                            Save
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-black text-white font-semibold px-8 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base w-full sm:w-auto"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;
