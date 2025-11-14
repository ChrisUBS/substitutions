import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, userService } from '../services/api';
import type { UserData, AuthContextType } from '../types/Auth';

// Create the Auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    // Check session on start
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const profile = await userService.getUserProfile();
                setUser(profile);
            } catch (error) {
                // console.error('Error fetching user profile:', error);
                setUser(null);
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
        if (profile?.id_role === 1) {
            navigate(`/admin/requests`, { replace: true });
        } else {
            navigate(`/requests`, { replace: true });
        }
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        navigate('/', { replace: true });
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        // In case it is used outside the provider
        return {
            user: null,
            loading: false,
            login: async () => { },
            logout: async () => { }
        };
    }
    return context;
};