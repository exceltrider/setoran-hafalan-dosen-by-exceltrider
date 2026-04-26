import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { LoadingSpinner } from './components/LoadingSpinner';
import { LoginPage } from './components/LoginPage';
import { AuthenticatedLayout } from './components/AuthenticatedLayout';
import { Dashboard } from './components/Dashboard';
import { StudentsList } from './components/StudentsList';
import { StudentDetailWrapper } from './components/StudentDetailWrapper';
import { NotFound } from './components/NotFound';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />

      <Route element={user ? <AuthenticatedLayout /> : <Navigate to="/login" />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<StudentsList />} />
        <Route path="/student/:nim" element={<StudentDetailWrapper />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;