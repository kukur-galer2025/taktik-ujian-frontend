"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Edit, Trash2, ArrowLeft, Save, X } from "lucide-react";
import axios from "@/lib/axios";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    if (typeof window !== "undefined") {
      (window as any).Quill = RQ.Quill;
    }
    try {
      const { default: ImageResize } = await import("quill-image-resize-module-react");
      RQ.Quill.register("modules/imageResize", ImageResize);
    } catch (e) {
      console.error("Failed to load image resize module", e);
    }
    return RQ;
  },
  { 
    ssr: false,
    loading: () => <div className="h-32 bg-slate-100 animate-pulse rounded-xl"></div>
  }
);

function imageHandler(this: any) {
  const quill = this.quill;
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/png, image/jpeg, image/jpg, image/webp, image/svg+xml');
  input.click();

  input.onchange = () => {
    const file = input.files ? input.files[0] : null;
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        alert('Format gambar tidak didukung! Gunakan PNG, JPG, JPEG, WEBP, atau SVG.');
        return;
      }

      if (file.size > 1 * 1024 * 1024) {
        alert('Ukuran gambar terlalu besar! Maksimal 1MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'image', base64);
        quill.setSelection(range.index + 1, 0);
      };
      reader.readAsDataURL(file);
    }
  };
}

const quillModules = {
  imageResize: {
    parchment: typeof window !== "undefined" ? (window as any).Quill?.import('parchment') : null,
    modules: ['Resize', 'DisplaySize']
  },
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
    handlers: {
      image: imageHandler
    }
  }
};

export default function QuestionManagement({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [tryout, setTryout] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showList, setShowList] = useState(false);
  
  const initialForm = {
    type: 'TWK',
    sub_category: '',
    text: '',
    option_a: '', option_b: '', option_c: '', option_d: '', option_e: '',
    score_a: 0, score_b: 0, score_c: 0, score_d: 0, score_e: 0,
    answer_key: 'A',
    explanation: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchQuestions = async () => {
    try {
      const [res, subRes] = await Promise.all([
        axios.get(`/api/admin/tryouts/${id}/questions`),
        axios.get('/api/admin/subcategories')
      ]);
      setTryout(res.data.tryout);
      setQuestions(res.data.questions);
      setSubCategories(subRes.data);
    } catch (err) {
      console.error(err);
      alert("Gagal memuat soal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [id]);

  const handleTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      type,
      sub_category: '', // Reset sub category when type changes
      // Reset scores based on type
      score_a: type === 'TKP' ? 1 : 0,
      score_b: type === 'TKP' ? 2 : 0,
      score_c: type === 'TKP' ? 3 : 0,
      score_d: type === 'TKP' ? 4 : 0,
      score_e: type === 'TKP' ? 5 : (type === 'TWK' || type === 'TIU' ? 5 : 0),
      answer_key: type === 'TKP' ? 'E' : prev.answer_key
    }));
  };

  const handleAnswerKeyChange = (key: string) => {
    if (formData.type === 'TKP') return; // TKP uses specific score mapping usually
    setFormData(prev => ({
      ...prev,
      answer_key: key,
      score_a: key === 'A' ? 5 : 0,
      score_b: key === 'B' ? 5 : 0,
      score_c: key === 'C' ? 5 : 0,
      score_d: key === 'D' ? 5 : 0,
      score_e: key === 'E' ? 5 : 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/admin/tryouts/${id}/questions/${editingId}`, formData);
      } else {
        await axios.post(`/api/admin/tryouts/${id}/questions`, formData);
      }
      setShowForm(false);
      setFormData(initialForm);
      setEditingId(null);
      fetchQuestions();
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        const errorMessages = Object.values(errors).flat().join('\n');
        alert(`Validasi gagal. Harap lengkapi data berikut:\n${errorMessages}`);
      } else {
        alert("Terjadi kesalahan saat menyimpan soal.");
      }
    }
  };

  const handleDelete = async (qId: number) => {
    if (!confirm("Yakin ingin menghapus soal ini?")) return;
    try {
      await axios.delete(`/api/admin/tryouts/${id}/questions/${qId}`);
      fetchQuestions();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus soal");
    }
  };

  const openEdit = (q: any) => {
    setEditingId(q.id);
    setFormData({
      type: q.type,
      sub_category: q.sub_category || '',
      text: q.text,
      option_a: q.option_a, option_b: q.option_b, option_c: q.option_c, option_d: q.option_d, option_e: q.option_e,
      score_a: q.score_a, score_b: q.score_b, score_c: q.score_c, score_d: q.score_d, score_e: q.score_e,
      answer_key: q.answer_key,
      explanation: q.explanation || ''
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="animate-spin text-brand-500" size={32} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <style dangerouslySetInnerHTML={{__html: `
        .ql-container.ql-snow {
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
          border-color: #e2e8f0;
          font-family: inherit;
        }
        .ql-toolbar.ql-snow {
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
          border-color: #e2e8f0;
          background-color: #f8fafc;
        }
        .ql-editor {
          min-height: 150px;
          font-size: 1rem;
          color: #334155;
        }
        .ql-editor.ql-blank::before {
          font-style: normal;
          color: #94a3b8;
        }
        .option-editor .ql-editor {
          min-height: 80px;
        }
      `}} />
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/tryouts" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 mb-4 transition-colors font-medium">
          <ArrowLeft size={18} /> Kembali ke Tryouts
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Kelola Soal: {tryout?.title}</h1>
            <p className="text-slate-500">Total: {questions.length} Soal</p>
          </div>
          {!showForm && (
            <button 
              onClick={() => {
                setEditingId(null);
                setFormData(initialForm);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-md shadow-brand-500/20"
            >
              <Plus size={20} /> Tambah Soal
            </button>
          )}
        </div>
      </div>

      {/* Form Editor */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-brand-200 p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-500 to-blue-500"></div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Edit size={20} className="text-brand-500" />
              {editingId ? "Edit Soal" : "Buat Soal Baru"}
            </h2>
            <button onClick={() => setShowForm(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Type */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Kategori Soal</label>
              <div className="flex gap-4">
                {['TWK', 'TIU', 'TKP'].map(t => (
                  <label key={t} className={`
                    flex-1 flex items-center justify-center py-3 border-2 rounded-xl cursor-pointer font-bold transition-all
                    ${formData.type === t ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}
                  `}>
                    <input type="radio" name="type" className="hidden" checked={formData.type === t} onChange={() => handleTypeChange(t)} />
                    {t}
                  </label>
                ))}
              </div>
            </div>

            {/* Sub Kategori */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Sub Kategori</label>
              <select
                value={formData.sub_category}
                onChange={(e) => setFormData({...formData, sub_category: e.target.value})}
                className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-medium focus:border-brand-500 focus:outline-none transition-colors"
              >
                <option value="">-- Kosong (Tidak Pakai Sub Kategori) --</option>
                {subCategories
                  .filter(sub => sub.type === formData.type)
                  .map(sub => (
                    <option key={sub.id} value={sub.name}>{sub.name}</option>
                  ))
                }
              </select>
            </div>

            {/* Row 2: Question Text */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Pertanyaan</label>
              <div className="bg-white rounded-xl focus-within:ring-2 focus-within:ring-brand-500 shadow-sm">
                <ReactQuill 
                  theme="snow"
                  modules={quillModules}
                  value={formData.text}
                  onChange={(val) => setFormData(prev => prev.text === val ? prev : {...prev, text: val})}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">💡 Anda dapat mengunggah gambar dengan menekan ikon gambar di toolbar (Maks 1MB, Format: JPG/PNG/WebP/SVG).</p>
            </div>

            {/* Row 3: Options */}
            <div className="space-y-6 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Pilihan Jawaban</h3>
              
              {['a', 'b', 'c', 'd', 'e'].map((opt) => (
                <div key={opt} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-500 uppercase shrink-0 mt-2">
                    {opt}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="bg-white rounded-xl focus-within:ring-2 focus-within:ring-brand-500 option-editor shadow-sm">
                      <ReactQuill 
                        theme="snow"
                        modules={quillModules}
                        value={(formData as any)[`option_${opt}`]}
                        onChange={(val) => setFormData(prev => (prev as any)[`option_${opt}`] === val ? prev : {...prev, [`option_${opt}`]: val})}
                      />
                    </div>
                    {formData.type === 'TKP' && (
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-slate-500">Poin TKP:</label>
                        <input 
                          type="number" min="1" max="5" required
                          value={(formData as any)[`score_${opt}`]}
                          onChange={(e) => setFormData({...formData, [`score_${opt}`]: parseInt(e.target.value)})}
                          className="w-20 bg-white border border-slate-200 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-brand-500 outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Row 4: Answer Key (For TWK/TIU) */}
            {formData.type !== 'TKP' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Kunci Jawaban Benar (Poin 5)</label>
                <div className="flex gap-2">
                  {['A', 'B', 'C', 'D', 'E'].map(k => (
                    <label key={k} className={`
                      w-12 h-12 flex items-center justify-center border-2 rounded-xl cursor-pointer font-bold transition-all
                      ${formData.answer_key === k ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'}
                    `}>
                      <input type="radio" name="key" className="hidden" checked={formData.answer_key === k} onChange={() => handleAnswerKeyChange(k)} />
                      {k}
                    </label>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">*Jawaban selain kunci ini akan otomatis bernilai 0.</p>
              </div>
            )}

            {/* Row 5: Explanation */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Pembahasan (Opsional)</label>
              <div className="bg-white rounded-xl focus-within:ring-2 focus-within:ring-brand-500 shadow-sm">
                <ReactQuill 
                  theme="snow"
                  modules={quillModules}
                  value={formData.explanation}
                  onChange={(val) => setFormData(prev => prev.explanation === val ? prev : {...prev, explanation: val})}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                Batal
              </button>
              <button type="submit" className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-md shadow-brand-500/20">
                <Save size={20} /> Simpan Soal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Questions List Toggle */}
      {!showForm && questions.length > 0 && (
        <div className="flex justify-center mb-6">
          <button 
            onClick={() => setShowList(!showList)}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            {showList ? "Sembunyikan Daftar Soal" : `Lihat Daftar Soal (${questions.length})`}
          </button>
        </div>
      )}

      {/* Questions List */}
      {showList && !showForm && (
        <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-lg text-sm">Soal #{idx + 1}</span>
                <span className={`font-bold px-3 py-1 rounded-lg text-sm uppercase ${q.type === 'TKP' ? 'bg-blue-100 text-blue-700' : 'bg-brand-100 text-brand-700'}`}>
                  {q.type}
                </span>
                {q.sub_category && (
                  <span className="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-lg text-sm">
                    {q.sub_category}
                  </span>
                )}
              </div>
              <div className="prose prose-sm max-w-none text-slate-800 mb-4" dangerouslySetInnerHTML={{ __html: q.text }}></div>
              
              {/* Show options briefly */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
                {['A', 'B', 'C', 'D', 'E'].map(opt => {
                  const val = q[`option_${opt.toLowerCase()}`];
                  const score = q[`score_${opt.toLowerCase()}`];
                  const isKey = q.type !== 'TKP' && q.answer_key === opt;
                  return (
                    <div key={opt} className={`p-3 rounded-lg border flex flex-col ${isKey ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-100 bg-slate-50'}`}>
                      <div className="flex items-start">
                        <span className="font-bold mr-2 mt-0.5">{opt}.</span>
                        <div className="prose prose-sm max-w-none line-clamp-2 overflow-hidden flex-1" dangerouslySetInnerHTML={{ __html: val }}></div>
                        {q.type === 'TKP' && <span className="ml-2 font-bold text-blue-600 shrink-0">({score})</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex md:flex-col gap-2 shrink-0 md:w-32 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 justify-center">
              <button 
                onClick={() => openEdit(q)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-xl font-bold transition-colors"
              >
                <Edit size={16} /> Edit
              </button>
              <button 
                onClick={() => handleDelete(q.id)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl font-bold transition-colors"
              >
                <Trash2 size={16} /> Hapus
              </button>
            </div>
          </div>
        ))}

        {questions.length === 0 && !showForm && (
          <div className="text-center p-12 bg-white rounded-3xl border border-slate-200 border-dashed">
            <p className="text-slate-500 font-medium text-lg">Belum ada soal di paket ini. Klik "Tambah Soal" untuk memulai.</p>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
