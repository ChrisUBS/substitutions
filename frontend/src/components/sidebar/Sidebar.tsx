// frontend/src/components/sidebar/Sidebar.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../states/AuthContext";
import LogoSDGKU from '../../assets/sdgku_logo.webp';

// Define the props for the Sidebar component
interface SideBarProps {
    activeSection?: 'requests' | 'accounting' | 'programs' | 'users';
}

function Sidebar({ activeSection }: SideBarProps) {
    const { logout } = useAuth();
    const [isOpen, setOpen] = useState(false);
    const [loadingLogout, setLoadingLogout] = useState(false);

    const menuItems = [
        {
            id: 'requests',
            icon: (isActive: boolean) => (
                <Link to="/admin/requests">
                    <svg
                        className="h-10 w-10 sm:h-12 sm:w-12 lg:h-[50px] lg:w-[50px] transition-transform hover:scale-110"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill={isActive ? "#FFFFFF" : "#000000"}
                    >
                        <path d="M200-200v-560 179-19 400Zm80-240h221q2-22 10-42t20-38H280v80Zm0 160h157q17-20 39-32.5t46-20.5q-4-6-7-13t-5-14H280v80Zm0-320h400v-80H280v80Zm-80 480q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v258q-14-26-34-46t-46-33v-179H200v560h202q-1 6-1.5 12t-.5 12v56H200Zm480-200q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM480-120v-56q0-24 12.5-44.5T528-250q36-15 74.5-22.5T680-280q39 0 77.5 7.5T832-250q23 9 35.5 29.5T880-176v56H480Z" />
                    </svg>
                </Link>
            )
        },
        {
            id: 'accounting',
            icon: (isActive: boolean) => (
                <Link to="/admin/accounting">
                    <svg
                        className="h-10 w-10 sm:h-12 sm:w-12 lg:h-[50px] lg:w-[50px] transition-transform hover:scale-110"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill={isActive ? "#FFFFFF" : "#000000"}
                    >
                        <path d="M200-200v-560 560Zm0 80q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v100h-80v-100H200v560h560v-100h80v100q0 33-23.5 56.5T760-120H200Zm320-160q-33 0-56.5-23.5T440-360v-240q0-33 23.5-56.5T520-680h280q33 0 56.5 23.5T880-600v240q0 33-23.5 56.5T800-280H520Zm280-80v-240H520v240h280Zm-160-60q25 0 42.5-17.5T700-480q0-25-17.5-42.5T640-540q-25 0-42.5 17.5T580-480q0 25 17.5 42.5T640-420Z" />
                    </svg>
                </Link>
            )
        },
        {
            id: 'programs',
            icon: (isActive: boolean) => (
                <Link to="/admin/programs">
                    <svg
                        className="h-10 w-10 sm:h-12 sm:w-12 lg:h-[50px] lg:w-[50px] transition-transform hover:scale-110"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill={isActive ? "#FFFFFF" : "#000000"}
                    >
                        <path d="M320-320h480v-480h-80v280l-100-60-100 60v-280H320v480Zm0 80q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm360-720h200-200Zm-200 0h480-480Z" />
                    </svg>
                </Link>
            )
        },
        {
            id: 'users',
            icon: (isActive: boolean) => (
                <Link to="/admin/users">
                    <svg
                        className="h-10 w-10 lg:h-[50px] lg:w-[50px] transition-transform hover:scale-110"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill={isActive ? "#FFFFFF" : "#000000"}
                    >
                        <path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" />
                    </svg>
                </Link>
            )
        },
    ];

    const handleSignOut = async () => {
        setLoadingLogout(true);
        try {
            await logout();
        } catch (error) {
            console.error('Error al cerrar sesión', error);
        } finally {
            setLoadingLogout(false);
        }
    };

    return (
        <div
            className={`
                flex flex-col min-h-screen z-40
                bg-white border-r border-gray-200
                justify-between py-4 sm:py-6    
                transition-all duration-300 ease-in-out
                ${isOpen ? 'w-20 sm:w-22' : 'w-14 sm:w-16'}
                md:w-24
            `}
        >
            <div className="flex flex-col gap-y-6 sm:gap-y-8 lg:gap-y-10 px-2 items-center w-full">
                {/* Menu container */}
                <div className="flex flex-col gap-y-4 sm:gap-y-5 lg:gap-y-6 items-center w-full">
                    {/* Hamburger Button*/}
                    <button
                        onClick={() => setOpen(!isOpen)}
                        className="md:hidden w-full flex justify-center p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {isOpen ? (
                            <svg
                                className="h-8 w-8 "
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                fill="#000000"
                            >
                                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                            </svg>
                        ) : (
                            <svg
                                className="h-8 w-8 "
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                fill="#000000"
                            >
                                <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
                            </svg>
                        )}
                    </button>

                    {/* Logo */}
                    <img
                        src={LogoSDGKU}
                        alt="SDGKU Logo"
                        className={`${isOpen ? "block" : "hidden"} md:block w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain`}
                    />

                    {/* Items menu */}
                    {menuItems.map((item) => {
                        const active = item.id === activeSection;
                        return (
                            <div
                                key={item.id}
                                className={`
                                    cursor-pointer transition-all duration-200
                                    ${active && 'rounded-2xl sm:rounded-3xl bg-gradient-to-b from-orange-500 to-red-600 p-1.5 sm:p-2 scale-105'}
                                    ${!isOpen ? 'hidden md:flex' : 'flex'}
                                    items-center justify-center
                                `}
                            >
                                {item.icon(active)}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Logout button */}
            <div
                className={`
                    cursor-pointer flex flex-col items-center w-full 
                    rounded-2xl p-2 transition-all
                    ${!isOpen ? 'hidden md:flex' : 'flex'}
                `}
                onClick={handleSignOut}
            >
                {loadingLogout ? (
                    <svg
                        className="animate-spin h-10 w-10 sm:h-12 sm:w-12 lg:h-[50px] lg:w-[50px] text-red-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                    </svg>
                ) : (
                    <svg
                        className="h-10 w-10 sm:h-12 sm:w-12 lg:h-[50px] lg:w-[50px] transition-transform hover:scale-110"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="#000000"
                    >
                        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
                    </svg>
                )}
            </div>
        </div>
    );
}

export default Sidebar;