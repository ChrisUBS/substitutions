import { Navigate } from 'react-router-dom';
import { useAuth } from '../states/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: number[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex">
            </div>
        );
    }

    if (!user) return <Navigate to="/" replace />;

    if (allowedRoles && !allowedRoles.includes(user.id_role)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
