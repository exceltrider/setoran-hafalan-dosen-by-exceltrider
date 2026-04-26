import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(username, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 text-white flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="white" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="white" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-xl">Setor Hafalan</p>
            <p className="text-emerald-200 text-xs">Dosen Pembimbing Akademik</p>
            <p className="text-gray-400 text-[10px] mt-0.5">by Excel Tri Dermawan</p>
          </div>
        </div>
        <div className="max-w-md">
          <h1 className="text-4xl font-bold leading-tight mb-4">Pantau Hafalan Mahasiswa<br /><span className="text-emerald-300">Dengan Lebih Mudah</span></h1>
          <p className="text-emerald-100/70 text-sm">Platform digital untuk dosen pembimbing dalam memantau progres setoran hafalan surah mahasiswa secara efisien dan real-time.</p>
        </div>
        <div className="flex gap-8">
          <div><p className="text-2xl font-bold">38+</p><p className="text-xs text-emerald-200">Mahasiswa Aktif</p></div>
          <div><p className="text-2xl font-bold">100%</p><p className="text-xs text-emerald-200">Terdigitalisasi</p></div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Selamat Datang</h2>
            <p className="text-gray-500 text-sm mt-1">Masuk ke dashboard dosen pembimbing</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 hidden lg:block">Masuk</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="Masukkan email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="Masukkan password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}