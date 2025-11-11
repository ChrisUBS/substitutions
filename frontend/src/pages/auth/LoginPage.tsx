// src/pages/auth/Login.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../states/AuthContext';
import Footer from '../../components/footer/Footer';
import LogoSDGKU from '../../assets/sdgku_logo.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function LoginPage() {
    const { loading, login, user } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [color, setColor] = useState('border-gray-300');

    // Maneja el envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setColor('border-gray-300');

        try {
            await login(username, password);
        } catch (err) {
            setColor('border-red-500');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!loading && user && (user.id_role === 1 || user.id_role === 2)) {
            navigate(`/dashboard`); // Redirige al dashboard
        }
        else if (!loading && user && user.id_role === 3) {
            navigate(`/evaluations`); // Redirige a la página del evaluador
        }
    }, [loading, user, navigate]);

    // Mientras verifica sesión, muestra una pantalla de carga
    if (loading || user) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col items-center space-y-4">
                <svg className="animate-spin h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <p className="text-gray-600 text-sm">Cargando sistema...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Contenido principal centrado */}
            <main className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-2xl px-6 py-8">
                    {/* Logos */}
                    <div className="flex flex-col items-center space-y-2 mb-4">
                        <div className="flex justify-center items-center space-x-3">
                            <img
                                src={LogoSDGKU}
                                alt="Escudo UABC"
                                className="w-20 sm:w-24 md:w-28 h-auto"
                            />
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-green-700 text-center tracking-tight">
                                SDGKU
                            </h1>
                        </div>

                        <p className="text-yellow-600 text-sm sm:text-base text-center leading-tight font-bold">
                            Faculty Substitution System
                        </p>
                    </div>

                    {/* Formulario */}
                    {/* <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200"> */}
                    <div className="mx-auto max-w-xs bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Usuario
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    placeholder="Ingresa tu usuario"
                                    className={`appearance-none block w-full px-3 py-2 border ${color} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-600 focus:border-green-600 sm:text-sm`}
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        setColor("border-gray-300");
                                    }}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Contraseña
                                </label>

                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        placeholder="Ingresa tu contraseña"
                                        className={`appearance-none block w-full px-3 py-2 pr-10 border ${color} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-600 focus:border-green-600 sm:text-sm`}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setColor("border-gray-300");
                                        }}
                                    />

                                    {/* Botón para mostrar/ocultar */}
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute -inset-y-1 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    >
                                        {showPassword ? (
                                            <FontAwesomeIcon icon={faEyeSlash} />
                                        ) : (
                                            <FontAwesomeIcon icon={faEye} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 transition-all duration-200"
                            >
                                {isLoading ? (
                                    <svg
                                        className="animate-spin mx-auto h-5 w-5 text-white"
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
                                    "Iniciar Sesión"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default LoginPage;