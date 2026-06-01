import React from 'react';

interface CertificateProps {
  userName: string;
  tryoutTitle: string;
  totalScore: number;
  scoreTwk: number;
  scoreTiu: number;
  scoreTkp: number;
  isPassed: boolean;
  dateStr: string;
}

// Komponen ini tidak akan ditampilkan di layar secara normal (di-hide via CSS parent),
// tetapi akan di-capture oleh html2canvas.
export const CertificateTemplate = React.forwardRef<HTMLDivElement, CertificateProps>(({
  userName,
  tryoutTitle,
  totalScore,
  scoreTwk,
  scoreTiu,
  scoreTkp,
  isPassed,
  dateStr
}, ref) => {
  return (
    <div 
      ref={ref} 
      className="bg-white" 
      style={{
        width: '1122px', // Ukuran A4 Landscape proporsional (96 DPI)
        height: '793px',
        padding: '40px',
        position: 'relative',
        boxSizing: 'border-box',
        color: '#1e293b', // slate-800
        fontFamily: 'sans-serif'
      }}
    >
      {/* Border & Background Graphics */}
      <div 
        style={{
          position: 'absolute',
          top: '20px', left: '20px', right: '20px', bottom: '20px',
          border: '8px solid #0f172a', // slate-900
          borderRadius: '16px',
          pointerEvents: 'none',
        }}
      />
      <div 
        style={{
          position: 'absolute',
          top: '32px', left: '32px', right: '32px', bottom: '32px',
          border: '2px solid #cbd5e1', // slate-300
          borderRadius: '8px',
          pointerEvents: 'none',
        }}
      />
      
      {/* Background Pattern */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '2px', color: '#0f172a', margin: 0, textTransform: 'uppercase' }}>
            Rapor Hasil Ujian
          </h1>
          <p style={{ fontSize: '20px', color: '#64748b', fontWeight: 600, marginTop: '8px', letterSpacing: '4px', textTransform: 'uppercase' }}>
            Taktik Ujian CPNS
          </p>
        </div>

        {/* Body */}
        <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontSize: '20px', color: '#475569', marginBottom: '16px' }}>Diberikan kepada:</p>
          <h2 style={{ fontSize: '56px', fontWeight: 800, color: '#0f172a', margin: '0 0 32px 0', fontFamily: 'serif', fontStyle: 'italic' }}>
            {userName}
          </h2>
          <p style={{ fontSize: '20px', color: '#475569', marginBottom: '16px' }}>
            Atas partisipasinya dalam mengikuti simulasi:
          </p>
          <h3 style={{ fontSize: '32px', fontWeight: 700, color: '#1d4ed8', margin: '0' }}>
            {tryoutTitle}
          </h3>
        </div>

        {/* Score Breakdown Box */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '40px' }}>
          <div style={{ border: '2px solid #e2e8f0', borderRadius: '12px', padding: '16px 32px', textAlign: 'center', backgroundColor: '#f8fafc', width: '160px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#64748b', margin: '0 0 8px 0', textTransform: 'uppercase' }}>TWK</p>
            <p style={{ fontSize: '36px', fontWeight: 900, color: '#0f172a', margin: 0 }}>{scoreTwk}</p>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>PG: 65</p>
          </div>
          <div style={{ border: '2px solid #e2e8f0', borderRadius: '12px', padding: '16px 32px', textAlign: 'center', backgroundColor: '#f8fafc', width: '160px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#64748b', margin: '0 0 8px 0', textTransform: 'uppercase' }}>TIU</p>
            <p style={{ fontSize: '36px', fontWeight: 900, color: '#0f172a', margin: 0 }}>{scoreTiu}</p>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>PG: 80</p>
          </div>
          <div style={{ border: '2px solid #e2e8f0', borderRadius: '12px', padding: '16px 32px', textAlign: 'center', backgroundColor: '#f8fafc', width: '160px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#64748b', margin: '0 0 8px 0', textTransform: 'uppercase' }}>TKP</p>
            <p style={{ fontSize: '36px', fontWeight: 900, color: '#0f172a', margin: 0 }}>{scoreTkp}</p>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>PG: 166</p>
          </div>
          
          <div style={{ border: isPassed ? '2px solid #10b981' : '2px solid #ef4444', borderRadius: '12px', padding: '16px 32px', textAlign: 'center', backgroundColor: isPassed ? '#ecfdf5' : '#fef2f2', width: '220px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: isPassed ? '#059669' : '#dc2626', margin: '0 0 8px 0', textTransform: 'uppercase' }}>Total Skor</p>
            <p style={{ fontSize: '48px', fontWeight: 900, color: isPassed ? '#047857' : '#b91c1c', margin: '-6px 0 0 0' }}>{totalScore}</p>
            <div style={{ 
              backgroundColor: isPassed ? '#10b981' : '#ef4444', 
              color: 'white', 
              padding: '4px 12px', 
              borderRadius: '20px', 
              fontSize: '12px', 
              fontWeight: 800,
              display: 'inline-block',
              marginTop: '8px'
            }}>
              {isPassed ? 'LULUS PASSING GRADE' : 'TIDAK LULUS'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 20px', marginBottom: '20px' }}>
          <div>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Dicetak pada:</p>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', margin: '4px 0 0 0' }}>{dateStr}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '24px', fontWeight: 900, color: '#1d4ed8', margin: 0, fontStyle: 'italic' }}>Taktik Ujian!</p>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>Platform Simulasi SKD Terpercaya</p>
          </div>
        </div>

      </div>
    </div>
  );
});

CertificateTemplate.displayName = "CertificateTemplate";
