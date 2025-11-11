import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, userService, registerService, periodsService } from '../services/api';
import type { UserData, AuthContextType, RegisterData } from '../types/Auth';

// Creamos el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<string | null>(null);

    // Verificar sesión al iniciar
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const profile = await userService.getUserProfile();
                setUser(profile);
                const activePeriod = await periodsService.getActivePeriod();
                setPeriod(activePeriod);
            } catch (error) {
                // console.error('Error fetching user profile:', error);
                setUser(null);
                setPeriod(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (username: string, password: string) => {
        await authService.loginWithCredentials(username, password);
        const profile = await userService.getUserProfile();
        setUser(profile);
        const activePeriod = await periodsService.getActivePeriod();
        setPeriod(activePeriod);
        if (profile?.id_role === 1 || profile?.id_role === 2) {
            navigate(`/dashboard`, { replace: true });
        } else if (profile?.id_role === 3) {
            navigate(`/evaluations`, { replace: true });
        }
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        navigate('/', { replace: true });
    };

    const register = async (data: RegisterData) => {
        await registerService.register(data);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, period }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        // En caso de que se use fuera del proveedor
        return {
            user: null,
            loading: false,
            login: async () => { },
            logout: async () => { },
            register: async () => { },
            period: null,
        };
    }
    return context;
};