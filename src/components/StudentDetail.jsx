// src/components/StudentDetail.jsx
import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Calendar, CheckCircle2, XCircle, Shield, Clock, Save, Loader2 } from 'lucide-react';
import { getStudentDetail, saveSetoran, deleteSetoran } from '../lib/api';
import { LoadingSpinner } from './LoadingSpinner';
import { Toast } from './Toast';

export const StudentDetail = ({ student: initialStudent, onBack, onRefresh }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedSurahs, setSelectedSurahs] = useState([]);
  const [setoranDate, setSetoranDate] = useState('');
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchStudentDetail();
  }, [initialStudent.nim]);

  const fetchStudentDetail = async () => {
    setLoading(true);
    try {
      const response = await getStudentDetail(initialStudent.nim);
      if (response.response) {
        setStudent({
          ...initialStudent,
          detail: response.data,
          setoranList: response.data.setoran.detail || [],
          logs: response.data.setoran.log || [],
          infoDasar: response.data.setoran.info_dasar || {},
        });
      }
    } catch (error) {
      console.error('Failed to fetch student detail:', error);
      setToast({ message: 'Gagal memuat data mahasiswa', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const availableSurahs = student?.setoranList?.filter(s => !s.sudah_setor) || [];
  const submittedSurahs = student?.setoranList?.filter(s => s.sudah_setor) || [];

  const handleAddSetoran = async () => {
    if (selectedSurahs.length === 0) {
      setToast({ message: 'Pilih minimal satu surah untuk disetor', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const dataSetoran = selectedSurahs.map(surahId => {
        const surah = availableSurahs.find(s => s.id === surahId);
        return {
          id_komponen_setoran: surah.id,
          nama_komponen_setoran: surah.nama,
        };
      });

      await saveSetoran(student.nim, dataSetoran, setoranDate || null);
      setToast({ message: `${dataSetoran.length} surah berhasil divalidasi! ✨`, type: 'success' });
      setSelectedSurahs([]);
      setSetoranDate('');
      await fetchStudentDetail();
      if (onRefresh) onRefresh();
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Gagal menyimpan setoran', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSetoran = async (setoranItem) => {
    setSubmitting(true);
    try {
      const dataSetoran = [{
        id: setoranItem.info_setoran.id,
        id_komponen_setoran: setoranItem.id,
        nama_komponen_setoran: setoranItem.nama,
      }];
      await deleteSetoran(student.nim, dataSetoran);
      setToast({ message: `Setoran ${setoranItem.nama} berhasil dibatalkan`, type: 'success' });
      setDeleteConfirm(null);
      await fetchStudentDetail();
      if (onRefresh) onRefresh();
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Gagal membatalkan setoran', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSurahSelection = (surahId) => {
    setSelectedSurahs(prev =>
      prev.includes(surahId) ? prev.filter(id => id !== surahId) : [...prev, surahId]
    );
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-slide-up">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4.5 h-4.5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{student.nama}</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-gray-500">{student.nim}</p>
            <span className="text-gray-300">•</span>
            <p className="text-sm text-gray-500">Angkatan {student.angkatan}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-emerald-600">{student.infoDasar?.total_sudah_setor || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Surah Tervalidasi</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-blue-600">{student.infoDasar?.total_wajib_setor || 37}</p>
          <p className="text-xs text-gray-500 mt-1">Total Wajib Setor</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-amber-600">{student.infoDasar?.persentase_progres_setor || 0}%</p>
          <p className="text-xs text-gray-500 mt-1">Progres Keseluruhan</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm font-medium text-gray-700">Terakhir Setor</p>
          <p className="text-xs text-gray-500 mt-1">{student.infoDasar?.terakhir_setor || 'Belum ada'}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <Plus className="w-5 h-5 text-emerald-600" />
          <h2 className="font-semibold text-gray-900">Tambah Setoran Baru</h2>
        </div>

        {availableSurahs.length === 0 ? (
          <p className="text-gray-400 text-sm py-4 text-center">Semua surah sudah disetorkan. 🎉</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {availableSurahs.map(surah => (
                <label key={surah.id} className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedSurahs.includes(surah.id)}
                    onChange={() => toggleSurahSelection(surah.id)}
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{surah.nama}</p>
                    <p className="text-xs text-gray-400">{surah.nama_arab}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-gray-50">
                <Calendar className="w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={setoranDate}
                  onChange={(e) => setSetoranDate(e.target.value)}
                  className="bg-transparent text-sm focus:outline-none text-gray-700"
                />
              </div>
              <button
                onClick={handleAddSetoran}
                disabled={submitting || selectedSurahs.length === 0}
                className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-xl transition-colors font-medium text-sm"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Validasi Setoran ({selectedSurahs.length})
              </button>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h2 className="font-semibold text-gray-900">Riwayat Setoran</h2>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">{submittedSurahs.length} Surah</span>
          </div>
          {submittedSurahs.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Belum ada setoran tervalidasi</p>
          ) : (
            <div className="space-y-3">
              {submittedSurahs.map((surah) => (
                <div key={surah.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{surah.nama}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{surah.nama_arab}</span>
                        <span>•</span>
                        <span>{surah.label}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {surah.info_setoran?.tgl_setoran && new Date(surah.info_setoran.tgl_setoran).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDeleteConfirm(surah)}
                    disabled={submitting}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="w-5 h-5 text-gray-500" />
            <h2 className="font-semibold text-gray-900">Audit Log Aktivitas</h2>
          </div>
          {student.logs?.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Belum ada aktivitas tercatat</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {student.logs?.map((log, idx) => (
                <div key={log.id || idx} className="relative pl-6 pb-4 border-l-2 last:border-l-0 border-gray-200">
                  <div className={`absolute left-[-6px] top-0 w-3 h-3 rounded-full ${log.aksi === 'VALIDASI' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${log.aksi === 'VALIDASI' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {log.aksi}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleString('id-ID')}</span>
                  </div>
                  <p className="text-sm text-gray-700">{log.keterangan}</p>
                  <p className="text-xs text-gray-400 mt-1">Oleh: {log.dosen_yang_mengesahkan?.nama || 'Dosen PA'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Hapus Setoran?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Setoran surah <span className="font-semibold text-gray-700">"{deleteConfirm.nama}"</span> akan dibatalkan. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteSetoran(deleteConfirm)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};