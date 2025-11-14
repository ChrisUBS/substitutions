import { useEffect, useState } from "react";
import { useAuth } from "../../states/AuthContext";
import Sidebar from "../../components/sidebar/Sidebar";
import { userService } from "../../services/api";
import type { UserData } from "../../types/Auth";
import type { UserForm } from "../../types/Utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faCirclePlus, faUser, faEnvelope, faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";
import ConfirmDeleteModal from "../../components/modals/admin/ConfirmDeleteModal";
import AddUserModal from "../../components/modals/admin/AddUserModal";
import EditUserModal from "../../components/modals/admin/EditUserModal";

function UsersPage() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState<UserData[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<UserData | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const usersData = await userService.getAllUsers();
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [user]);

    // Filter users based on search term
    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.id_role === 1 && "admin".includes(searchTerm.toLowerCase())) ||
        (u.id_role === 2 && "manager".includes(searchTerm.toLowerCase())) ||
        (u.id_role === 3 && "instructor".includes(searchTerm.toLowerCase())) ||
        (u.id_role === 4 && "substitute".includes(searchTerm.toLowerCase()))
    );

    // Handler for delete modal
    const handleConfirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await userService.deleteUser(userToDelete.id);
            setUsers(users.filter((u) => u.id !== userToDelete.id));
        } catch (error) {
            console.error("Error deleting user:", error);
        } finally {
            setUserToDelete(null);
            setIsDeleteModalOpen(false);
        }
    };

    // Handler for add user modal
    const handleAddUser = async (data: Partial<UserData>) => {
        try {
            await userService.createUser(data);
            setIsAddModalOpen(false);
            const updatedUsers = await userService.getAllUsers();
            setUsers(updatedUsers);
        } catch (error) {
            console.error("Error adding user:", error);
        }
    }

    // Handler for edit user modal
    const handleSaveUser = async (updatedUser: Partial<UserData>) => {
        try {
            await userService.updateUser(updatedUser.id!, updatedUser);
            setIsEditModalOpen(false);
            setUserToEdit(null);
            setUsers(users.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u)));
        } catch (error) {
            console.error("Error saving user:", error);
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar activeSection="users" />
            <div className="flex flex-col mx-auto px-3 mt-8 w-7/8">
                <h1 className="text-4xl mb-4">User Administration</h1>

                <div className="flex flex-col md:flex-row space-y-2 justify-between items-center">
                    {/* Search Bar */}
                    <div className="w-full max-w-2xs lg:max-w-sm">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for a user..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-6 py-3 pr-12 text-gray-700 bg-gray-200 rounded-full outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                                aria-label="Search"
                            >
                                <FontAwesomeIcon icon={faMagnifyingGlass} className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                    {/* Buttons */}
                    <div className="flex flex-wrap items-center justify-center md:justify-end text-xs sm:text-sm gap-2">
                        {/* Add Button */}
                        <button
                            className="text-white font-semibold bg-[#00723F] p-3 rounded-full"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} className="w-5 h-5 mr-2" />
                            Add user
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <p className="mt-5 text-gray-500 text-center">Loading users...</p>
                ) : users.length === 0 ? (
                    <p className="mt-5 text-gray-500 text-center">No users registered.</p>
                ) : null}
                <div className="overflow-y-auto space-y-4 mt-4">
                    {filteredUsers.map((userData) => (
                        <div
                            key={userData.id}
                            className="flex flex-col md:flex-row items-center justify-between bg-gray-100 rounded-xl px-6 py-4  space-y-2 md:space-y-0"
                        >
                            {/* Left section: icon + name + email */}
                            <div className="flex items-center justify-center space-x-4 w-full md:w-5/8 md:justify-start">
                                {/* Icon hidden in mobile */}
                                <div className="text-gray-500 hidden md:block">
                                    <FontAwesomeIcon icon={faUser} className="w-10 h-10" />
                                </div>

                                <div>
                                    <p className="font-semibold text-gray-800 text-center md:text-left">{userData.name}</p>
                                    <div className="flex items-center justify-center md:justify-start text-gray-600 text-sm">
                                        <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 mr-2" />
                                        {userData.email}
                                    </div>
                                </div>
                            </div>

                            {/* Role badge */}
                            <div className="w-full flex justify-center md:w-2/8 md:justify-center">
                                {userData.id_role === 1 && (
                                    <span className="bg-orange-500 text-white px-4 py-1 rounded-full">
                                        Admin
                                    </span>
                                )}
                                {userData.id_role === 2 && (
                                    <span className="bg-yellow-500 text-white px-4 py-1 rounded-full">
                                        Manager
                                    </span>
                                )}
                                {userData.id_role === 3 && (
                                    <span className="bg-red-600 text-white px-4 py-1 rounded-full">
                                        Instructor
                                    </span>
                                )}
                                {userData.id_role === 4 && (
                                    <span className="bg-green-600 text-white px-4 py-1 rounded-full">
                                        Substitute
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-center space-x-6 w-full md:w-1/8 md:justify-end">
                                {/* Delete button */}
                                {userData.id !== user?.id &&
                                    <button
                                        className="text-gray-700 hover:text-red-500"
                                        onClick={() => {
                                            setIsDeleteModalOpen(true);
                                            setUserToDelete(userData);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="w-10 h-10" />
                                    </button>
                                }
                                {/* Edit button */}
                                <button 
                                    className="text-gray-700 hover:text-blue-500"
                                    onClick={() => {
                                        setIsEditModalOpen(true);
                                        setUserToEdit(userData);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPencil} className="w-10 h-10" />
                                </button>
                            </div>
                        </div>
                    ))}
                    <div></div>
                </div>
                {/* Modals */}
                {/* Add User Modal */}
                <AddUserModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSave={handleAddUser}
                />
                {/* Confirm Delete Modal */}
                <ConfirmDeleteModal
                    isOpen={isDeleteModalOpen}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setIsDeleteModalOpen(false)}
                    message={`Are you sure you want to delete ${userToDelete?.name || "this user"}?`}
                />
                {/* Edit User Modal */}
                <EditUserModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setUserToEdit(null);
                    }}
                    onSave={handleSaveUser}
                    user={userToEdit}
                />
                
            </div>
        </div>
    );
}

export default UsersPage;