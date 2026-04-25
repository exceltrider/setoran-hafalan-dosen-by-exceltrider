import { Search, Users, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export const StudentsList = ({ students, onSelectStudent }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter(s =>
    s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.nim.includes(searchQuery)
  );

  const groupedByBatch = filteredStudents.reduce((acc, student) => {
    const batch = student.angkatan;
    if (!acc[batch]) acc[batch] = [];
    acc[batch].push(student);
    return acc;
  }, {});

  const sortedBatches = Object.keys(groupedByBatch).sort((a, b) => b - a);

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Daftar Mahasiswa</h1>
        <p className="text-gray-500 mt-1">Pantau progres setoran hafalan mahasiswa bimbingan Anda</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari nama atau NIM..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-sm"
        />
      </div>

      {/* Student Cards by Batch */}
      {sortedBatches.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">Tidak ada mahasiswa ditemukan</p>
        </div>
      ) : (
        sortedBatches.map(batch => (
          <div key={batch} className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Angkatan {batch}</h2>
              <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                {groupedByBatch[batch].length} Mahasiswa
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {groupedByBatch[batch].map((student) => {
                const setoranCount = student.info_setoran?.total_sudah_setor || 0;
                const isActive = setoranCount > 0;
                const progress = student.info_setoran?.persentase_progres_setor || 0;
                const lastSetor = student.info_setoran?.tgl_terakhir_setor;
                return (
                  <button
                    key={student.nim}
                    onClick={() => onSelectStudent(student)}
                    className="bg-white rounded-2xl p-5 text-left border border-gray-100 hover:shadow-lg transition-all duration-200 group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
                          <span className="text-white font-bold text-sm">
                            {student.nama.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">{student.nama}</p>
                          <p className="text-xs text-gray-400">{student.nim}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {isActive ? 'AKTIF' : 'STAGNAN'}
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{setoranCount}</p>
                        <p className="text-xs text-gray-400">surah tervalidasi</p>
                      </div>
                      {lastSetor && (
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Terakhir</p>
                          <p className="text-sm font-medium text-gray-700">{new Date(lastSetor).toLocaleDateString('id-ID')}</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};