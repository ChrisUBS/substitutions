import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../states/AuthContext";

interface SideBarProps {
    activeSection?: 'dashboard' | 'judges' | 'projects' | 'periods' | 'help';
}
function Sidebar({ activeSection }: SideBarProps) {
    const { logout } = useAuth();
    const [isOpen, setOpen] = useState(false);
    const [loadingLogout, setLoadingLogout] = useState(false);
    const menuItems = [
        {
            id: 'dashboard',
            icon: () => (
                <Link to="/dashboard">
                    <svg className="h-[50px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFFFFF">
                        <path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" />
                    </svg>
                </Link>
            )
        },
        {
            id: 'judges',
            icon: () => (
                <Link to="/judges">
                    <svg className="h-[50px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFFFFF">
                        <path d="M160-120v-80h480v80H160Zm226-194L160-540l84-86 228 226-86 86Zm254-254L414-796l86-84 226 226-86 86Zm184 408L302-682l56-56 522 522-56 56Z" />
                    </svg>
                </Link>
            )
        },
        {
            id: 'projects',
            icon: () => (
                <Link to="/projects">
                    <svg className="h-[50px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFFFFF">
                        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q14-36 44-58t68-22q38 0 68 22t44 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm280-670q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM200-246q54-53 125.5-83.5T480-360q83 0 154.5 30.5T760-246v-514H200v514Zm280-194q58 0 99-41t41-99q0-58-41-99t-99-41q-58 0-99 41t-41 99q0 58 41 99t99 41ZM280-200h400v-10q-42-35-93-52.5T480-280q-56 0-107 17.5T280-210v10Zm200-320q-25 0-42.5-17.5T420-580q0-25 17.5-42.5T480-640q25 0 42.5 17.5T540-580q0 25-17.5 42.5T480-520Zm0 17Z" />
                    </svg>
                </Link>
            )
        },
        {
            id: 'periods',
            icon: () => (
                <Link to="/periods">
                    <svg className="h-[50px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFFFFF">
                        <path d="M320-400q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm160 0q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm160 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z" />
                    </svg>
                </Link>
            )
        },
        {
            id: 'help',
            icon: () => (
                <Link to="/help">
                    <svg className="h-[50px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFFFFF">
                        <path d="M480-40q-112 0-206-51T120-227v107H40v-240h240v80h-99q48 72 126.5 116T480-120q75 0 140.5-28.5t114-77q48.5-48.5 77-114T840-480h80q0 91-34.5 171T791-169q-60 60-140 94.5T480-40ZM40-480q0-91 34.5-171T169-791q60-60 140-94.5T480-920q112 0 206 51t154 136v-107h80v240H680v-80h99q-48-72-126.5-116T480-840q-75 0-140.5 28.5t-114 77q-48.5 48.5-77 114T120-480H40Zm440 240q21 0 35.5-14.5T530-290q0-21-14.5-36T480-341q-21 0-35.5 14.5T430-291q0 21 14.5 36t35.5 15Zm-36-152h73q0-36 8.5-54t34.5-44q35-35 46.5-56.5T618-598q0-56-40-89t-98-33q-50 0-86 26t-52 74l66 28q7-26 26.5-43t45.5-17q27 0 45.5 15.5T544-595q0 17-8 34t-34 40q-33 29-45.5 56.5T444-392Z" />
                    </svg>
                </Link>
            )
        }
    ];

    // Función para manejar el cierre de sesión
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
        <>
            {/* Sidebar */}
            <div
                className={`
                    flex flex-col min-h-screen lg:relative z-40
                    bg-[#00723F] border-r-8 border-r-[#FEBE10] 
                    justify-between py-6 
                    transition-all duration-300 ease-in-out
                    ${isOpen ? 'max-w-24    ' : 'max-w-10'}
                    lg:max-w-24
                `}
            >

                <div className="flex flex-col gap-y-5 items-center w-full">
                    {/* Botón para abrir y cerrar el menú */}
                    <button
                        onClick={() => setOpen(!isOpen)}
                        className="lg:hidden w-full flex justify-center"
                    >
                        {isOpen ? (
                            <svg className="h-[30px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3">
                                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                            </svg>
                        ) : (
                            <svg className="h-[30px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3">
                                <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
                            </svg>
                        )}
                    </button>

                    {/* Elementos del menú, sólo visibles cuando se abre */}
                    {menuItems.map((item) => {
                        const active = item.id === activeSection;
                        return (
                            <div
                                key={item.id}
                                className={`cursor-pointer ${active && 'rounded-l-full bg-[#FEBE10] p-2 w-full'}  ${!isOpen ? 'hidden lg:block' : ''}`}
                            >
                                {item.icon()}
                            </div>
                        );

                    })}
                </div>

                {/* Logout */}
                <div className={`cursor-pointer flex flex-col items-center w-full ${!isOpen ? 'hidden lg:flex' : ''}`} onClick={handleSignOut}>
                    {loadingLogout ? (
                        <svg
                            className="animate-spin mx-auto h-8 w-8 text-white-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-50"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="white"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="white"
                                d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                        </svg>
                    ) : (
                        <svg className="h-[50px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFFFFF">
                            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
                        </svg>
                    )}
                </div>
            </div>
        </>
    );
}

export default Sidebar;