import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from './Sidebar';
import { getDosenInfo } from '../lib/api';
import { Toast } from './Toast';
import { LoadingSpinner } from './LoadingSpinner';

export const AuthenticatedLayout = () => {
  const { user, logout } = useAuth();
  const [dosenData, setDosenData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const fetchDosenData = async () => {
    setLoading(true);
    try {
      const response = await getDosenInfo();
      if (response.response) {
        setDosenData(response.data);
        setStudents(response.data.info_mahasiswa_pa.daftar_mahasiswa || []);
      }
    } catch (error) {
      console.error('Failed to fetch dosen data:', error);
      setToast({ message: 'Gagal memuat data mahasiswa', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDosenData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Sidebar
        currentView={window.location.pathname.split('/')[1] || 'dashboard'}
        onViewChange={(view) => navigate(`/${view}`)}
        onLogout={handleLogout}
        dosenName={dosenData?.nama || user?.name}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet context={{ students, dosenData, refresh: fetchDosenData }} />
        </div>
      </main>
    </div>
  );
};