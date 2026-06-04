import Swal from 'sweetalert2';

// Toast Notification (Kecil di pojok)
export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    popup: 'rounded-xl shadow-lg border border-slate-100',
    title: 'text-sm font-bold text-slate-800',
  },
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

// Dialog Modal (Pop-up di tengah)
export const Dialog = Swal.mixin({
  customClass: {
    popup: 'rounded-2xl shadow-2xl border border-slate-100 p-2 sm:p-4',
    title: 'text-lg sm:text-xl font-black text-slate-900',
    htmlContainer: 'text-slate-500 text-sm sm:text-base font-medium mt-2',
    confirmButton: 'bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 transition-colors shadow-sm shadow-brand-500/20 mx-1.5 sm:mx-2 text-sm sm:text-base',
    cancelButton: 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 transition-colors mx-1.5 sm:mx-2 text-sm sm:text-base',
    actions: 'mt-6 sm:mt-8 flex justify-center gap-1 sm:gap-2'
  },
  buttonsStyling: false,
});
