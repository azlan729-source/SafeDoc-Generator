import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Documents from '../pages/Documents';
import HIRARCBuilder from '../pages/HIRARCBuilder';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/MainLayout';

const AppRoutes = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Documents />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hirarc-builder"
        element={
          <ProtectedRoute>
            <MainLayout>
              <HIRARCBuilder />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </HashRouter>
);

export default AppRoutes;
