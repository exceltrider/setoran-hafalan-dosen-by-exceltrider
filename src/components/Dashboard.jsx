import { Users, BookMarked, AlertCircle, TrendingUp, Clock, ChevronRight } from 'lucide-react';

export const Dashboard = ({ students, dosenName, onViewStudents }) => {
  const totalMahasiswa = students.length;
  const aktifMurojaah = students.filter(s => (s.info_setoran?.total_sudah_setor || 0) > 0).length;
  const belumSetor = students.filter(s => (s.info_setoran?.total_sudah_setor || 0) === 0).length;
  const totalSetoran = students.reduce((sum, s) => sum + (s.info_setoran?.total_sudah_setor || 0), 0);

  const stats = [
    { label: 'Total Mahasiswa', value: totalMahasiswa, subtitle: 'Bimbingan Aktif', icon: Users, bg: 'emerald-50', textColor: 'emerald-600' },
    { label: 'Aktif Muroja\'ah', value: aktifMurojaah, subtitle: `${totalMahasiswa ? Math.round((aktifMurojaah / totalMahasiswa) * 100) : 0}% Progress`, icon: BookMarked, bg: 'blue-50', textColor: 'blue-600' },
    { label: 'Belum Setor', value: belumSetor, subtitle: 'Perlu Perhatian', icon: AlertCircle, bg: 'red-50', textColor: 'red-600' },
    { label: 'Total Setoran', value: totalSetoran, subtitle: 'Surah Tervalidasi', icon: TrendingUp, bg: 'amber-50', textColor: 'amber-600' },
  ];

  const topStudents = [...students]
    .sort((a, b) => (b.info_setoran?.total_sudah_setor || 0) - (a.info_setoran?.total_sudah_setor || 0))
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Selamat datang, <span className="font-semibold text-gray-700">{dosenName}</span>
          </p>
        </div>
        <button
          onClick={onViewStudents}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all duration-200 shadow-sm text-sm font-medium"
        >
          Lihat Semua Mahasiswa
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className={`w-11 h-11 rounded-xl bg-${stat.bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 text-${stat.textColor}`} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-700 font-medium mt-1">{stat.label}</p>
              <p className="text-gray-400 text-xs mt-1">{stat.subtitle}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h2 className="font-semibold text-gray-900">Mahasiswa dengan Progres Terbaik</h2>
            </div>
            <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">Top 5</span>
          </div>
          <div className="space-y-4">
            {topStudents.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Belum ada data mahasiswa</p>
            ) : (
              topStudents.map((student, idx) => {
                const progress = student.info_setoran?.persentase_progres_setor || 0;
                return (
                  <div key={student.nim} className="flex items-center gap-3">
                    <div className="w-7 text-sm font-medium text-gray-400">{idx + 1}</div>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-xs shadow-sm">
                      {student.nama.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{student.nama}</p>
                      <p className="text-xs text-gray-400">{student.nim}</p>
                    </div>
                    <div className="w-24">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progress}%` }}></div>
                      </div>
                      <p className="text-right text-xs text-emerald-600 mt-1 font-medium">{progress}%</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <Clock className="w-5 h-5 text-gray-500" />
            <h2 className="font-semibold text-gray-900">Info</h2>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <p className="text-xs text-emerald-700 font-medium">Rata-rata progres</p>
              <p className="text-2xl font-bold text-emerald-800 mt-1">
                {totalMahasiswa ? Math.round((aktifMurojaah / totalMahasiswa) * 100) : 0}%
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <p className="text-xs text-amber-700 font-medium">Perlu Bimbingan</p>
              <p className="text-2xl font-bold text-amber-800 mt-1">{belumSetor} Mahasiswa</p>
              <p className="text-xs text-amber-600 mt-1">Belum memiliki setoran</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <p className="text-xs text-blue-700 font-medium">Total Setoran Tervalidasi</p>
              <p className="text-2xl font-bold text-blue-800 mt-1">{totalSetoran}</p>
              <p className="text-xs text-blue-600 mt-1">Dari 37 surah wajib per mahasiswa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};