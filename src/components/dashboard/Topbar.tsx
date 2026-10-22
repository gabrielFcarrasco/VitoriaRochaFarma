import type { AutorInfo } from '../../config/autorService';

interface TopbarProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
  autorData: AutorInfo;
}

export function Topbar({ setIsSidebarOpen, autorData }: TopbarProps) {
  return (
    <header className="topbar">
      <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 'bold', color: 'var(--cor-texto-escuro)', fontSize: '0.95rem' }}>Dra. {autorData.nome || 'Vitória Rocha'}</span>
          <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: '600' }}>Modo Edição</span>
        </div>
        <div style={{ width: '45px', height: '45px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--cor-lilas)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <img src={autorData.imagemUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    </header>
  );
}