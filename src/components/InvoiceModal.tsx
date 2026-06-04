import { useEffect, useState, useRef } from "react";
import { Loader2, Printer, X, Download } from "lucide-react";
import axios from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Toast } from "@/lib/sweetalert";

interface InvoiceModalProps {
  orderId: number | null;
  onClose: () => void;
}

export default function InvoiceModal({ orderId, onClose }: InvoiceModalProps) {
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);
  const [error, setError] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!orderId) return;
    
    const fetchInvoice = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`/api/orders/${orderId}/invoice`);
        setInvoice(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Gagal memuat invoice");
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvoice();
  }, [orderId]);

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    try {
      setIsDownloading(true);
      const htmlToImage = await import("html-to-image");
      const { jsPDF } = await import("jspdf");

      const imgData = await htmlToImage.toPng(printRef.current, {
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });
      
      // A4 Portrait is 210 x 297 mm
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (printRef.current.offsetHeight * pdfWidth) / printRef.current.offsetWidth;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${invoice.invoice_number}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF", error);
      Toast.fire({ icon: 'error', title: 'Gagal mengunduh Invoice PDF' });
    } finally {
      setIsDownloading(false);
    }
  };

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  return (
    <>
      <AnimatePresence>
        {orderId && (
          <div key="modal-overlay" className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm print:bg-white print:backdrop-blur-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative"
            >
              {/* Top Decorative Bar */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-500 to-blue-500"></div>
              
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-xl font-black text-slate-800">Bukti Pembelian</h2>
                <button 
                  onClick={onClose} 
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-6 sm:p-10 bg-slate-50 relative">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-brand-600">
                    <Loader2 className="animate-spin mb-4" size={48} />
                    <p className="font-bold text-slate-500">Membuat Invoice...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <X size={32} />
                    </div>
                    <p className="text-lg font-bold text-slate-800">{error}</p>
                    <p className="text-slate-500 mt-2">Pastikan pesanan ini sudah dikonfirmasi admin.</p>
                  </div>
                ) : invoice ? (
                  <div className="bg-white shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden max-w-2xl mx-auto border border-slate-100">
                    {/* INVOICE CONTENT TO PRINT */}
                    <div id="print-area" ref={printRef} className="p-8 sm:p-12 bg-white">
                      {/* Header Invoice */}
                      <div className="flex justify-between items-start mb-12 border-b-2 border-slate-100 pb-8">
                        <div>
                          <div className="text-2xl font-black text-brand-600 tracking-tight flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-brand-600 text-white rounded-lg flex items-center justify-center text-lg">T</div>
                            Taktik Ujian
                          </div>
                          <p className="text-slate-500 text-sm">Platform Tryout CPNS & Kedinasan<br/>Bimbingan Belajar Online Terpercaya</p>
                        </div>
                        <div className="text-right">
                          <h1 className="text-3xl font-black text-slate-200 uppercase tracking-widest mb-2">INVOICE</h1>
                          <p className="text-sm font-bold text-slate-800">{invoice.invoice_number}</p>
                          <p className="text-sm text-slate-500">{new Date(invoice.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="grid grid-cols-2 gap-8 mb-12">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Diterbitkan Untuk:</p>
                          <p className="text-lg font-black text-slate-800">{invoice.user.name}</p>
                          <p className="text-slate-600">{invoice.user.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Status Pembayaran:</p>
                          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-black tracking-wide border border-emerald-200">
                            {invoice.status}
                          </div>
                        </div>
                      </div>

                      {/* Order Details Table */}
                      <table className="w-full text-left mb-12">
                        <thead>
                          <tr className="border-y-2 border-slate-100">
                            <th className="py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Deskripsi Item</th>
                            <th className="py-4 text-sm font-bold text-slate-500 uppercase tracking-wider text-right">Harga</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="py-6">
                              <p className="font-bold text-slate-800 text-lg">{invoice.item.name}</p>
                              <p className="text-sm text-slate-500 mt-1">Tipe: {invoice.item.type}</p>
                            </td>
                            <td className="py-6 font-bold text-slate-800 text-right text-lg">
                              {formatRupiah(invoice.item.price)}
                            </td>
                          </tr>
                          {invoice.discount > 0 && (
                            <tr>
                              <td className="py-4 text-right font-medium text-slate-600">
                                Diskon Voucher {invoice.voucher_code ? `(${invoice.voucher_code})` : ''}
                              </td>
                              <td className="py-4 text-right font-bold text-red-500">
                                - {formatRupiah(invoice.discount)}
                              </td>
                            </tr>
                          )}
                        </tbody>
                        <tfoot>
                          <tr className="border-t-2 border-slate-800">
                            <td className="py-6 text-right font-bold text-slate-500 uppercase tracking-wider">
                              Total Pembayaran
                            </td>
                            <td className="py-6 text-right font-black text-brand-600 text-2xl">
                              {formatRupiah(invoice.total)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>

                      <div className="text-center pt-8 border-t border-slate-100">
                        <p className="text-slate-500 font-medium">Terima kasih telah mempercayakan persiapan ujian Anda bersama Taktik Ujian.</p>
                        <p className="text-sm text-slate-400 mt-2">Invoice ini sah dan digenerate secara otomatis oleh sistem.</p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="p-6 bg-white border-t border-slate-100 flex justify-end gap-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Tutup
                </button>
                {invoice && (
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="px-8 py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 disabled:cursor-not-allowed transition-colors shadow-lg shadow-brand-500/30 flex items-center gap-2"
                  >
                    {isDownloading ? (
                      <><Loader2 className="animate-spin" size={20} /> Memproses PDF...</>
                    ) : (
                      <><Download size={20} /> Unduh Invoice PDF</>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Note: Print styles are removed because we use download PDF now */}
    </>
  );
}
