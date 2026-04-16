import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import PurchasesPage from './pages/PurchasesPage';
import TransfersPage from './pages/TransfersPage';
import AssignmentsPage from './pages/AssignmentsPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function HomeRoute() {
  const { user } = useAuth();

  if (user?.role === 'LOGISTICS_OFFICER') {
    return <Navigate to="/purchases" replace />;
  }

  return <DashboardPage />;
}

function Shell({ children }) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl flex-col gap-4 lg:flex-row">
        <Sidebar />
        <main className="flex-1 rounded-[2rem] border border-white/10 bg-slate-950/75 p-4 shadow-panel backdrop-blur lg:p-6">
          <div className="mb-5 flex items-center justify-end">
            <button onClick={logout} className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-sand/70 hover:text-white">Logout</button>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={<ProtectedRoute><Shell><HomeRoute /></Shell></ProtectedRoute>} />
      <Route path="/purchases" element={<ProtectedRoute><Shell><PurchasesPage /></Shell></ProtectedRoute>} />
      <Route path="/transfers" element={<ProtectedRoute><Shell><TransfersPage /></Shell></ProtectedRoute>} />
      <Route path="/assignments" element={<ProtectedRoute><Shell><AssignmentsPage /></Shell></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
