import { LayoutDashboard, BookOpen, LogOut, Users } from 'lucide-react';

export const Sidebar = ({ currentView, onViewChange, onLogout, dosenName }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Daftar Mahasiswa', icon: Users },
  ];

  return (
    <aside className="w-72 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 flex flex-col shadow-2xl">
      <div className="p-6 border-b border-emerald-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Setoran Hafalan</h1>
            <p className="text-emerald-300 text-xs tracking-wide">Dosen PA · Kelola Hafalan</p>
            <p className="text-gray-400 text-[10px] mt-0.5">by Excel Tri Dermawan</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 border-b border-emerald-800/50">
        <p className="text-emerald-300/60 text-[10px] font-semibold uppercase tracking-wider mb-2">Semester Aktif</p>
        <p className="text-white font-semibold text-sm">Ganjil 2025/2026</p>
        <div className="mt-3 h-1.5 bg-emerald-800/50 rounded-full overflow-hidden">
          <div className="h-full w-[68%] bg-emerald-400 rounded-full"></div>
        </div>
        <p className="text-emerald-300/50 text-xs mt-2">68% berjalan</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 shadow-sm'
                  : 'text-emerald-100/70 hover:bg-emerald-800/30 hover:text-emerald-200'
              }`}
            >
              <Icon className="w-4.5 h-4.5" strokeWidth={1.8} />
              <span className="text-sm font-medium">{item.label}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400"></div>}
            </button>
          );
        })}
      </nav>

      <div className="p-5 border-t border-emerald-800/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">
              {dosenName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{dosenName || 'Dosen Pembimbing'}</p>
            <p className="text-emerald-300/60 text-xs">Dosen PA</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-colors duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Keluar</span>
        </button>
      </div>
    </aside>
  );
};