import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './states/AuthContext';
// Auth Pages
import Login from './pages/auth/LoginPage';
// Admin Pages
import RequestsPage from './pages/admin/RequestsPage';
import AccountingPage from './pages/admin/AccountingPage';
import ProgramsPage from './pages/admin/ProgramsPage';
import UsersPage from './pages/admin/UsersPage';
// Other Pages
import NotFound from './pages/NotFound';
// Hooks
import ProtectedRoute from './hooks/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* Public route for login */}
          <Route path="/" element={<Login />} />
          {/* Protected routes for administrators (id_role = 1) */}
          <Route
            path="/admin/requests"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <RequestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/accounting"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <AccountingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/programs"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <ProgramsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          {/* Route to handle not found pages */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;