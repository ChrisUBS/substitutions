import React, { useState, useEffect } from "react";
import type { Role } from "../../../types/Utils";
import type { UserData } from "../../../types/Auth";
import { roleService } from "../../../services/api";

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedUser: Partial<UserData>) => Promise<void> | void;
    user: UserData | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
    isOpen,
    onClose,
    onSave,
    user,
}) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [salary, setSalary] = useState<number | null>(null);
    const [id_role, setIdRole] = useState<number | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            setSalary(user.salary || null);
            setIdRole(user.id_role || null);
        }

        // Fetch roles for the role dropdown
        const fetchRoles = async () => {
            try {
                const fetchedRoles = await roleService.getAllRoles();
                setRoles(fetchedRoles);
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };

        fetchRoles();
    }, [user]);


    if (!isOpen || !user) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate that fields are not empty and that there are no spaces within words
        if (!name.trim() || !email.trim() || email.includes(" ") || id_role === null || (id_role === 4 && (salary === null || salary <= 0))) {
            alert("Please fill in all fields correctly.");
            return;
        }

        onSave({ id: user.id, name, email, salary: salary !== null && salary > 0 ? salary : undefined, id_role });
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-50 px-4 sm:px-0">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="bg-red-600 text-white text-center py-3">
                    <h2 className="text-lg sm:text-xl font-semibold">Edit User</h2>
                </div>
                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Full Name */}
                    <div>
                        <label className="block text-left font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00723F] text-sm sm:text-base"
                            required
                        />
                    </div>
                    {/* Email Address */}
                    <div>
                        <label className="block text-left font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                            Email Address
                        </label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00723F] text-sm sm:text-base"
                            required
                        />
                    </div>
                    {/* Salary */}
                    {id_role === 4 &&
                        <div>
                            <label className="block text-left font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                                Salary
                            </label>
                            <input
                                type="number"
                                value={salary !== null ? salary : ""}
                                onChange={(e) => setSalary(e.target.value ? Number(e.target.value) : null)}
                                className="w-full border rounded-md px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00723F] text-sm sm:text-base"
                                required
                            />
                        </div>
                    }
                    {/* Role Selection */}
                    <div>
                        <label className="block text-left font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                            Role
                        </label>
                        <select
                            value={id_role !== null ? id_role : ""}
                            onChange={(e) => setIdRole(Number(e.target.value))}
                            className="w-full border rounded-md px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00723F] text-sm sm:text-base"
                            required
                        >
                            <option value="" disabled>
                                Select a role
                            </option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Action Buttons */}
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

export default EditUserModal;
