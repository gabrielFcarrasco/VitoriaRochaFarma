import type { AutorInfo } from '../../config/autorService';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  autorData: AutorInfo;
  handleLogout: () => void;
}

export function Sidebar({ isSidebarOpen, setIsSidebarOpen, activeTab, setActiveTab, autorData, handleLogout }: SidebarProps) {
  return (
    <>
      <div className={`overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          {autorData.logoUrl ? (
            <img src={autorData.logoUrl} alt="Logo" style={{ maxHeight: '50px', maxWidth: '100%', objectFit: 'contain' }} />
          ) : (
            <h2 style={{ fontSize: '1.6rem', fontWeight: '900', margin: 0, letterSpacing: '1px' }}>VR FARMA</h2>
          )}
          <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginTop: '8px', fontWeight: 'bold' }}>Workspace</span>
        </div>
        <nav className="sidebar-menu">
          <button className={`menu-item ${activeTab === 'visao-geral' ? 'active' : ''}`} onClick={() => { setActiveTab('visao-geral'); setIsSidebarOpen(false); }}>📊 Visão Geral</button>
          <button className={`menu-item ${activeTab === 'materiais' ? 'active' : ''}`} onClick={() => { setActiveTab('materiais'); setIsSidebarOpen(false); }}>📚 Catálogo</button>
          <button className={`menu-item ${activeTab === 'sobre' ? 'active' : ''}`} onClick={() => { setActiveTab('sobre'); setIsSidebarOpen(false); }}>🎨 Perfil & IA</button>
          <button className={`menu-item ${activeTab === 'textos-home' ? 'active' : ''}`} onClick={() => { setActiveTab('textos-home'); setIsSidebarOpen(false); }}>🏠 Textos da Home</button>
        </nav>
        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={handleLogout} className="menu-item" style={{ width: '100%', color: '#ff7675', justifyContent: 'center', backgroundColor: 'rgba(255,118,117,0.1)' }}>Sair do Sistema</button>
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', fontWeight: 'bold' }}>
            CODIFICADO COM 🤍 PARA VOCÊ
          </div>
        </div>
      </aside>
    </>
  );
}