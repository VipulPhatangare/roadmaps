import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Roadmaps } from './pages/Roadmaps';
import { RoadmapView } from './pages/RoadmapView';
import { MyRoadmaps } from './pages/MyRoadmaps';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminDomains } from './pages/admin/AdminDomains';
import { AdminGeneration } from './pages/admin/AdminGeneration';
import { AdminApiDocs } from './pages/admin/AdminApiDocs';
import { useAuthStore } from './store/useAuthStore';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'EDITOR';
  return isAuthenticated && isAdmin ? <>{children}</> : <Navigate to="/login" replace />;
};

export function App() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/roadmaps" element={<Roadmaps />} />
          <Route path="/roadmaps/:slug" element={<RoadmapView />} />
          <Route
            path="/my-roadmaps"
            element={
              <ProtectedRoute>
                <MyRoadmaps />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/domains"
            element={
              <AdminRoute>
                <AdminDomains />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/generation"
            element={
              <AdminRoute>
                <AdminGeneration />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/api-docs"
            element={
              <AdminRoute>
                <AdminApiDocs />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
