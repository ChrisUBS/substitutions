import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './states/AuthContext';
// Pages
import Login from './pages/auth/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProjectsTopListPage from './pages/admin/dashboard/ProjectsTopListPage';
import JudgesPage from './pages/admin/JudgesPage';
import AddProjectsJudge from './pages/admin/judges/AddProjectsJudgePage';
import ProjectsPage from './pages/admin/ProjectsPage';
import AddEditProjectsPage from './pages/admin/projects/AddEditProjectsPage';
import ProjectDetailsPage from './pages/admin/dashboard/ProjectDetailsPage';
import EvaluationDetailsPage from './pages/admin/dashboard/EvaluationDetailsPage';
import PeriodsPage from './pages/admin/PeriodsPage';
import HelpPage from './pages/admin/HelpPage';
import EvaluationsPage from './pages/judge/EvaluationsPage'
import GradeProjectPage from './pages/judge/GradeProjectPage'
import NotFound from './pages/NotFound';
// Hooks
import ProtectedRoute from './hooks/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* Ruta pública para login */}
          <Route path="/" element={<Login />} />
          {/* Rutas protegidas para administradores (id_role = 1) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/:stage/:level/:category?/:campus?"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <ProjectsTopListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/:stage/:level/:category/:campus/:id"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <ProjectDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/:stage/:level/:category/:campus/:id/evaluation/:evaluationId"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <EvaluationDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/judges"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <JudgesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/judges/:mode"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <AddProjectsJudge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/add"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <AddEditProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id/edit"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <AddEditProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/periods"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <PeriodsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/help"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <HelpPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/evaluations"
            element={
              <ProtectedRoute allowedRoles={[3]}>
                <EvaluationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/evaluations/:id/grade"
            element={
              <ProtectedRoute allowedRoles={[3]}>
                <GradeProjectPage />
              </ProtectedRoute>
            }
          />
          {/* Ruta para manejar páginas no encontradas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;